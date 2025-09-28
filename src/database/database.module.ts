import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvService } from '../config/env.service';
import { DatabaseService } from './database.service';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: (envService: EnvService) => ({
                uri: envService.ENVIRONMENT.DATABASE_URL,
                dbName: envService.ENVIRONMENT.DATABASE_NAME,
                maxPoolSize: 10,
                socketTimeoutMS: 45000,
            }),
            inject: [EnvService],
        }),
    ],
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule {}
