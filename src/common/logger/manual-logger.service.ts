import { Injectable, Logger } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';
import { EnvService } from '../../config/env.service';
import { DataSanitizer } from './data-sanitizer';

@Injectable()
export class ManualLoggerService extends Logger {
    private logger;

    constructor(
        private dataSanitizer: DataSanitizer,
        private envService: EnvService,
    ) {
        super();
        this.logger = createLogger({
            level: this.envService.ENVIRONMENT.LOG_LEVEL,
            format: format.combine(
                format.timestamp(),
                format.colorize(),
                format.printf(
                    ({ timestamp, level, message, context, ...meta }) => {
                        const sanitizedMeta = this.dataSanitizer.sanitize(meta);
                        return `[${timestamp}] [${level}] [${context || 'Application'}] ${message} ${
                            Object.keys(sanitizedMeta).length
                                ? JSON.stringify(sanitizedMeta, null, 2)
                                : ''
                        }`;
                    },
                ),
            ),
            transports: this.getTransports(),
        });
    }

    private getTransports() {
        const transportList = [];

        // Console transport (always enabled for development)
        transportList.push(
            new transports.Console({
                format: format.combine(format.colorize(), format.simple()),
            }),
        );

        // File transport
        if (this.envService.ENVIRONMENT.LOG_TO_FILE) {
            transportList.push(
                new transports.File({
                    filename: 'logs/manual/manual.log',
                    maxsize: 5242880, // 5MB
                    maxFiles: 5,
                }),
            );
        }

        return transportList;
    }

    // Manual logging methods (called by developers)
    debug(message: string, context?: string, meta?: any) {
        if (this.envService.ENVIRONMENT.ENABLE_MANUAL_LOGS) {
            this.logger.debug(message, { context, ...meta });
        }
    }

    info(message: string, context?: string, meta?: any) {
        if (this.envService.ENVIRONMENT.ENABLE_MANUAL_LOGS) {
            this.logger.info(message, { context, ...meta });
        }
    }

    warn(message: string, context?: string, meta?: any) {
        if (this.envService.ENVIRONMENT.ENABLE_MANUAL_LOGS) {
            this.logger.warn(message, { context, ...meta });
        }
    }

    error(message: string, stack?: string, context?: string) {
        if (this.envService.ENVIRONMENT.ENABLE_MANUAL_LOGS) {
            this.logger.error(message, {
                context,
                stack,
            });
        }
    }

    logError(message: string, error?: Error, context?: string, meta?: any) {
        if (this.envService.ENVIRONMENT.ENABLE_MANUAL_LOGS) {
            this.logger.error(message, {
                context,
                error: error?.stack,
                ...meta,
            });
        }
    }

    // Business logic logging methods (called manually by developers)
    logBusinessEvent(event: string, details?: any, context?: string) {
        if (this.envService.ENVIRONMENT.ENABLE_MANUAL_LOGS) {
            this.info(`Business Event: ${event}`, context, {
                type: 'business_event',
                details,
            });
        }
    }

    logCustomDebug(message: string, data?: any, context?: string) {
        if (this.envService.ENVIRONMENT.ENABLE_MANUAL_LOGS) {
            this.debug(`Custom Debug: ${message}`, context, {
                type: 'custom_debug',
                data,
            });
        }
    }

    logUserAction(
        action: string,
        userId?: string,
        details?: any,
        context?: string,
    ) {
        if (this.envService.ENVIRONMENT.ENABLE_MANUAL_LOGS) {
            this.info(`User Action: ${action}`, context, {
                type: 'user_action',
                userId,
                action,
                details,
            });
        }
    }

    logPerformance(
        message: string,
        duration: number,
        context?: string,
        meta?: any,
    ) {
        if (this.envService.ENVIRONMENT.ENABLE_MANUAL_LOGS) {
            this.info(`Performance: ${message}`, context, {
                type: 'performance',
                duration: `${duration}ms`,
                ...meta,
            });
        }
    }
}
