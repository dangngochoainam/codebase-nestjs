# Technical Context

## Core Technologies

### Primary Stack

- **Runtime**: Node.js (LTS version)
- **Framework**: NestJS (latest stable)
- **Language**: TypeScript (strict mode)
- **Package Manager**: npm (or yarn/pnpm)

### Database & ODM

- **Database**: MongoDB
- **ODM**: Mongoose
- **Schema**: Mongoose schemas with validation

### Authentication & Security

- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing

### Validation & Documentation

- **class-validator**: DTO validation
- **class-transformer**: Data transformation
- **Swagger**: API documentation
- **OpenAPI**: API specification

### Testing

- **Jest**: Testing framework
- **Supertest**: HTTP testing
- **@nestjs/testing**: NestJS testing utilities

### Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **lint-staged**: Pre-commit linting

## Development Setup

### Prerequisites

- Node.js (v18+ recommended)
- npm/yarn/pnpm
- Git
- MongoDB (for database)

### Environment Configuration

- `.env` files for different environments with **dotenv** integration
- **Custom EnvService** - Global module without @nestjs/config dependency
- Single environment configuration class validated by class-validator
- **Clean property access** through `envService.ENVIRONMENT.PORT`, `envService.ENVIRONMENT.DATABASE_URL`
- Configuration class with validation decorators (@IsString, @IsNumber, etc.)
- Automatic type conversion and validation on application startup
- Global module accessible throughout the application via dependency injection
- **No external dependencies** - completely custom implementation

### Current Project Structure (Phase 2 Complete)

```
codebase-nestjs/
├── src/
│   ├── main.ts                    # ✅ Application entry point with validation pipe
│   ├── app.module.ts              # ✅ Root module with all integrations
│   ├── config/                    # ✅ Custom environment configuration
│   │   ├── env.config.ts          # ✅ EnvironmentConfig class with utility functions
│   │   ├── validate-env.ts        # ✅ Validation function
│   │   ├── env.service.ts          # ✅ Custom EnvService (global)
│   │   └── env.module.ts           # ✅ Custom EnvModule
│   ├── common/                    # ✅ Shared utilities (complete)
│   │   ├── logger/                # ✅ Dual logging system
│   │   │   ├── manual-logger.service.ts    # ✅ Manual logging
│   │   │   ├── system-logger.service.ts    # ✅ Automatic logging
│   │   │   ├── data-sanitizer.ts           # ✅ Sensitive data protection
│   │   │   └── logger.module.ts            # ✅ Logger module
│   │   ├── pipes/                 # ✅ Validation pipes
│   │   │   └── validation.pipe.ts          # ✅ Custom validation pipe
│   │   ├── dto/                   # ✅ Data transfer objects
│   │   │   └── base.dto.ts                # ✅ Base DTOs with validation
│   │   ├── decorators/            # ✅ Custom validation decorators
│   │   │   └── validation.decorators.ts   # ✅ Advanced validation decorators
│   │   ├── utils/                 # ✅ Common utility functions
│   │   │   └── transformers.ts            # ✅ Reusable transformation functions
│   │   ├── middleware/            # ⏳ Custom middleware (Phase 3)
│   │   ├── interceptors/          # ⏳ Response interceptors (Phase 3)
│   │   ├── guards/                # ⏳ Auth guards (Phase 4)
│   │   └── filters/               # ⏳ Exception filters (Phase 3)
│   ├── database/                 # ✅ Database configuration (complete)
│   │   ├── database.module.ts     # ✅ MongoDB connection with Mongoose
│   │   ├── database.service.ts    # ✅ Connection monitoring and health checks
│   │   └── schemas/               # ✅ Mongoose schemas
│   │       └── user.schema.ts             # ✅ User schema with validation
│   └── modules/                   # ⏳ Feature modules (Phase 4)
│       ├── auth/                  # ⏳ Authentication module
│       ├── users/                 # ⏳ User management
│       └── health/                # ⏳ Health checks
├── logs/                          # ✅ Log directory structure
│   ├── manual/                    # ✅ Manual developer logs
│   └── automatic/                 # ✅ Automatic system logs
├── memory-bank/                   # ✅ Project documentation
├── package.json                   # ✅ Dependencies and scripts
├── tsconfig.json                  # ✅ TypeScript configuration
├── nest-cli.json                  # ✅ NestJS CLI configuration
├── eslint.config.js               # ✅ ESLint configuration
├── .prettierrc                    # ✅ Prettier configuration
├── .env                           # ✅ Environment variables
└── .husky/                        # ✅ Git hooks
```

**Legend**: ✅ Complete | 🔄 In Progress | ⏳ Pending

## Implementation Status

### Phase 1: Project Foundation ✅ COMPLETE

