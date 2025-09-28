import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { SystemLoggerService } from '../common/logger/system-logger.service';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    constructor(
        @InjectConnection() private connection: Connection,
        private systemLogger: SystemLoggerService,
    ) {}

    async onModuleInit() {
        // Log successful connection

        this.systemLogger.logApplicationStart(
            this.connection.port || 27017,
            'database',
        );

        // Set up connection event listeners
        this.connection.on('connected', () => {
            this.systemLogger.logPerformanceMetric(
                'database_connection',
                0,
                'success',
            );
        });

        this.connection.on('error', (error) => {
            this.systemLogger.logError(
                'Database connection error',
                error,
                'Database',
            );
        });

        this.connection.on('disconnected', () => {
            this.systemLogger.logSecurityEvent('database_disconnection', {
                host: this.connection.host,
                port: this.connection.port,
                name: this.connection.name,
            });
        });

        this.connection.on('reconnected', () => {
            this.systemLogger.logPerformanceMetric(
                'database_reconnection',
                0,
                'success',
            );
        });
    }

    async onModuleDestroy() {
        if (this.connection.readyState === 1) {
            await this.connection.close();
            this.systemLogger.logApplicationShutdown('database_cleanup');
        }
    }

    getConnection(): Connection {
        return this.connection;
    }

    isConnected(): boolean {
        return this.connection.readyState === 1;
    }

    async healthCheck(): Promise<{ status: string; details: any }> {
        try {
            const state = this.connection.readyState;
            const states = {
                0: 'disconnected',
                1: 'connected',
                2: 'connecting',
                3: 'disconnecting',
            };

            return {
                status: states[state] || 'unknown',
                details: {
                    host: this.connection.host,
                    port: this.connection.port,
                    name: this.connection.name,
                    readyState: state,
                },
            };
        } catch (error) {
            this.systemLogger.logError(
                'Database health check failed',
                error,
                'Database',
            );
            return {
                status: 'error',
                details: { error: error.message },
            };
        }
    }
}
