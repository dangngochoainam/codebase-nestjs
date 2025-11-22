/**
 * HTTP Header Constants
 * Centralized header names to avoid magic strings
 */
export const HTTP_HEADERS = {
    // Request/Response Tracking
    REQUEST_ID: 'X-Request-ID',

    // Rate Limiting
    RATE_LIMIT_LIMIT: 'X-RateLimit-Limit',
    RATE_LIMIT_REMAINING: 'X-RateLimit-Remaining',
    RATE_LIMIT_RESET: 'X-RateLimit-Reset',

    // CORS
    ACCESS_CONTROL_ALLOW_ORIGIN: 'Access-Control-Allow-Origin',
    ACCESS_CONTROL_ALLOW_METHODS: 'Access-Control-Allow-Methods',
    ACCESS_CONTROL_ALLOW_HEADERS: 'Access-Control-Allow-Headers',
    ACCESS_CONTROL_ALLOW_CREDENTIALS: 'Access-Control-Allow-Credentials',
    ACCESS_CONTROL_MAX_AGE: 'Access-Control-Max-Age',

    // Security Headers (set by Helmet)
    CONTENT_SECURITY_POLICY: 'Content-Security-Policy',
    X_FRAME_OPTIONS: 'X-Frame-Options',
    X_CONTENT_TYPE_OPTIONS: 'X-Content-Type-Options',
    X_XSS_PROTECTION: 'X-XSS-Protection',
    STRICT_TRANSPORT_SECURITY: 'Strict-Transport-Security',
    REFERRER_POLICY: 'Referrer-Policy',

    // Standard Headers
    CONTENT_TYPE: 'Content-Type',
    USER_AGENT: 'User-Agent',
    AUTHORIZATION: 'Authorization',
    API_KEY: 'X-API-Key',
} as const;

/**
 * Header value constants
 */
export const HEADER_VALUES = {
    // CORS Methods
    CORS_METHODS: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',

    // CORS Headers
    CORS_HEADERS: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'X-Correlation-ID',
        'X-API-Key',
    ].join(', '),

    // CORS Credentials
    CORS_CREDENTIALS: 'true',

    // CORS Max Age (10 minutes)
    CORS_MAX_AGE: '600',

    // Content Types
    JSON_CONTENT_TYPE: 'application/json',
    TEXT_CONTENT_TYPE: 'text/plain',
} as const;

/**
 * Type definitions for header constants
 */
export type HttpHeaderKey = keyof typeof HTTP_HEADERS;
export type HeaderValueKey = keyof typeof HEADER_VALUES;
