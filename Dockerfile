# -------- Build stage --------
FROM node:22-alpine AS builder

WORKDIR /src

COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build (if using TS / bundler)
RUN npm run build

# -------- Runtime stage --------
FROM node:22-alpine

WORKDIR /src

ENV NODE_ENV=production

# Copy only needed files
COPY --from=builder /src/package*.json ./
COPY --from=builder /src/node_modules ./node_modules
COPY --from=builder /src/dist ./dist

# Security: non-root user
USER node

EXPOSE 3003

CMD ["node", "dist/main.js"]
    