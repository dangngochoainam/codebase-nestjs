import { Injectable, Logger } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';
import { EnvService } from '../../config/env.service';
import { DataSanitizer } from './data-sanitizer';

@Injectable()
export class SystemLoggerService extends Logger {
    private logger;

    constructor(
        private dataSanitizer: DataSanitizer,
        private envService: EnvService,
    ) {
        super();
        this.logger = createLogger({
            level: 'info', // System logs typically don't need debug level
            format: format.combine(
                format.timestamp(),
                format.errors({ stack: true }),
                format.json(),
                format.printf((info) => {
                    const sanitized = this.dataSanitizer.sanitize(info);
                    return JSON.stringify({
                        timestamp: sanitized.timestamp,
                        level: sanitized.level,
                        message: sanitized.message,
                        service: sanitized.context || 'system',
                        correlationId: sanitized.correlationId,
                        userId: sanitized.userId,
                        requestId: sanitized.requestId,
                        environment: this.envService.ENVIRONMENT.NODE_ENV,
                        ...sanitized,
                    });
                }),
            ),
            transports: this.getTransports(),
        });
    }

    private getTransports() {
        const transportList = [];

        // Console transport for production (structured JSON)
        if (this.envService.ENVIRONMENT.NODE_ENV !== 'production') {
            transportList.push(new transports.Console());
        }

        // File transport with rotation
        if (this.envService.ENVIRONMENT.LOG_TO_FILE) {
            transportList.push(
                new transports.File({
                    filename: 'logs/automatic/automatic.log',
                    maxsize: 10485760, // 10MB
                    maxFiles: 10,
                }),
            );

            // Separate error log file
            transportList.push(
                new transports.File({
                    filename: 'logs/automatic/error.log',
                    level: 'error',
                    maxsize: 10485760,
                    maxFiles: 10,
                }),
            );
        }

        return transportList;
    }

    // Automatic system logging methods (called by middleware/interceptors)
    logHttpRequest(
        method: string,
        url: string,
        statusCode: number,
        duration: number,
        userId?: string,
        requestId?: string,
    ) {
        if (this.envService.ENVIRONMENT.ENABLE_AUTOMATIC_LOGS) {
            this.logger.info(`HTTP Request: ${method} ${url}`, {
                type: 'http_request',
                method,
                url,
                statusCode,
                duration: `${duration}ms`,
                userId,
                requestId,
                context: 'HTTP',
            });
        }
    }

    logDatabaseQuery(query: string, duration: number, context?: string) {
        if (this.envService.ENVIRONMENT.ENABLE_AUTOMATIC_LOGS) {
            this.logger.debug(`Database Query: ${query}`, {
                type: 'database_query',
                duration: `${duration}ms`,
                context: context || 'Database',
            });
        }
    }

    logSecurityEvent(event: string, details: any, userId?: string) {
        if (this.envService.ENVIRONMENT.ENABLE_AUTOMATIC_LOGS) {
            this.logger.warn(`Security Event: ${event}`, {
                type: 'security_event',
                userId,
                details: this.dataSanitizer.sanitize(details),
                context: 'Security',
            });
        }
    }

    logPerformanceMetric(metric: string, value: number, unit: string) {
        if (this.envService.ENVIRONMENT.ENABLE_AUTOMATIC_LOGS) {
            this.logger.info(`Performance Metric: ${metric}`, {
                type: 'performance_metric',
                metric,
                value,
                unit,
                context: 'Performance',
            });
        }
    }

    logError(message: string, error: Error, context?: string, meta?: any) {
        if (this.envService.ENVIRONMENT.ENABLE_AUTOMATIC_LOGS) {
            this.logger.error(message, {
                context,
                error: {
                    name: error.name,
                    message: error.message,
                    stack: error.stack,
                },
                ...this.dataSanitizer.sanitize(meta),
            });
        }
    }

    logApplicationStart(port: number, environment: string) {
        if (this.envService.ENVIRONMENT.ENABLE_AUTOMATIC_LOGS) {
            this.logger.info('Application started', {
                type: 'application_start',
                port,
                environment,
                context: 'Application',
            });
        }
    }

    logApplicationShutdown(signal: string) {
        if (this.envService.ENVIRONMENT.ENABLE_AUTOMATIC_LOGS) {
            this.logger.info('Application shutting down', {
                type: 'application_shutdown',
                signal,
                context: 'Application',
            });
        }
    }

    logMemoryUsage() {
        if (this.envService.ENVIRONMENT.ENABLE_AUTOMATIC_LOGS) {
            const memUsage = process.memoryUsage();
            this.logger.info('Memory usage', {
                type: 'memory_usage',
                rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
                heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
                heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
                external: `${Math.round(memUsage.external / 1024 / 1024)}MB`,
                context: 'System',
            });
        }
    }
}
