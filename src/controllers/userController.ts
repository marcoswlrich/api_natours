import { UserModel } from '../models/userModel';
import { deleteOne, getAll, getOne, updateOne } from '../services/UserService';

export const getUser = getOne(UserModel);
export const getAllUsers = getAll(UserModel);
export const updateUser = updateOne(UserModel);
export const deleteUser = deleteOne(UserModel);
