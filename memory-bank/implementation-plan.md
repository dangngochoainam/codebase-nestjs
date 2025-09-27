# NestJS Implementation Plan

## Overview
This document outlines the comprehensive plan to build a production-ready NestJS application with advanced features including environment configuration, logging, validation, MongoDB integration, middleware, interceptors, cron jobs, code formatting, and response consistency.

## Phase 1: Project Foundation (Priority: High)

### 1.1 Initialize NestJS Project
- **Task**: Create NestJS project using CLI
- **Command**: `nest new codebase-nestjs --package-manager npm`
- **Output**: Basic project structure with TypeScript configuration
- **Dependencies**: @nestjs/cli

### 1.2 Environment Configuration Setup
- **Task**: Implement environment configuration through validated class with direct property access
- **Features**:
  - Environment-specific configuration (.env, .env.development, .env.production)
  - Single environment configuration class with class-validator decorators
  - Direct property access to environment variables through class instance
  - Configuration validation using class-validator (@IsString, @IsNumber, @IsOptional, etc.)
  - Automatic type conversion with @Transform decorators (string to number, boolean)
  - Default values and required variables with proper validation
  - Global configuration class instance accessible throughout the application
  - Validation on application startup with detailed error messages
- **Dependencies**: @nestjs/config, class-validator, class-transformer
- **Files**: 
  - `src/config/env.config.ts` (main environment configuration class)
  - `src/config/config.module.ts` (configuration module)
  - `src/config/validate-env.ts` (environment validation function)
  - `.env.example` (example environment file)

### 1.3 Code Formatting and Quality Setup
- **Task**: Configure ESLint, Prettier, and Husky
- **Features**:
  - ESLint with TypeScript rules
  - Prettier for consistent formatting
  - Husky for pre-commit hooks
  - lint-staged for staged files
  - VS Code settings for auto-formatting
- **Dependencies**: eslint, prettier, husky, lint-staged
- **Files**: 
  - `.eslintrc.js`
  - `.prettierrc`
  - `.husky/pre-commit`
  - `.vscode/settings.json`

## Phase 2: Core Infrastructure (Priority: High)

### 2.1 Dual Logging System Implementation
- **Task**: Setup dual logging system - logs written BY developers vs logs written BY system automatically
- **Two Distinct Log Types**:
  - **Manual Logs (Written BY Developers)**: Explicit logging calls in business logic code
  - **Automatic Logs (Written BY System)**: System-generated logs from middleware, interceptors, errors
- **Features**:
  - **Manual Developer Logging**: Explicit logger.info(), logger.debug() calls in code
  - **Automatic System Logging**: HTTP requests, errors, performance metrics, security events
  - **Multiple Transports**: Console, file rotation, database storage
  - **Sensitive Data Protection**: Configurable data masking/hiding based on environment
  - **Real-world Structure**: Structured logging with correlation IDs, request context
  - **Log Levels**: error, warn, info, debug with different configurations per type
  - **Separate Channels**: Different log files/collections for manual vs automatic logs
- **Dependencies**: winston, nest-winston, winston-daily-rotate-file, winston-mongodb
- **Files**:
  - `src/common/logger/logger.module.ts` (main logger module)
  - `src/common/logger/manual-logger.service.ts` (for developer manual logging)
  - `src/common/logger/system-logger.service.ts` (for automatic system logging)
  - `src/common/logger/logger.config.ts` (logging configuration)
  - `src/common/logger/data-sanitizer.ts` (sensitive data handling)
  - `src/common/logger/formatters/` (custom log formatters)
  - `src/common/logger/transports/` (custom transport configurations)
  - `logs/` directory structure (manual/, automatic/)

### 2.2 MongoDB Connection Setup
- **Task**: Configure MongoDB with Mongoose
- **Features**:
  - Connection configuration from environment
  - Connection pooling and error handling
  - Schema definitions with validation
  - Mongoose plugins for timestamps, pagination
  - Database seeding capability
- **Dependencies**: @nestjs/mongoose, mongoose
- **Files**:
  - `src/database/database.module.ts`
  - `src/database/schemas/`
  - `src/database/seeds/`

### 2.3 Request Validation Setup
- **Task**: Implement comprehensive input validation
- **Features**:
  - Global validation pipe
  - Custom validation decorators
  - DTO classes with validation rules
  - Error formatting for validation failures
  - Sanitization and transformation
