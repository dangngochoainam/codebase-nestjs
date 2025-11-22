import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggerModule } from './common/logger/logger.module';
import {
    CorsMiddleware,
    RateLimitMiddleware,
    RequestIdMiddleware,
} from './common/middleware';
import { MiddlewareModule } from './common/middleware/middleware.module';
import { EnvModule } from './config/env.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { AlsModule } from './common/middleware/async-local-storage';

@Module({
    imports: [
        EnvModule,
        LoggerModule,
        DatabaseModule,
        AlsModule,
        MiddlewareModule,
        UserModule,
    ],
    providers: [{ provide: APP_INTERCEPTOR, useClass: ResponseInterceptor }],
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
            .forRoutes({ path: '*path', method: RequestMethod.ALL });
    }
}
