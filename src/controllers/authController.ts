import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import jwt, { Secret, verify, JwtPayload } from 'jsonwebtoken';
import { promisify } from 'util';

import { AppError } from '../errors/AppError';
import { IUser, IUserDoc } from '../interfaces/models/IUser';
import { UserModel } from '../models/userModel';
import { catchAsync } from '../utils/catchAsync';
import { sendEmail } from '../utils/sendEmail';

export interface IAuthRequestUser extends Request {
  user?: IUserDoc;
}

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (
  user: IUserDoc,
  statusCode: number,
  res: Response,
) => {
  const token = signToken(user.id!);
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
    ),
    secure: false,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  user.password = '';
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(
  async (req: IAuthRequestUser, res: Response, next: NextFunction) => {
    const { name, email, password, passwordConfirm } = req.body;
    const newUser = await UserModel.create({
      name,
      email,
      password,
      passwordConfirm,
    });
    if (!newUser) return;

    createAndSendToken(newUser, 201, res);
    next();
  },
);

export const login = catchAsync(
  async (req: Request<unknown, IUser>, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password)
      return next(new AppError('Must provide email and password', 400));
    // 2) Check if user exists && password is correct
    const user = await UserModel.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password)))
      return next(new AppError('Can not find user by the email', 401));

    // 3) if everything ok ,send token to client
    createAndSendToken(user, 200, res);
  },
);

export const protect = catchAsync(
  async (req: IAuthRequestUser, res: Response, next: NextFunction) => {
    // 1) Getting token and check of it's there
    let token: string | undefined;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token)
      return next(
        new AppError('You are not login, please log in to get access', 401),
      );

    // 2) Verification token
    const decodeToken = await promisify<string, Secret, any>(verify)(
      token,
      process.env.JWT_SECRET!,
    );
    const { id, iat } = decodeToken as { id: string; iat: number };

    // 3) Check if user still exists
    const currentUser = await UserModel.findById(id);
    if (!currentUser)
      return next(
        new AppError(
          'The user beloning to this token does no longer exists',
          401,
        ),
      );
    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(iat))
      return next(
        new AppError(
          'User recently changed password! Please log in again',
          401,
        ),
      );

    req.user = currentUser;
    next();
  },
);

export const restrictTo = (...roles: string[]) => {
  return (req: IAuthRequestUser, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user!.role!)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    return next();
  };
};

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    // 1) Get user based on POSTed email
    const user = await UserModel.findOne({ email });
    if (!user)
      return next(new AppError('There is no user with email address', 404));
    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? submit a Patch request with your new password and passwordConirm to:${resetURL}.\n 
                      If you didn't forget your password, please ignore this email!`;
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message,
      });

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!',
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(
        new AppError(
          'There was an error sending the email. Try again later',
          500,
        ),
      );
    }
  },
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get user based on the token
    const { password, passwordConfirm } = req.body;
    const { resetToken } = req.params;
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const user = await UserModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user)
      return next(new AppError('Token is invalid or has expired', 400));

    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    // 3) Update changePasswordAt property for the user

    // 4) Log the user in, send JWT
    createAndSendToken(user, 200, res);
  },
);

export const updatePassword = catchAsync(
  async (req: IAuthRequestUser, res: Response, next: NextFunction) => {
    const { password, passwordConfirm, passwordCurrent } = req.body;
    // 1) Get user from collection
    const user = await UserModel.findById(req.user!.id!).select('+password');

    // 2) Check if POSTed current password is correct
    if (!(await user!.correctPassword(passwordCurrent, user!.password))) {
      return next(new AppError('Your current password is wrong', 401));
    }
    // 3) If so, update password
    user!.password = password;
    user!.passwordConfirm = passwordConfirm;
    await user!.save();
    // User.findByIdAndUpdate will NOT work as intended

    // 4) Log user in, send JWT
    createAndSendToken(user!, 200, res);
  },
);
