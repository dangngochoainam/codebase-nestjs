import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsDateString,
    IsEmail,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    Length,
    Matches,
    Max,
    Min,
} from 'class-validator';

export class PaginationDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @IsOptional()
    @IsString()
    sortBy?: string;

    @IsOptional()
    @IsEnum(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc' = 'desc';
}

export class BaseResponseDto {
    @IsBoolean()
    success: boolean;

    @IsString()
    message: string;

    @IsOptional()
    data?: any;

    @IsOptional()
    errors?: string[];

    @IsOptional()
    @IsNumber()
    statusCode?: number;

    @IsOptional()
    @IsDateString()
    timestamp?: string;
}

export class CreateUserDto {
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;

    @IsString()
    @Length(2, 50, { message: 'Name must be between 2 and 50 characters' })
    name: string;

    @IsString()
    @Length(8, 128, {
        message: 'Password must be between 8 and 128 characters',
    })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        {
            message:
                'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        },
    )
    password: string;

    @IsOptional()
    @IsString()
    @Length(2, 50)
    firstName?: string;

    @IsOptional()
    @IsString()
    @Length(2, 50)
    lastName?: string;

    @IsOptional()
    @IsString()
    @Length(10, 15)
    @Matches(/^\+?[1-9]\d{1,14}$/, {
        message: 'Please provide a valid phone number',
    })
    phone?: string;

    @IsOptional()
    @IsString()
    @Length(10, 500)
    bio?: string;
}

export class UpdateUserDto {
    @IsOptional()
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email?: string;

    @IsOptional()
    @IsString()
    @Length(2, 50, { message: 'Name must be between 2 and 50 characters' })
    name?: string;

    @IsOptional()
    @IsString()
    @Length(2, 50)
    firstName?: string;

    @IsOptional()
    @IsString()
    @Length(2, 50)
    lastName?: string;

    @IsOptional()
    @IsString()
    @Length(10, 15)
    @Matches(/^\+?[1-9]\d{1,14}$/, {
        message: 'Please provide a valid phone number',
    })
    phone?: string;

    @IsOptional()
    @IsString()
    @Length(10, 500)
    bio?: string;

    @IsOptional()
    @IsString()
    avatar?: string;
}

export class LoginDto {
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;

    @IsString()
    @Length(1, 128, { message: 'Password is required' })
    password: string;
}

export class ChangePasswordDto {
    @IsString()
    @Length(1, 128, { message: 'Current password is required' })
    currentPassword: string;

    @IsString()
    @Length(8, 128, {
        message: 'New password must be between 8 and 128 characters',
    })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        {
            message:
                'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        },
    )
    newPassword: string;
}
