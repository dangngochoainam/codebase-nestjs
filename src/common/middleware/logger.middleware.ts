import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { HTTP_HEADERS } from '../constants';
import { SystemLoggerService } from '../logger/system-logger.service';
import { CustomRequest } from '../types';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    // TODO: Replace this class into "Logging interceptor for requests/responses". Because, I don't want touch res.end to log response
    constructor(private readonly systemLogger: SystemLoggerService) {}

    use(req: CustomRequest, res: Response, next: NextFunction) {
        // Set start time for request duration tracking
        req.startTime = Date.now();

        // Extract correlation ID from client if provided, otherwise leave undefined
        const clientCorrelationId = req.headers[
            HTTP_HEADERS.CORRELATION_ID.toLowerCase()
        ] as string;
        if (clientCorrelationId) {
            req.correlationId = clientCorrelationId;
            // Echo back the client's correlation ID
            res.setHeader(HTTP_HEADERS.CORRELATION_ID, clientCorrelationId);
        }

        // Log request start
        this.systemLogger.logHttpRequest(
            req.method,
            req.url,
            0, // Status code will be updated when response is sent
            Date.now() - req.startTime,
            req.userId,
            req.requestId,
            req.correlationId,
        );

        // Override res.end to capture response details
        const originalEnd = res.end;
        res.end = function (chunk?: any, encoding?: any) {
            const duration = Date.now() - req.startTime!;

            // Log the completed request
            this.systemLogger.logHttpRequest(
                req.method,
                req.url,
                res.statusCode,
                duration,
                req.userId,
                req.requestId,
                req.correlationId,
            );

            // Call original end method
            originalEnd.call(this, chunk, encoding);
        }.bind(this);

        next();
    }
}
