# System Patterns

## Architecture Overview

This NestJS project will follow a modular, layered architecture pattern that promotes separation of concerns and maintainability.

## Core Architecture Patterns

### 1. Modular Architecture

- **Modules**: Feature-based modules (users, auth, etc.)
- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic and data access
- **DTOs**: Data Transfer Objects for validation
- **Entities**: Database models
- **Guards**: Authentication and authorization
- **Interceptors**: Cross-cutting concerns (logging, transformation)

### 2. Layered Architecture

```
┌─────────────────┐
│   Controllers   │ ← HTTP Layer
├─────────────────┤
│    Services     │ ← Business Logic Layer
├─────────────────┤
│   Repositories  │ ← Data Access Layer
├─────────────────┤
│    Database     │ ← Persistence Layer
└─────────────────┘
```

### 3. Dependency Injection

- Use NestJS built-in DI container
- Inject dependencies through constructor
- Follow single responsibility principle
- Use interfaces for better testability

## Key Design Patterns

### 1. Repository Pattern

- Abstract data access logic
- Make services database-agnostic
- Enable easy testing with mocks

### 2. DTO Pattern

- Validate incoming data
- Transform data between layers
- Provide type safety

### 3. Guard Pattern

- Handle authentication
- Implement authorization
- Protect routes and resources

### 4. Interceptor Pattern

- Logging and monitoring
- Response transformation
- Error handling
- System code standardization

### 5. Context Pattern (AsyncLocalStorage)

- Request context management across async operations
- Request ID propagation through async call chains
- Context-based logging with automatic requestId injection
- **Implementation**:
  - `AlsModule`: Global module providing AsyncLocalStorage instance
  - `IAlsContext`: Interface defining context structure (requestId)
  - `RequestIdMiddleware`: Stores requestId in AsyncLocalStorage
  - Services access context via `als.getStore().requestId`
  - **Benefits**: No need to manually pass requestId through function parameters

## Component Relationships

### Core Components

- **AppModule**: Root module
- **Feature Modules**: Domain-specific modules
- **Shared Modules**: Common functionality
- **Core Module**: Core services and utilities
- **AlsModule**: AsyncLocalStorage for request context management
- **LoggerModule**: Unified logging system with context support

### Data Flow

1. **Request** → Controller
2. **Controller** → Service
3. **Service** → Repository
4. **Repository** → Database
5. **Response** ← Controller

## Critical Implementation Paths

### 1. Authentication Flow

```
Request → AuthGuard → Controller → Service → Database
```

### 2. Data Validation Flow

```
Request → DTO Validation → Controller → Service
```

### 3. Error Handling Flow

```
Error → Exception Filter → Response
```

### 4. Request Context Flow

```
Request → RequestIdMiddleware → AsyncLocalStorage → ContextLogger → Response
```

### 5. Logging Flow

```
Service/Controller → ContextLogger (with context) → ContextLoggerService → Winston → Transports
```

## Configuration Patterns

- Environment-based configuration
- Centralized configuration service
- Type-safe configuration objects
- Validation of configuration values

## Testing Patterns

- Unit tests for services
- Integration tests for controllers
- E2E tests for complete flows
- Mock external dependencies
- Test database for integration tests

## Critical Workflow Rules

### Phase-by-Phase Development Process

- **MANDATORY STOP RULE**: Must stop after each complete phase for user review
- **NO AUTO-PROGRESSION**: Never continue to next phase without explicit user approval
- **MEMORY BANK UPDATES**: Always update memory bank after each phase completion
- **USER CONFIRMATION REQUIRED**: Present phase summary and wait for user confirmation

### Phase Implementation Flow

```
Phase Start → Implement All Tasks → Test Features → Update Memory Bank → Present Summary → STOP → Wait for User Review → User Approval → Next Phase
```

### Quality Gates

- Each phase must be fully functional before proceeding
- All tests must pass
- Memory bank must be updated
- User review and approval required
