import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './config/env.service';
import { ContextLoggerService } from './common/logger/base-logger.service';
import { ValidationPipe } from './common/pipes/validation.pipe';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Get services
    const envService = app.get(EnvService);
    const systemLogger = app.get(ContextLoggerService);

    // Enable CORS
    app.enableCors();

    // Set global prefix
    app.setGlobalPrefix(envService.ENVIRONMENT.API_PREFIX);

    // Set global validation pipe
    app.useGlobalPipes(new ValidationPipe(systemLogger));

    // Start the application
    await app.listen(envService.ENVIRONMENT.PORT);

    // Log application startup using system logger
    // systemLogger.logApplicationStart(
    //     envService.ENVIRONMENT.PORT,
    //     envService.ENVIRONMENT.NODE_ENV,
    // );

    console.log(
        `Application is running on: http://localhost:${envService.ENVIRONMENT.PORT}/${envService.ENVIRONMENT.API_PREFIX}`,
    );
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});

bootstrap();