- **Dependencies**: class-validator, class-transformer
- **Files**:
  - `src/common/pipes/validation.pipe.ts`
  - `src/common/dto/base.dto.ts`
  - `src/common/decorators/validation.decorators.ts`

## Phase 3: Advanced Features (Priority: Medium)

### 3.1 Middleware Implementation
- **Task**: Create custom middleware for common operations
- **Features**:
  - Request logging middleware
  - CORS handling middleware
  - Rate limiting middleware
  - Request ID generation
  - Security headers middleware
- **Dependencies**: helmet, express-rate-limit
- **Files**:
  - `src/common/middleware/logger.middleware.ts`
  - `src/common/middleware/security.middleware.ts`
  - `src/common/middleware/rate-limit.middleware.ts`

### 3.2 Interceptors Setup
- **Task**: Implement response transformation and logging
- **Features**:
  - Response formatting interceptor
  - Logging interceptor for requests/responses
  - Error transformation interceptor
  - Performance monitoring interceptor
  - Cache control interceptor
- **Files**:
  - `src/common/interceptors/response.interceptor.ts`
  - `src/common/interceptors/logging.interceptor.ts`
  - `src/common/interceptors/error.interceptor.ts`

### 3.3 Response Consistency
- **Task**: Standardize API response format
- **Features**:
  - Consistent response wrapper
  - Error response standardization
  - Success response formatting
  - Pagination response format
  - Status code standardization
- **Files**:
  - `src/common/interfaces/response.interface.ts`
  - `src/common/dto/response.dto.ts`
  - `src/common/filters/http-exception.filter.ts`

### 3.4 Cron Jobs Setup
- **Task**: Implement scheduled task system
- **Features**:
  - Configurable cron jobs
  - Job logging and monitoring
  - Error handling for failed jobs
  - Job status tracking
  - Dynamic job scheduling
- **Dependencies**: @nestjs/schedule
- **Files**:
  - `src/common/tasks/task.module.ts`
  - `src/common/tasks/services/`
  - `src/common/tasks/decorators/`

## Phase 4: Sample Implementation (Priority: Medium)

### 4.1 Sample Module Creation
- **Task**: Create comprehensive example module
- **Features**:
  - User management module
  - CRUD operations with validation
  - Authentication and authorization
  - Database operations with Mongoose
  - API documentation with Swagger
  - Unit and integration tests
- **Files**:
  - `src/modules/users/`
  - `src/modules/auth/`
  - `src/modules/health/`

### 4.2 API Documentation
- **Task**: Setup Swagger/OpenAPI documentation
- **Features**:
  - Automatic API documentation
  - Request/response schemas
  - Authentication documentation
  - Example requests and responses
- **Dependencies**: @nestjs/swagger, swagger-ui-express
- **Files**:
  - `src/main.ts` (Swagger setup)
  - DTO decorators for documentation

## Phase 5: Testing and Quality Assurance (Priority: Low)

### 5.1 Testing Framework
- **Task**: Comprehensive testing setup
- **Features**:
  - Unit tests for services
  - Integration tests for controllers
  - E2E tests for complete flows
  - Test database setup
  - Coverage reporting
- **Dependencies**: jest, supertest, @nestjs/testing
- **Files**:
  - `test/` directory structure
  - `jest.config.js`

### 5.2 Health Checks and Monitoring
- **Task**: Application health monitoring
- **Features**:
  - Health check endpoints
  - Database connection monitoring
  - Memory and CPU usage tracking
  - Custom health indicators
- **Dependencies**: @nestjs/terminus
- **Files**:
  - `src/health/health.module.ts`
  - `src/health/health.controller.ts`

## Environment Configuration Implementation Details

### Environment Configuration Class
```typescript
// src/config/env.config.ts
import { IsString, IsNumber, IsOptional, IsBoolean, Min, Max, IsUrl } from 'class-validator';
import { Transform, Type } from 'class-transformer';

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
  @IsUrl()
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
  LOG_TO_FILE?: boolean = false;
}
```

### Environment Validation Function
```typescript
// src/config/validate-env.ts
import { plainToClass, transform } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvironmentConfig } from './env.config';

export function validateEnvironment(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentConfig, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(`Environment validation failed: ${errors.toString()}`);
  }

  return validatedConfig;
}
```

