import { Injectable, Global } from '@nestjs/common';
import { config } from 'dotenv';
import { EnvironmentConfig } from './env.config';
import { validateEnvironment } from './validate-env';

@Injectable()
@Global()
export class EnvService {
    private readonly config: EnvironmentConfig;

    constructor() {
        // Load .env file
        config();

        // Load and validate environment variables
        this.config = validateEnvironment(process.env);
    }

    // Get the full config object if needed
    get ENVIRONMENT(): EnvironmentConfig {
        return this.config;
    }
}
