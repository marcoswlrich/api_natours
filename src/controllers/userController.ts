import { NextFunction, Request, Response } from 'express';

import { UserModel } from '../models/userModel';
import { deleteOne, getAll, getOne, updateOne } from '../services/UserService';

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
