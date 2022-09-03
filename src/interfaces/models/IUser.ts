interface IUser {
  name: string;
  email: string;
  password: string;
  confirmPassword: string | undefined;
  photo?: string;
  role: 'user' | 'guide' | 'lead-guide' | 'admin';
  active: boolean;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createPasswordResetToken(): string;
}

export { IUser };
