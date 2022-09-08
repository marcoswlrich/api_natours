import bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import mongoose, { Query } from 'mongoose';
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
      validator(this: IUserDoc, val: string): boolean {
        return this.password === val;
      },
      message: 'passwords mismatch',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
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

userSchema.pre<IUserDoc>('save', async function (next) {
  // Only run this function if password is actually modified
  if (!this.isModified('password')) {
    next();
    return;
  }
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre<IUserDoc>('save', function (next) {
  if (!this.isModified(this.password) || this.isNew) return next();

  this.passwordChangedAt = new Date();

  next();
});

userSchema.pre<Query<IUserDoc[], IUserDoc>>(
  /^find/,
  { query: true },
  function (next) {
    // this point to current query
    this.find({ active: { $ne: false } });
    next();
  },
);

userSchema.methods.correctPassword = async (
  candidatePassword: string,
  userPassword: string,
) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (
  this: IUserDoc,
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

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // expire on 10 mins;

  return resetToken;
};

const UserModel = mongoose.model<IUserDoc, IUserModel>('User', userSchema);

export { UserModel };
