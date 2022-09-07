import bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import mongoose from 'mongoose';
import validator from 'validator';

import { IUser, IUserDoc } from '../interfaces/models/IUser';

interface IUserModel extends mongoose.Model<IUserDoc> {
  build(attrs: IUser): IUserDoc;
}

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    maxlength: [50, "Last name can't be longer than 50 characters"],
    required: [true, 'name is required'],
  },
  email: {
    type: String,
    maxlength: [80, "Email can't be longer than 80 characters"],
    required: [true, 'User must have an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'User must have a valid email'],
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: [8, 'password must be at least 8 charachters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'kindly confirm your password'],
    validate: {
      validator(this: IUserDoc, val: string) {
        return val === this.password;
      },
      message: 'passwords mismatch',
    },
  },
  photo: {
    type: String,
    maxlength: [80, "Email can't be longer than 80 characters"],
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    message: 'The input role is not matched to supported list',
    default: 'user',
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  // Only run this function if password is actually modified
  if (!this.isModified('password')) next();

  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async (
  enteredPassword: string,
  userPassword: string,
) => {
  return await bcrypt.compare(enteredPassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (
  this: IUser,
  JWTTimestamp: number,
) {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
    console.log(JWTTimestamp, changedTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  // False means not change
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.passwordResetToken = hash;

  console.log({ resetToken, passwordResetToken: hash });

  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // expire on 10 mins;

  return resetToken;
};

userSchema.pre('save', function (next) {
  if (this.isModified(this.password) || this.isNew) {
    this.passwordChangedAt = (Date.now() - 1000) as unknown as Date;
  }
  next();
});

userSchema.pre(/^find/, { query: true }, function (next) {
  // this point to current query
  this.find({ active: { $ne: false } });
  next();
});

const UserModel = mongoose.model<IUserDoc, IUserModel>('User', userSchema);

export { UserModel };
