import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import { IUserWithoutPassword } from '../interfaces/dtos/IUserDto';

dotenv.config();

export function generateJwt(user: IUserWithoutPassword, expiresIn: string) {
  return jwt.sign(
    {
      data: user,
    },
    'natour-apiud',
    { expiresIn },
  );
}
