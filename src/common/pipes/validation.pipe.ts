import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { SystemLoggerService } from '../logger/system-logger.service';
import { FunctionConstructor } from '../types';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    constructor(private systemLogger: SystemLoggerService) {}

    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }

        const object = plainToClass(metatype, value);
        const errors = await validate(object);

        if (errors.length > 0) {
            const errorMessages = this.formatValidationErrors(errors);

            // Log validation errors using system logger
            this.systemLogger.logSecurityEvent('validation_error', {
                errors: errorMessages,
                value: this.sanitizeValue(value),
            });

            throw new BadRequestException({
                message: 'Validation failed',
                errors: errorMessages,
                statusCode: 400,
            });
        }

        return object;
    }

    private toValidate(metatype: FunctionConstructor<any>): boolean {
        const types: FunctionConstructor[] = [
            String,
            Boolean,
            Number,
            Array,
            Object,
        ];
        return !types.includes(metatype);
    }

    private formatValidationErrors(errors: any[]): string[] {
        const errorMessages: string[] = [];

        errors.forEach((error) => {
            if (error.constraints) {
                Object.values(error.constraints).forEach((message: string) => {
                    errorMessages.push(message);
                });
            }

            if (error.children && error.children.length > 0) {
                const childErrors = this.formatValidationErrors(error.children);
                errorMessages.push(...childErrors);
            }
        });

        return errorMessages;
    }

    private sanitizeValue(value: any): any {
        // Remove sensitive fields from logged value
        if (typeof value === 'object' && value !== null) {
            const sanitized = { ...value };
            const sensitiveFields = ['password', 'token', 'secret', 'key'];

            sensitiveFields.forEach((field) => {
                if (sanitized[field]) {
                    sanitized[field] = '***';
                }
            });

            return sanitized;
        }

        return value;
    }
}
