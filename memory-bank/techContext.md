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
- Database (PostgreSQL/SQLite)

### Environment Configuration
- `.env` files for different environments
- Single environment configuration class validated by class-validator
- Direct property access through global configuration instance (envConfig.PROPERTY)
- Configuration class with validation decorators (@IsString, @IsNumber, etc.)
- Automatic type conversion and validation on application startup
- Global access without dependency injection

### Project Structure
```
src/
├── app.module.ts
├── main.ts
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── modules/
│   ├── auth/
│   ├── users/
│   └── ...
├── database/
│   ├── entities/
│   ├── migrations/
│   └── seeds/
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

## Dependencies

### Core Dependencies
- `@nestjs/core`
- `@nestjs/common`
- `@nestjs/platform-express`
- `@nestjs/mongoose`
- `@nestjs/config`
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
