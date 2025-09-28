import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { EnvService } from '../../config/env.service';
import { HTTP_HEADERS, HEADER_VALUES } from '../constants';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
    constructor(private readonly envService: EnvService) {}

    use(req: Request, res: Response, next: NextFunction) {
        // Get allowed origins from environment or use defaults
        const allowedOrigins = this.getAllowedOrigins();
        const origin = req.headers.origin;

        // Set CORS headers
        if (origin && this.isOriginAllowed(origin, allowedOrigins)) {
            res.setHeader(HTTP_HEADERS.ACCESS_CONTROL_ALLOW_ORIGIN, origin);
        } else if (allowedOrigins.includes('*')) {
            res.setHeader(HTTP_HEADERS.ACCESS_CONTROL_ALLOW_ORIGIN, '*');
        }

        // Set other CORS headers
        res.setHeader(
            HTTP_HEADERS.ACCESS_CONTROL_ALLOW_METHODS,
            HEADER_VALUES.CORS_METHODS,
        );
        res.setHeader(
            HTTP_HEADERS.ACCESS_CONTROL_ALLOW_HEADERS,
            HEADER_VALUES.CORS_HEADERS,
        );
        res.setHeader(
            HTTP_HEADERS.ACCESS_CONTROL_ALLOW_CREDENTIALS,
            HEADER_VALUES.CORS_CREDENTIALS,
        );
        res.setHeader(
            HTTP_HEADERS.ACCESS_CONTROL_MAX_AGE,
            HEADER_VALUES.CORS_MAX_AGE,
        );

        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            res.status(200).end();
            return;
        }

        next();
    }

    private getAllowedOrigins(): string[] {
        // Get from environment configuration or use defaults
        const corsOrigins = this.envService.ENVIRONMENT.CORS_ORIGINS;

        if (corsOrigins) {
            return corsOrigins.split(',').map((origin) => origin.trim());
        }

        return [];
    }

    private isOriginAllowed(origin: string, allowedOrigins: string[]): boolean {
        return allowedOrigins.includes(origin) || allowedOrigins.includes('*');
    }
}
