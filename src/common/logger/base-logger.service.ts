import { Injectable, LoggerService } from '@nestjs/common';
import { EnvService } from 'src/config/env.service';
import winston, { createLogger, format, transports } from 'winston';
import { DataSanitizer } from './data-sanitizer';
import { inspect } from 'util';

export interface IContextLogger {
    requestId: string;
}

export class ContextLogger implements LoggerService {
    public constructor(
        public service: ContextLoggerService,
        public context: string,
    ) {}

    log(message: any, customLogging?: IContextLogger) {
        this.service.logger.info(message, {
            context: this.context,
            ...customLogging,
        });
    }

    info(message: any, customLogging?: IContextLogger) {
        this.service.logger.info(message, {
            context: this.context,
            ...customLogging,
        });
    }

    debug(message: any, customLogging?: IContextLogger) {
        this.service.logger.debug(message, {
            context: this.context,
            ...customLogging,
        });
    }

    error(message: any, error?: Error, customLogging?: IContextLogger) {
        const formattedError = this.formatErrorStack(error);
        this.service.logger.error(`${message}${formattedError || ''}`, {
            context: this.context,
            ...customLogging,
        });
    }

    /**
     * Format error stack trace to readable format with line breaks
     * @param error - Error object to format
     * @returns Formatted error string with stack trace
     */
    private formatErrorStack(error?: Error): string {
        if (!error) {
            return '';
        }

        const errorName = error.name || 'Error';
        const errorMessage = error.message || '';
        const errorStack = error.stack || '';

        // Build formatted error string
        let formatted = `\n┌─ ${errorName}${errorMessage ? `: ${errorMessage}` : ''}`;

        if (errorStack) {
            // Split stack trace into lines
            const stackLines = errorStack.split('\n');

            // Remove the first line if it's just the error name and message (duplicate)
            let startIndex = 0;
            if (
                stackLines[0]?.includes(errorName) &&
                stackLines[0]?.includes(errorMessage)
            ) {
                startIndex = 1;
            }

            // Format each stack line with indentation
            for (let i = startIndex; i < stackLines.length; i++) {
                const line = stackLines[i]?.trim();
                if (line) {
                    formatted += `\n│  ${line}`;
                }
            }
        }

        formatted += '\n└─';

        return formatted;
    }

    warn(message: any, customLogging?: IContextLogger) {
        this.service.logger.warn(message, {
            context: this.context,
            ...customLogging,
        });
    }

    private limitSize(obj: any) {
        try {
            const json = JSON.stringify(obj);
            return json.length > 4000 ? json.substring(0, 4000) + '…' : json;
        } catch {
            return '[unserializable]';
        }
    }

    logHttpRequest(method: string, url: string, requestId: string, body?: any) {
        const safeBody = this.service.dataSanitizer.sanitize(body || {});

        this.service.logger.info(`HTTP Request: ${method} ${url}`, {
            type: 'http_request',
            method,
            url,
            requestId,
            body: this.limitSize(safeBody),
        });
    }

    logHttpResponse(
        method: string,
        url: string,
        requestId: string,
        duration: number,
        responseBody: any,
    ) {
        const sanitizedBody = this.service.dataSanitizer.sanitize(responseBody);

        this.service.logger.info(`HTTP Response: ${method} ${url}`, {
            type: 'http_response',
            method,
            url,
            duration: `${duration}ms`,
            requestId,
            body: this.limitSize(sanitizedBody),
        });
    }
}
@Injectable()
export class ContextLoggerService {
    public logger: winston.Logger;

    constructor(
        public envService: EnvService,
        public dataSanitizer: DataSanitizer,
    ) {
        this.logger = createLogger({
            level: this.envService.ENVIRONMENT.LOG_LEVEL,
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss Z' }),
                format.printf(
                    ({ timestamp, level, message, context, ...meta }) => {
                        const sanitizedMeta = this.dataSanitizer.sanitize(meta);
                        const metaStr =
                            Object.keys(sanitizedMeta).length > 0
                                ? `${JSON.stringify(sanitizedMeta)}`
                                : '';
                        const msg =
                            typeof message === 'object'
                                ? inspect(message)
                                : message;
                        return `[${timestamp}] ${level.toUpperCase()} (${context || 'Application'} on ${this.envService.ENVIRONMENT.SERVICE_NAME}/${this.envService.ENVIRONMENT.INSTANCE_ID}): ${msg} __ Metadata: ${metaStr}`;
                    },
                ),
            ),
            transports: this.getTransports(),
        });
    }

    private getTransports() {
        const transportList = [];

        transportList.push(
            new transports.Console({
                format: format.combine(format.colorize({ all: true })),
            }),
        );

        if (this.envService.ENVIRONMENT.LOG_TO_FILE) {
            transportList.push(
                new transports.File({
                    level: 'info',
                    filename: 'logs/manual/manual.log',
                    maxsize: 10485760, // 10MB
                    maxFiles: 5,
                }),
            );
        }

        return transportList;
    }

    public newContextLogger(context: string) {
        return new ContextLogger(this, context);
    }
}
