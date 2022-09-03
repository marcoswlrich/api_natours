import { Request } from 'express';

import { IUserWithoutPassword } from '../dtos/IUserDto';

interface IRequest extends Request {
  user: IUserWithoutPassword;
}

export { IRequest };
