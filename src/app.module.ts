import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { LoggerModule } from './common/logger/logger.module';
import {
    CorsMiddleware,
    LoggerMiddleware,
    RateLimitMiddleware,
    RequestIdMiddleware,
} from './common/middleware';
import { MiddlewareModule } from './common/middleware/middleware.module';
import { EnvModule } from './config/env.module';
import { DatabaseModule } from './database/database.module';

@Module({
    imports: [EnvModule, LoggerModule, DatabaseModule, MiddlewareModule],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        // Apply middleware in order
        consumer
            .apply(RequestIdMiddleware)
            .forRoutes({ path: '*path', method: RequestMethod.ALL })
            .apply(CorsMiddleware)
            .forRoutes({ path: '*path', method: RequestMethod.ALL })
            .apply(RateLimitMiddleware)
            .forRoutes({ path: '*path', method: RequestMethod.ALL })
            .apply(LoggerMiddleware)
            .forRoutes({ path: '*path', method: RequestMethod.ALL });
    }
}
