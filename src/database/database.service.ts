import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import {
    ContextLogger,
    ContextLoggerService,
} from '../common/logger/base-logger.service';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private readonly logger: ContextLogger;

    constructor(
        @InjectConnection() private connection: Connection,
        protected readonly contextLoggerService: ContextLoggerService,
    ) {
        this.logger = contextLoggerService.newContextLogger(
            this.constructor.name,
        );
    }

    async onModuleInit() {
        // Set up connection event listeners
        this.connection.on('connected', () => {
            this.logger.info('database_connection');
        });

        this.connection.on('error', (error) => {
            this.logger.error('Database connection error', error);
        });

        this.connection.on('disconnected', () => {
            this.logger.info('database_disconnection');
        });

        this.connection.on('reconnected', () => {
            this.logger.info('database_reconnection');
        });
    }

    async onModuleDestroy() {
        if (this.connection.readyState === 1) {
            await this.connection.close();
            this.logger.info('database_cleanup');
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
            this.logger.error('Database health check failed', error);
            return {
                status: 'error',
                details: { error: error.message },
            };
        }
    }
}
