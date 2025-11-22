import { Global, Module } from '@nestjs/common';
import { DataSanitizer } from './data-sanitizer';
import { ContextLoggerService } from './base-logger.service';

@Global()
@Module({
    providers: [DataSanitizer, ContextLoggerService],
    exports: [DataSanitizer, ContextLoggerService],
})
export class LoggerModule {}
