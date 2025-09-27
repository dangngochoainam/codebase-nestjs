import { Module } from '@nestjs/common';
import { EnvModule } from './config/env.module';
import { LoggerModule } from './common/logger/logger.module';
import { DatabaseModule } from './database/database.module';

@Module({
    imports: [EnvModule, LoggerModule, DatabaseModule],
})
export class AppModule {}
