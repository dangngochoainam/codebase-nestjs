import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
    timestamps: true,
    collection: 'users',
})
export class User {
    @Prop({ required: true, unique: true, lowercase: true, trim: true })
    email: string;

    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: 'user' })
    role: string;

    @Prop()
    lastLoginAt?: Date;

    @Prop()
    avatar?: string;

    @Prop({ type: Object })
    profile?: {
        firstName?: string;
        lastName?: string;
        phone?: string;
        address?: string;
        bio?: string;
    };
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });
