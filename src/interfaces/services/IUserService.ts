import { Request } from 'express';

import {
  IPartialUserDto,
  IUserAndToken,
  IUserDto,
  IUserWithoutPassword,
} from '../dtos/IUserDto';

interface IUserService {
  signup(dto: IUserDto): Promise<IUserWithoutPassword>;
  authenticate(email: string, password: string): Promise<IUserAndToken>;
  forgotPassword(email: string, req: Request): Promise<void>;
  resetPassword(token: string, password: string): Promise<void>;
  getAll(): Promise<IUserWithoutPassword[]>;
  getOne(id: string): Promise<IUserWithoutPassword>;
  update(id: string, partial: IPartialUserDto): Promise<IUserWithoutPassword>;
  delete(id: string): Promise<IUserWithoutPassword>;
}

export { IUserService };