### Global Configuration Instance
```typescript
// src/config/config.module.ts
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentConfig } from './env.config';
import { validateEnvironment } from './validate-env';

// Global configuration instance
export let envConfig: EnvironmentConfig;

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (config) => {
        envConfig = validateEnvironment(config);
        return envConfig;
      },
      isGlobal: true,
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}
```

### Direct Class Property Access
```typescript
// Instead of: process.env.PORT or configService.get('PORT')
// Use: envConfig.PORT

import { envConfig } from '../config/config.module';

@Injectable()
export class SomeService {
  getAppPort(): number {
    return envConfig.PORT; // Direct property access
  }

  getDatabaseUrl(): string {
    return envConfig.DATABASE_URL; // Fully typed and validated
  }

  isProduction(): boolean {
    return envConfig.NODE_ENV === 'production';
  }
}
```

### Usage in Main.ts
```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envConfig } from './config/config.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Direct access to validated configuration
  await app.listen(envConfig.PORT);
  console.log(`Application running on port ${envConfig.PORT}`);
}
bootstrap();
```

### Benefits
- **Direct Property Access**: `envConfig.PORT` instead of service injection
- **Type Safety**: Full TypeScript support with IntelliSense
- **Validation**: Automatic validation of all environment variables on startup
- **Error Prevention**: Compile-time and runtime validation
- **Global Access**: Available throughout the application without injection
- **Self-Documentation**: Configuration is self-documenting through decorators
- **Type Conversion**: Automatic conversion from string to proper types

## Dual Logging System Implementation Details

### Clear Distinction: Manual vs Automatic Logging

**Manual Logs (Written BY Developers)**:
- Explicit logging calls placed by developers in business logic
- Examples: `logger.info('User created')`, `logger.debug('Processing payment')`
- Used for business events, debugging, custom application logic
- Developer controls when, what, and how to log

**Automatic Logs (Written BY System)**:
- System automatically generates logs without developer intervention
- Examples: HTTP request logs, error logs, performance metrics, security events
- Generated by middleware, interceptors, guards, exception filters
- System controls logging based on configuration

### Environment Configuration for Logging
```typescript
// Addition to EnvironmentConfig class
export class EnvironmentConfig {
  // ... other properties

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
```

### Manual Logger Service (For Developer Logging)
```typescript
// src/common/logger/manual-logger.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';
import { envConfig } from '../../config/config.module';
import { DataSanitizer } from './data-sanitizer';

@Injectable()
export class ManualLoggerService extends Logger {
  private logger;

  constructor(private dataSanitizer: DataSanitizer) {
    super();
    this.logger = createLogger({
      level: envConfig.LOG_LEVEL,
      format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.printf(({ timestamp, level, message, context, ...meta }) => {
          const sanitizedMeta = this.dataSanitizer.sanitize(meta);
          return `[${timestamp}] [${level}] [${context || 'Application'}] ${message} ${
            Object.keys(sanitizedMeta).length ? JSON.stringify(sanitizedMeta, null, 2) : ''
          }`;
        }),
      ),
      transports: this.getTransports(),
    });
  }

  private getTransports() {
    const transportList = [];

    // Console transport (always enabled for development)
    transportList.push(
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.simple(),
        ),
      }),
    );

    // File transport
    if (envConfig.LOG_TO_FILE) {
      transportList.push(
        new transports.File({
          filename: 'logs/manual/manual.log',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
      );
    }

    return transportList;
  }

  // Manual logging methods (called by developers)
  debug(message: string, context?: string, meta?: any) {
    this.logger.debug(message, { context, ...meta });
  }

  info(message: string, context?: string, meta?: any) {
    this.logger.info(message, { context, ...meta });
  }

  warn(message: string, context?: string, meta?: any) {
    this.logger.warn(message, { context, ...meta });
  }

  error(message: string, error?: Error, context?: string, meta?: any) {
    this.logger.error(message, { 
      context, 
      error: error?.stack,
      ...meta 
    });
  }

  // Business logic logging methods (called manually by developers)
  logBusinessEvent(event: string, details?: any, context?: string) {
    this.info(`Business Event: ${event}`, context, {
      type: 'business_event',
      details
    });
  }

  logCustomDebug(message: string, data?: any, context?: string) {
    this.debug(`Custom Debug: ${message}`, context, {
      type: 'custom_debug',
      data
    });
  }
}
```

