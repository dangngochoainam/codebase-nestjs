import { Exclude, Expose, Transform } from 'class-transformer';
import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';
import { stringToBoolean } from '../common/utils/transformers';
import { v7 } from 'uuid';

@Exclude()
export class EnvironmentConfig {
    // Application Configuration
    @Expose()
    @IsString()
    SERVICE_NAME: string = 'UNSET';

    @Expose()
    @IsString()
    INSTANCE_ID: string = v7();

    @Expose()
    @IsString()
    NODE_ENV: string;

    @Expose()
    @IsNumber()
    @Min(1000)
    @Max(65535)
    @Transform(({ value }) => parseInt(value as string, 10))
    PORT: number;

    @Expose()
    @IsString()
    @IsOptional()
    API_PREFIX?: string = 'api';

    @Expose()
    @IsString()
    APP_NAME: string;

    // Database Configuration
    @Expose()
    @IsString()
    DATABASE_URL: string;

    @Expose()
    @IsString()
    DATABASE_NAME: string;

    // JWT Configuration
    @Expose()
    @IsString()
    JWT_SECRET: string;

    @Expose()
    @IsString()
    @IsOptional()
    JWT_EXPIRES_IN?: string = '1d';

    // Logging Configuration
    @Expose()
    @IsString()
    @IsOptional()
    LOG_LEVEL?: string = 'info';

    @Expose()
    @IsBoolean()
    @Transform(({ key, obj }) => stringToBoolean(obj[key]))
    @IsOptional()
    LOG_TO_FILE?: boolean = false;

    @Expose()
    @IsBoolean()
    @Transform(({ key, obj }) => stringToBoolean(obj[key]))
    @IsOptional()
    LOG_TO_DATABASE?: boolean = false;

    @Expose()
    @IsBoolean()
    @Transform(({ key, obj }) => stringToBoolean(obj[key]))
    @IsOptional()
    MASK_SENSITIVE_DATA?: boolean = true;

    // CORS Configuration
    @Expose()
    @IsString()
    @IsNotEmpty()
    CORS_ORIGINS: string;
}
