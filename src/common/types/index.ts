export type FunctionConstructor<T = any> = new (...args: any[]) => T;

// Extended Request interface for middleware
export interface CustomRequest extends Request {
    requestId?: string; // Always present - internal request tracking
    correlationId?: string; // Optional - only if client provides it
    userId?: string; // User ID for authentication context
}