### System Logger Service (For Automatic Logging)
```typescript
// src/common/logger/system-logger.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';
import 'winston-mongodb';
import { envConfig } from '../../config/config.module';
import { DataSanitizer } from './data-sanitizer';

@Injectable()
export class SystemLoggerService extends Logger {
  private logger;

  constructor(private dataSanitizer: DataSanitizer) {
    super();
    this.logger = createLogger({
      level: 'info', // System logs typically don't need debug level
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json(),
        format.printf((info) => {
          const sanitized = this.dataSanitizer.sanitize(info);
          return JSON.stringify({
            timestamp: sanitized.timestamp,
            level: sanitized.level,
            message: sanitized.message,
            service: sanitized.context || 'system',
            correlationId: sanitized.correlationId,
            userId: sanitized.userId,
            requestId: sanitized.requestId,
            environment: envConfig.NODE_ENV,
            ...sanitized
          });
        }),
      ),
      transports: this.getTransports(),
    });
  }

  private getTransports() {
    const transportList = [];

    // Console transport for production (structured JSON)
    if (envConfig.NODE_ENV !== 'production') {
      transportList.push(new transports.Console());
    }

    // File transport with rotation
    if (envConfig.LOG_TO_FILE) {
      transportList.push(
        new transports.File({
          filename: 'logs/automatic/automatic.log',
          maxsize: 10485760, // 10MB
          maxFiles: 10,
        }),
      );

      // Separate error log file
      transportList.push(
        new transports.File({
          filename: 'logs/automatic/error.log',
          level: 'error',
          maxsize: 10485760,
          maxFiles: 10,
        }),
      );
    }

    // Database transport
    if (envConfig.LOG_TO_DATABASE) {
      transportList.push(
        new transports.MongoDB({
          db: envConfig.DATABASE_URL,
          collection: envConfig.LOG_DATABASE_COLLECTION,
          options: { useUnifiedTopology: true },
          metaKey: 'metadata',
        }),
      );
    }

    return transportList;
  }

  // Automatic system logging methods (called by middleware/interceptors)
  logHttpRequest(method: string, url: string, statusCode: number, duration: number, userId?: string) {
    this.logger.info(`HTTP Request: ${method} ${url}`, {
      type: 'http_request',
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
      userId,
      context: 'HTTP'
    });
  }

  logDatabaseQuery(query: string, duration: number, context?: string) {
    this.logger.debug(`Database Query: ${query}`, {
      type: 'database_query',
      duration: `${duration}ms`,
      context: context || 'Database'
    });
  }

  logSecurityEvent(event: string, details: any, userId?: string) {
    this.logger.warn(`Security Event: ${event}`, {
      type: 'security_event',
      userId,
      details: this.dataSanitizer.sanitize(details),
      context: 'Security'
    });
  }

  logPerformanceMetric(metric: string, value: number, unit: string) {
    this.logger.info(`Performance Metric: ${metric}`, {
      type: 'performance_metric',
      metric,
      value,
      unit,
      context: 'Performance'
    });
  }

  logError(message: string, error: Error, context?: string, meta?: any) {
    this.logger.error(message, {
      context,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      ...this.dataSanitizer.sanitize(meta)
    });
  }
}
```

### Data Sanitizer
```typescript
// src/common/logger/data-sanitizer.ts
import { Injectable } from '@nestjs/common';
import { envConfig } from '../../config/config.module';

@Injectable()
export class DataSanitizer {
  private sensitiveFields = [
    'password',
    'token',
    'authorization',
    'cookie',
    'secret',
    'key',
    'jwt',
    'auth',
    'credential',
    'ssn',
    'social_security',
    'credit_card',
    'card_number',
    'cvv',
    'pin'
  ];

  sanitize(data: any): any {
    if (!envConfig.MASK_SENSITIVE_DATA) {
      return data;
    }

    return this.maskSensitiveData(data);
  }

  private maskSensitiveData(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'string') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.maskSensitiveData(item));
    }

    if (typeof obj === 'object') {
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        if (this.isSensitiveField(key)) {
          sanitized[key] = this.maskValue(value);
        } else {
          sanitized[key] = this.maskSensitiveData(value);
        }
      }
      return sanitized;
    }

    return obj;
  }

  private isSensitiveField(fieldName: string): boolean {
    const lowerField = fieldName.toLowerCase();
    return this.sensitiveFields.some(sensitive => 
      lowerField.includes(sensitive)
    );
  }

  private maskValue(value: any): string {
    if (typeof value === 'string' && value.length > 0) {
      if (value.length <= 4) {
        return '***';
      }
      return value.substring(0, 2) + '*'.repeat(value.length - 4) + value.substring(value.length - 2);
    }
    return '***';
  }
}
```

