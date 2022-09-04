import mongoose from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  photo?: string;
  password: string;
  passwordConfirm: string | undefined;
  passwordChangedAt?: Date;
}

export interface IUserDoc extends mongoose.Document {
  name: string;
  email: string;
  photo?: string;
  password: string;
  role?: string;
  passwordConfirm: string | undefined;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  active?: boolean;
  correctPassword(password: string, hash: string): boolean;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  createPasswordResetToken(): string;
}
