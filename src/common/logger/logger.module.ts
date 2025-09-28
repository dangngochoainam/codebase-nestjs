import { Global, Module } from '@nestjs/common';
import { ManualLoggerService } from './manual-logger.service';
import { SystemLoggerService } from './system-logger.service';
import { DataSanitizer } from './data-sanitizer';

@Global()
@Module({
    providers: [DataSanitizer, ManualLoggerService, SystemLoggerService],
    exports: [DataSanitizer, ManualLoggerService, SystemLoggerService],
})
export class LoggerModule {}
