# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run start:dev       # Watch mode
npm run start:debug     # Debug with inspect

# Build & Production
npm run build
npm run start:prod      # node dist/main

# Code quality
npm run lint            # ESLint with auto-fix
npm run format          # Prettier

# Testing
npm test                # Jest
npm run test:watch
npm run test:cov
npm run test:e2e        # Uses test/jest-e2e.json config

# Docker
docker compose up -d
```

## Architecture

### Module Organization

```
src/
├── app.module.ts           # Root module (registers all feature modules)
├── config/                 # EnvModule (global) — typed, validated env vars
├── database/               # MongoDB/Mongoose setup + schemas
├── modules/                # Feature modules (e.g. user/)
└── common/
    ├── constants/          # System response codes
    ├── decorators/
    ├── dto/                # Base DTOs (pagination, user CRUD, auth, change-password)
    ├── guards/
    ├── interceptors/       # ResponseInterceptor (global)
    ├── logger/             # Winston logger (console + optional file)
    ├── middleware/         # RequestId → CORS → RateLimit → ALS
    ├── pipes/              # Custom ValidationPipe (global)
    ├── types/
    └── utils/
```

### Request Lifecycle

1. **Middleware chain:** `RequestIdMiddleware` (UUID) → `CorsMiddleware` → `RateLimitMiddleware` (100 req/15 min per IP) → `AlsMiddleware` (stores requestId in AsyncLocalStorage)
2. **Global pipe:** `ValidationPipe` (class-validator/class-transformer)
3. **Global interceptor:** `ResponseInterceptor` — wraps all responses in `{ success, data, message, requestId, systemCode }`

### Response Format

All responses are normalized by `ResponseInterceptor`:
- Success: `{ success: true, data, message, requestId, systemCode }`
- Error: `{ success: false, message, requestId, systemCode }`

System codes are defined in `src/common/constants/`.

### Logging

Winston logger with manual and HTTP auto-logging layers. Sensitive fields are masked when `MASK_SENSITIVE_DATA=true`. Request context (requestId, serviceName, instanceId) flows through AsyncLocalStorage. Log level and file output are controlled by env vars.

### Environment

Typed and validated via `src/config/env.config.ts` (class-validator). Key variables:

| Variable | Purpose |
|---|---|
| `PORT` | Server port |
| `DATABASE_URL` / `DATABASE_NAME` | MongoDB |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | Auth |
| `CORS_ORIGINS` | Comma-separated allowed origins |
| `LOG_LEVEL` / `LOG_TO_FILE` | Logging |
| `MASK_SENSITIVE_DATA` | Sanitize logs |

See `.env.example` for full list.

### Auth (Scaffolded)

Packages installed (`@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `bcrypt`) and DTOs exist, but guards are not yet implemented. JWT-based auth is the intended pattern.

### Docker

Multi-stage Dockerfile (Node 22-alpine). App runs on internal port 3000, mapped to 3003. Requires an external Docker network named `docker_stack`.
