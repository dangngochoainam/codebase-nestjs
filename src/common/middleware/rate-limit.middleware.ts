import {
    Injectable,
    NestMiddleware,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SystemLoggerService } from '../logger/system-logger.service';
import { HTTP_HEADERS } from '../constants';

interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
    message?: string;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
    // TODO: Add a database to store the request counts
    private requestCounts = new Map<
        string,
        { count: number; resetTime: number }
    >();
    private readonly config: RateLimitConfig;

    constructor(private readonly systemLogger: SystemLoggerService) {
        this.config = {
            windowMs: 15 * 60 * 1000, // 15 minutes
            maxRequests: 100, // limit each IP to 100 requests per windowMs
            message: 'Too many requests from this IP, please try again later.',
            skipSuccessfulRequests: false,
            skipFailedRequests: false,
        };
    }

    use(req: Request, res: Response, next: NextFunction) {
        const clientIp = this.getClientIp(req);
        const now = Date.now();
        const windowStart = now - this.config.windowMs;

        // Clean up old entries
        this.cleanupOldEntries(windowStart);

        // Get or create client record
        const clientRecord = this.requestCounts.get(clientIp) || {
            count: 0,
            resetTime: now + this.config.windowMs,
        };

        // Check if window has expired
        if (clientRecord.resetTime <= now) {
            clientRecord.count = 0;
            clientRecord.resetTime = now + this.config.windowMs;
        }

        // Increment request count
        clientRecord.count++;
        this.requestCounts.set(clientIp, clientRecord);

        // Check if limit exceeded
        if (clientRecord.count > this.config.maxRequests) {
            // Log rate limit violation
            this.systemLogger.logSecurityEvent('RATE_LIMIT_EXCEEDED', {
                clientIp,
                requestCount: clientRecord.count,
                maxRequests: this.config.maxRequests,
                windowMs: this.config.windowMs,
                userAgent: req.get('User-Agent'),
                url: req.url,
                method: req.method,
            });

            // Set rate limit headers
            res.setHeader(
                HTTP_HEADERS.RATE_LIMIT_LIMIT,
                this.config.maxRequests,
            );
            res.setHeader(
                HTTP_HEADERS.RATE_LIMIT_REMAINING,
                Math.max(0, this.config.maxRequests - clientRecord.count),
            );
            res.setHeader(
                HTTP_HEADERS.RATE_LIMIT_RESET,
                new Date(clientRecord.resetTime).toISOString(),
            );

            throw new HttpException(
                {
                    statusCode: HttpStatus.TOO_MANY_REQUESTS,
                    message: this.config.message,
                    error: 'Too Many Requests',
                },
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }

        // Set rate limit headers for successful requests
        res.setHeader(HTTP_HEADERS.RATE_LIMIT_LIMIT, this.config.maxRequests);
        res.setHeader(
            HTTP_HEADERS.RATE_LIMIT_REMAINING,
            Math.max(0, this.config.maxRequests - clientRecord.count),
        );
        res.setHeader(
            HTTP_HEADERS.RATE_LIMIT_RESET,
            new Date(clientRecord.resetTime).toISOString(),
        );

        next();
    }

    private getClientIp(req: Request): string {
        return (
            req.ip ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            (req.connection as any)?.socket?.remoteAddress ||
            'unknown'
        );
    }

    private cleanupOldEntries(windowStart: number): void {
        for (const [ip, record] of this.requestCounts.entries()) {
            if (record.resetTime <= windowStart) {
                this.requestCounts.delete(ip);
            }
        }
    }
}
