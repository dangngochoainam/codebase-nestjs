import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './config/env.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Get environment service
    const envService = app.get(EnvService);

    // Enable CORS
    app.enableCors();

    // Set global prefix
    app.setGlobalPrefix(envService.ENVIRONMENT.API_PREFIX);

    // Start the application
    await app.listen(envService.ENVIRONMENT.PORT);
    console.log(
        `Application is running on: http://localhost:${envService.ENVIRONMENT.PORT}/${envService.ENVIRONMENT.API_PREFIX}`,
    );
}
bootstrap();
