import { Transform } from 'class-transformer';
import {
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class EnvironmentConfig {
    // Application Configuration
    @IsString()
    NODE_ENV: string;

    @IsNumber()
    @Min(1000)
    @Max(65535)
    @Transform(({ value }) => parseInt(value, 10))
    PORT: number;

    @IsString()
    @IsOptional()
    API_PREFIX?: string = 'api';

    @IsString()
    APP_NAME: string;

    // Database Configuration
    @IsString()
    DATABASE_URL: string;

    @IsString()
    DATABASE_NAME: string;

    // JWT Configuration
    @IsString()
    JWT_SECRET: string;

    @IsString()
    @IsOptional()
    JWT_EXPIRES_IN?: string = '1d';

    // Logging Configuration
    @IsString()
    @IsOptional()
    LOG_LEVEL?: string = 'info';

    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    @IsOptional()
    ENABLE_MANUAL_LOGS?: boolean = true;

    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    @IsOptional()
    ENABLE_AUTOMATIC_LOGS?: boolean = true;

    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    @IsOptional()
    LOG_TO_FILE?: boolean = true;

    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    @IsOptional()
    LOG_TO_DATABASE?: boolean = false;

    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    @IsOptional()
    MASK_SENSITIVE_DATA?: boolean = true;

    @IsString()
    @IsOptional()
    LOG_DATABASE_COLLECTION?: string = 'application_logs';
}
