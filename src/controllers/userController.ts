import { NextFunction, Request, Response } from 'express';

import { AppError } from '../errors/AppError';
import { UserModel } from '../models/userModel';
import { deleteOne, getAll, getOne, updateOne } from '../services/UserService';
import { catchAsync } from '../utils/catchAsync';
import { IAuthRequestUser } from './authController';

const filterObj = (
  obj: { [key: string]: string },
  ...allowedFileds: string[]
) => {
  const newObj: { [key: string]: string } = {};
  Object.keys(obj).forEach(el => {
    if (allowedFileds.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

export const getMe = (
  req: IAuthRequestUser,
  res: Response,
  next: NextFunction,
) => {
  req.params.id = req.user!.id!;
  next();
};

export const updateMe = catchAsync(
  async (req: IAuthRequestUser, res: Response, next: NextFunction) => {
    const { password, passwordConfirm } = req.body;
    // 1) Create error if user  POSTs password data
    if (password || passwordConfirm) {
      next(
        new AppError(
          'This route is not for password update. Please use / updateMyPassword',
          400,
        ),
      );
      return;
    }
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');

    // 3) Update user document
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user!.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({ status: 'success', data: { user: updatedUser } });
  },
);

export const deleteMe = catchAsync(
  async (req: IAuthRequestUser, res: Response, next: NextFunction) => {
    await UserModel.findByIdAndUpdate(req.user!.id, { active: false });
    res.status(204).json({
      status: 'success',
      data: null,
    });
    next();
  },
);

export const getUser = getOne(UserModel);
export const getAllUsers = getAll(UserModel);
export const updateUser = updateOne(UserModel);
export const deleteUser = deleteOne(UserModel);

export const createUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use sign up instead',
  });
};
