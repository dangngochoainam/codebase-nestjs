import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { HTTP_HEADERS } from '../constants';
import { CustomRequest } from '../types';
import { AsyncLocalStorage } from 'async_hooks';
import { IAlsContext } from './async-local-storage';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    constructor(private readonly als: AsyncLocalStorage<IAlsContext>) {}
    use(req: CustomRequest, _: Response, next: NextFunction) {
        // Always generate a new request ID for tracking if not provided
        let requestId = req.headers[HTTP_HEADERS.REQUEST_ID.toLowerCase()];
        if (!requestId) {
            requestId = uuidv4();
        }

        req.requestId = requestId;
        const store = {
            requestId: requestId,
        };

        this.als.run(store, () => next());
    }
}
