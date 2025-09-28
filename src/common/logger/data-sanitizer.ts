import { Injectable } from '@nestjs/common';
import { EnvService } from '../../config/env.service';

@Injectable()
export class DataSanitizer {
    private sensitiveFields = [
        'password',
        'token',
        'authorization',
        'cookie',
        'secret',
        'key',
        'jwt',
        'auth',
        'credential',
        'ssn',
        'social_security',
        'credit_card',
        'card_number',
        'cvv',
        'pin',
        'api_key',
        'access_token',
        'refresh_token',
        'private_key',
        'client_secret',
    ];

    constructor(private envService: EnvService) {}

    sanitize(data: any): any {
        if (!this.envService.ENVIRONMENT.MASK_SENSITIVE_DATA) {
            return data;
        }

        return this.maskSensitiveData(data);
    }

    private maskSensitiveData(obj: any): any {
        if (obj === null || obj === undefined) {
            return obj;
        }

        if (typeof obj === 'string') {
            return obj;
        }

        if (Array.isArray(obj)) {
            return obj.map((item) => this.maskSensitiveData(item));
        }

        if (typeof obj === 'object') {
            const sanitized = {};
            for (const [key, value] of Object.entries(obj)) {
                if (this.isSensitiveField(key)) {
                    sanitized[key] = this.maskValue(value);
                } else {
                    sanitized[key] = this.maskSensitiveData(value);
                }
            }
            return sanitized;
        }

        return obj;
    }

    private isSensitiveField(fieldName: string): boolean {
        const lowerField = fieldName.toLowerCase();
        return this.sensitiveFields.some((sensitive) =>
            lowerField.includes(sensitive),
        );
    }

    private maskValue(value: any): string {
        if (typeof value === 'string' && value.length > 0) {
            if (value.length <= 4) {
                return '***';
            }
            return (
                value.substring(0, 2) +
                '*'.repeat(value.length - 4) +
                value.substring(value.length - 2)
            );
        }
        return '***';
    }
}
