import { Global, Module } from '@nestjs/common';
import { CorsMiddleware } from './cors.middleware';
import { RateLimitMiddleware } from './rate-limit.middleware';
import { RequestIdMiddleware } from './request-id.middleware';

@Global()
@Module({
    providers: [RateLimitMiddleware, CorsMiddleware, RequestIdMiddleware],
    exports: [RateLimitMiddleware, CorsMiddleware, RequestIdMiddleware],
})
export class MiddlewareModule {}
