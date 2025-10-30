import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { HTTP_HEADERS } from '../constants';
import { CustomRequest } from '../types';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    use(req: CustomRequest, res: Response, next: NextFunction) {
        // Always generate a new request ID for internal tracking
        const requestId = uuidv4();

        // Attach to request object
        req.requestId = requestId;
        if (req.headers[HTTP_HEADERS.CORRELATION_ID]) {
            req.correlationId = req.headers[HTTP_HEADERS.CORRELATION_ID];
        }

        // Add to response headers
        res.setHeader(HTTP_HEADERS.REQUEST_ID, requestId);

        // Add to response locals for use in other middleware/interceptors
        // To store data that's local to the current request.
        res.locals.requestId = requestId;
        res.locals.correlationId = req.correlationId;

        next();
    }
}
