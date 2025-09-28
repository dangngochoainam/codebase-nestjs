import { Exclude, Expose, Transform } from 'class-transformer';
import {
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';
import { stringToBoolean } from '../common/utils/transformers';

@Exclude()
export class EnvironmentConfig {
    // Application Configuration
    @Expose()
    @IsString()
    NODE_ENV: string;

    @Expose()
    @IsNumber()
    @Min(1000)
    @Max(65535)
    @Transform(({ value }) => parseInt(value, 10))
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
    @Transform(stringToBoolean)
    @IsOptional()
    ENABLE_MANUAL_LOGS?: boolean = true;

    @Expose()
    @IsBoolean()
    @Transform(stringToBoolean)
    @IsOptional()
    ENABLE_AUTOMATIC_LOGS?: boolean = true;

    @Expose()
    @IsBoolean()
    @Transform(stringToBoolean)
    @IsOptional()
    LOG_TO_FILE?: boolean = true;

    @Expose()
    @IsBoolean()
    @Transform(stringToBoolean)
    @IsOptional()
    LOG_TO_DATABASE?: boolean = false;

    @Expose()
    @IsBoolean()
    @Transform(stringToBoolean)
    @IsOptional()
    MASK_SENSITIVE_DATA?: boolean = true;

    @Expose()
    @IsString()
    @IsOptional()
    LOG_DATABASE_COLLECTION?: string = 'application_logs';
}
