import {
    CallHandler,
    ExecutionContext,
    HttpException,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ERROR_MESSAGE, SYSTEM_CODE } from '../constants/system-code.constants';
import {
    ContextLogger,
    ContextLoggerService,
} from '../logger/base-logger.service';
import { CustomRequest } from '../types';
import {
    ApiResponse,
    ErrorResponse,
    SuccessResponse,
} from './response.interface';

@Injectable()
export class ResponseInterceptor<T>
    implements NestInterceptor<T, ApiResponse<T>>
{
    private readonly logger: ContextLogger;

    constructor(protected readonly contextLoggerService: ContextLoggerService) {
        this.logger = contextLoggerService.newContextLogger(
            this.constructor.name,
        );
    }

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<ApiResponse<T>> {
        const http = context.switchToHttp();
        const request = http.getRequest<CustomRequest>();

        const url = request.url;
        const method = request.method;
        const requestId = request.requestId;
        const startedAt = Date.now();

        this.logger.logHttpRequest(method, url, requestId, request?.body);

        return next.handle().pipe(
            map((data: any) => {
                const wrapped: SuccessResponse<T> = {
                    message: 'Successfully',
                    success: true,
                    data: data,
                    requestId: requestId,
                    systemCode: SYSTEM_CODE.SUCCESS,
                };

                const duration = Date.now() - startedAt;
                this.logger.logHttpResponse(
                    method,
                    url,
                    requestId,
                    duration,
                    data,
                );

                return wrapped;
            }),
            catchError((err: any) => {
                this.logger.error('Request failed', err, { requestId });

                let systemCode = SYSTEM_CODE.SORRY_SOMETHING_WENT_WRONG;
                let errMessage = 'Please throw system code !!!';
                if (err instanceof HttpException) {
                    const errorResponse = err.getResponse();
                    if (typeof errorResponse === 'string') {
                        systemCode = errorResponse;
                    } else if (
                        errorResponse &&
                        typeof errorResponse === 'object'
                    ) {
                        const r: any = errorResponse;
                        systemCode =
                            r.message && typeof r.message === 'string'
                                ? r.message
                                : r.error || err.message || errMessage;
                    } else if (err.message) {
                        systemCode = err.message;
                    }
                }
                errMessage = ERROR_MESSAGE[systemCode] || errMessage;

                const errorWrapped: ErrorResponse = {
                    message: errMessage,
                    success: false,
                    requestId,
                    systemCode,
                };

                const duration = Date.now() - startedAt;
                this.logger.logHttpResponse(
                    method,
                    url,
                    requestId,
                    duration,
                    err,
                );

                return of(errorWrapped);
            }),
        );
    }
}