- **1.1 NestJS Project**: ✅ Initialized with proper structure
- **1.2 Environment Config**: ✅ Validated class with direct property access
- **1.3 Code Quality**: ✅ ESLint, Prettier, Husky configured

### Phase 2: Core Infrastructure ✅ COMPLETE

- **2.1 Dual Logging**: ✅ Manual vs automatic logging system with Winston
- **2.2 MongoDB Setup**: ✅ Mongoose connection and schemas with monitoring
- **2.3 Request Validation**: ✅ class-validator implementation with custom pipe
- **2.4 Utility Functions**: ✅ Common transformation functions for reusability

### Phase 3: Advanced Features ⏳ READY TO START

- **3.1 Middleware**: ⏳ Custom middleware implementation
- **3.2 Interceptors**: ⏳ Response transformation and logging
- **3.3 Response Consistency**: ⏳ Standardized API responses
- **3.4 Cron Jobs**: ⏳ Scheduled task system

### Phase 4: Sample Implementation ⏳ PENDING

- **4.1 Sample Modules**: ⏳ User management, auth, health
- **4.2 API Documentation**: ⏳ Swagger/OpenAPI setup

### Phase 5: Testing & QA ⏳ PENDING

- **5.1 Testing Framework**: ⏳ Jest, Supertest setup
- **5.2 Health Monitoring**: ⏳ Application health checks

## Dependencies

### Core Dependencies

- `@nestjs/core`
- `@nestjs/common`
- `@nestjs/platform-express`
- `@nestjs/mongoose`
- `dotenv`
- `@nestjs/jwt`
- `@nestjs/passport`
- `@nestjs/swagger`
- `@nestjs/schedule`
- `mongoose`
- `winston`
- `nest-winston`
- `winston-daily-rotate-file`
- `winston-mongodb`
- `class-validator`
- `class-transformer`

### Development Dependencies

- `@nestjs/cli`
- `@nestjs/testing`
- `@types/node`
- `typescript`
- `jest`
- `supertest`

## Technical Constraints

### Performance

- Use connection pooling for database
- Implement caching where appropriate
- Optimize database queries
- Handle large datasets efficiently

### Security

- Input validation on all endpoints
- SQL injection prevention
- XSS protection
- Rate limiting
- Secure headers

### Scalability

- Stateless application design
- Horizontal scaling support
- Database connection management
- Efficient resource usage

## Tool Usage Patterns

### Code Quality

- ESLint configuration for TypeScript
- Prettier for consistent formatting
- Husky for pre-commit hooks
- Automated testing in CI/CD

### Development Workflow

- Feature branch development
- Code reviews
- Automated testing
- Documentation updates

### Deployment

- Docker containerization
- Environment-specific configurations
- Health checks
- Logging and monitoring

## Utility Functions

### Common Transformers

The project includes reusable utility functions for common data transformations:

#### **stringToBoolean(value: any): boolean**
- **Purpose**: Converts string values to boolean
- **Usage**: `@Transform(stringToBoolean)` in environment configuration
- **Handles**: String "true"/"false" conversion, type safety
- **Location**: `src/common/utils/transformers.ts`

#### **Usage Examples**
```typescript
// In environment configuration
@Transform(stringToBoolean)
ENABLE_MANUAL_LOGS?: boolean = true;

// In DTOs
@Transform(stringToBoolean)
isActive?: boolean;

// In services
const isEnabled = stringToBoolean(process.env.SOME_FLAG);
```

### Benefits of Utility Functions

- **Reusability**: Same logic across multiple files
- **Consistency**: Uniform transformation behavior
- **Maintainability**: Single source of truth for transformations
- **Type Safety**: Proper TypeScript support
- **Performance**: Optimized for common use cases

## Current Session Updates

### ✅ **Memory Bank Synchronization**
- **activeContext.md**: Updated with current session accomplishments and Phase 3 readiness
- **progress.md**: Updated to show Phase 2 completion and Memory Bank synchronization
- **techContext.md**: Updated implementation status and project structure
- **implementation-plan.md**: Added Phase 2.4 utility functions documentation

### ✅ **Project Status Summary**
- **Phase 1**: ✅ Complete (Project foundation, environment config, code quality)
- **Phase 2**: ✅ Complete (Logging, MongoDB, validation, utilities)
- **Phase 3**: ⏳ Ready to start (Middleware, interceptors, responses, cron jobs)
- **Memory Bank**: ✅ Fully synchronized and up-to-date

### ✅ **Key Accomplishments**
- **Utility Functions**: Created reusable `stringToBoolean` transformation function
- **Environment Config**: Updated to use utility functions for consistency
- **Documentation**: Comprehensive Memory Bank updates across all files
- **Code Organization**: Improved maintainability with common utilities
- **Project Structure**: Complete file tree with all implemented features
