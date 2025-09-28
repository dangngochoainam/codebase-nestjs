import { Global, Module } from '@nestjs/common';
import { CorsMiddleware } from './cors.middleware';
import { LoggerMiddleware } from './logger.middleware';
import { RateLimitMiddleware } from './rate-limit.middleware';
import { RequestIdMiddleware } from './request-id.middleware';

@Global()
@Module({
    providers: [
        LoggerMiddleware,
        RateLimitMiddleware,
        CorsMiddleware,
        RequestIdMiddleware,
    ],
    exports: [
        LoggerMiddleware,
        RateLimitMiddleware,
        CorsMiddleware,
        RequestIdMiddleware,
    ],
})
export class MiddlewareModule {}
