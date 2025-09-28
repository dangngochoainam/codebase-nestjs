import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from 'class-validator';

export function IsNotBlank(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'isNotBlank',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    return typeof value === 'string' && value.trim().length > 0;
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} should not be empty or contain only whitespace`;
                },
            },
        });
    };
}

export function IsStrongPassword(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'isStrongPassword',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    if (typeof value !== 'string') return false;

                    const hasUpperCase = /[A-Z]/.test(value);
                    const hasLowerCase = /[a-z]/.test(value);
                    const hasNumbers = /\d/.test(value);
                    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
                    const isLongEnough = value.length >= 8;

                    return (
                        hasUpperCase &&
                        hasLowerCase &&
                        hasNumbers &&
                        hasSpecialChar &&
                        isLongEnough
                    );
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character`;
                },
            },
        });
    };
}

export function IsValidPhoneNumber(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'isValidPhoneNumber',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    if (typeof value !== 'string') return false;

                    // Remove all non-digit characters
                    const cleaned = value.replace(/\D/g, '');

                    // Check if it's a valid phone number (10-15 digits)
                    return cleaned.length >= 10 && cleaned.length <= 15;
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be a valid phone number`;
                },
            },
        });
    };
}

export function IsValidAge(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'isValidAge',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    if (typeof value !== 'number') return false;

                    return value >= 0 && value <= 150;
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be a valid age between 0 and 150`;
                },
            },
        });
    };
}

export function IsValidUrl(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'isValidUrl',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    if (typeof value !== 'string') return false;

                    try {
                        new URL(value);
                        return true;
                    } catch {
                        return false;
                    }
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be a valid URL`;
                },
            },
        });
    };
}