### Logger Module
```typescript
// src/common/logger/logger.module.ts
import { Global, Module } from '@nestjs/common';
import { ManualLoggerService } from './manual-logger.service';
import { SystemLoggerService } from './system-logger.service';
import { DataSanitizer } from './data-sanitizer';

@Global()
@Module({
  providers: [
    ManualLoggerService,
    SystemLoggerService,
    DataSanitizer,
  ],
  exports: [
    ManualLoggerService,
    SystemLoggerService,
  ],
})
export class LoggerModule {}
```

### Usage Examples

#### Manual Logging (Written BY Developers)
```typescript
// In any service or controller - EXPLICIT logging by developers
@Injectable()
export class UserService {
  constructor(
    private manualLogger: ManualLoggerService, // For manual developer logging
  ) {}

  async createUser(userData: CreateUserDto) {
    // Manual logging - developer explicitly writes these log calls
    this.manualLogger.info('Starting user creation process', 'UserService');
    this.manualLogger.debug('User data received', 'UserService', { userData });

    try {
      const user = await this.userRepository.save(userData);

      // Manual business event logging - developer decides what to log
      this.manualLogger.logBusinessEvent('USER_CREATED', {
        userId: user.id,
        email: user.email
      }, 'UserService');

      this.manualLogger.info('User created successfully', 'UserService');
      return user;
    } catch (error) {
      // Manual error logging - developer explicitly handles errors
      this.manualLogger.error('Failed to create user', error, 'UserService');
      throw error;
    }
  }
}
```

#### Automatic Logging (Written BY System)
```typescript
// HTTP Request Middleware - AUTOMATIC logging by system
@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private systemLogger: SystemLoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      // System automatically logs ALL HTTP requests
      this.systemLogger.logHttpRequest(
        req.method,
        req.url,
        res.statusCode,
        duration,
        req.user?.id
      );
    });
    
    next();
  }
}

// Exception Filter - AUTOMATIC error logging by system
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private systemLogger: SystemLoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    // System automatically logs ALL unhandled errors
    this.systemLogger.logError(
      'Unhandled exception occurred',
      exception as Error,
      'GlobalExceptionFilter'
    );
  }
}
```

### Real-world Logging Structure Benefits
- **Clear Separation**: Manual logs (developer-written) vs Automatic logs (system-generated)
- **Multiple Transports**: Flexible output destinations based on environment
- **Sensitive Data Protection**: Automatic masking of sensitive information
- **Structured Logging**: JSON format for easy parsing and analysis
- **Performance Monitoring**: Built-in request timing and metrics
- **Security Auditing**: Dedicated security event logging
- **Correlation IDs**: Request tracing across services
- **Environment Awareness**: Different configurations per environment

## Implementation Order

1. **Foundation** (Phase 1): Project setup, environment config, code quality
2. **Infrastructure** (Phase 2): Logging, database, validation
3. **Advanced Features** (Phase 3): Middleware, interceptors, responses, cron jobs
4. **Sample Implementation** (Phase 4): Working examples and documentation
5. **Quality Assurance** (Phase 5): Testing and monitoring

## Success Criteria

- ✅ All features working as specified
- ✅ Clean, maintainable code structure
- ✅ Comprehensive error handling
- ✅ Production-ready configuration
- ✅ Full test coverage
- ✅ Complete documentation
- ✅ Security best practices implemented
- ✅ Performance optimized

## Estimated Timeline

- **Phase 1**: 2-3 hours
- **Phase 2**: 4-5 hours  
- **Phase 3**: 3-4 hours
- **Phase 4**: 3-4 hours
- **Phase 5**: 2-3 hours
- **Total**: 14-19 hours of development time
