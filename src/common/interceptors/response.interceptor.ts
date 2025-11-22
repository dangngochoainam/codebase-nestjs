import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SystemLoggerService } from '../logger/system-logger.service';
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
    constructor(private readonly systemLogger: SystemLoggerService) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<ApiResponse<T>> {
        const http = context.switchToHttp();
        const request = http.getRequest<CustomRequest>();

        const url = request.url;
        const method = request.method;

        const startedAt = Date.now();

        this.systemLogger.logHttpRequest(
            method,
            url,
            request.requestId,
            request.correlationId,
            request?.body,
        );

        return next.handle().pipe(
            map((data: any) => {
                const wrapped: SuccessResponse<T> = {
                    success: true,
                    data: data,
                    requestId: request.requestId,
                    systemCode: '00200',
                };

                const duration = Date.now() - startedAt;
                this.systemLogger.logHttpResponse(
                    method,
                    url,
                    request.requestId,
                    duration,
                    data,
                    request.correlationId,
                );

                return wrapped;
            }),
            catchError((err: any) => {
                this.systemLogger.logError(
                    'Request failed',
                    err,
                    this.constructor.name,
                );

                let httpStatusCode = 500;
                let errMessage: string = 'Internal Server Error';
                let details: any;
                let systemCode = '500';

                if (err instanceof HttpException) {
                    httpStatusCode =
                        (err && err.getStatus && err.getStatus()) ??
                        httpStatusCode;

                    const errorResponse = err.getResponse();
                    if (typeof errorResponse === 'string') {
                        errMessage = errorResponse;
                    } else if (
                        errorResponse &&
                        typeof errorResponse === 'object'
                    ) {
                        const r: any = errorResponse;
                        errMessage =
                            r.message && typeof r.message === 'string'
                                ? r.message
                                : r.error || err.message || errMessage;
                    } else if (err.message) {
                        errMessage = err.message;
                    }
                }

                systemCode = 'SORRY_SOMETHING_WENT_WRONG';
                if (httpStatusCode === HttpStatus.BAD_REQUEST) {
                    systemCode = '00400';
                } else if (httpStatusCode === HttpStatus.UNAUTHORIZED) {
                    systemCode = '00401';
                } else if (httpStatusCode === HttpStatus.FORBIDDEN) {
                    systemCode = '00403';
                }

                const errorWrapped: ErrorResponse = {
                    success: false,
                    requestId: request.requestId,
                    systemCode,
                    error: {
                        message: errMessage,
                        statusCode: httpStatusCode,
                        details,
                    },
                };

                const duration = Date.now() - startedAt;
                this.systemLogger.logHttpResponse(
                    method,
                    url,
                    request.requestId,
                    duration,
                    err,
                    request.correlationId,
                );

                return of(errorWrapped);
            }),
        );
    }
}
