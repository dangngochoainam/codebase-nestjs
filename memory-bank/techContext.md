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

### Current Project Structure (Phase 1 Complete)

```
codebase-nestjs/
├── src/
│   ├── main.ts                    # ✅ Application entry point
│   ├── app.module.ts              # ✅ Root module
│   ├── config/                    # ✅ Custom environment configuration
│   │   ├── env.config.ts          # ✅ EnvironmentConfig class
│   │   ├── validate-env.ts        # ✅ Validation function
│   │   ├── env.service.ts          # ✅ Custom EnvService (global)
│   │   └── env.module.ts           # ✅ Custom EnvModule
│   ├── common/                    # 🔄 Shared utilities (in progress)
│   │   ├── logger/                # ⏳ Logging system (Phase 2)
│   │   ├── middleware/            # ⏳ Custom middleware (Phase 3)
│   │   ├── interceptors/          # ⏳ Response interceptors (Phase 3)
│   │   ├── pipes/                 # ⏳ Validation pipes (Phase 2)
│   │   ├── guards/                # ⏳ Auth guards (Phase 4)
│   │   └── filters/               # ⏳ Exception filters (Phase 3)
│   ├── database/                 # ⏳ Database configuration (Phase 2)
│   │   ├── schemas/               # ⏳ Mongoose schemas
│   │   └── seeds/                 # ⏳ Database seeds
│   └── modules/                   # ⏳ Feature modules (Phase 4)
│       ├── auth/                  # ⏳ Authentication module
│       ├── users/                 # ⏳ User management
│       └── health/                # ⏳ Health checks
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

### Phase 2: Core Infrastructure ⏳ NEXT

- **2.1 Dual Logging**: ⏳ Manual vs automatic logging system
- **2.2 MongoDB Setup**: ⏳ Mongoose connection and schemas
- **2.3 Request Validation**: ⏳ class-validator implementation

### Phase 3: Advanced Features ⏳ PENDING

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
