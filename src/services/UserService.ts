import * as crypto from 'crypto';

import {
  IPartialUserDto,
  IUserAndToken,
  IUserDto,
  IUserWithoutPassword,
} from '../interfaces/dtos/IUserDto';
import { IRequest } from '../interfaces/express/IRequest';
import { IUser } from '../interfaces/models/IUser';
import { IUserService } from '../interfaces/services/IUserService';
import { UserModel } from '../models/userModel';
import { compareHash } from '../utils/compareHash';
import { createHash } from '../utils/createHash';
import { EmptyBody } from '../utils/errors/ EmptyBody';
import { NotFound } from '../utils/errors/ NotFound';
import { UserAlreadyExists } from '../utils/errors/ UserAlreadyExists';
import { EmailPasswordError } from '../utils/errors/EmailPasswordError';
import { ExpiredToken } from '../utils/errors/ExpiredToken';
import { generateJwt } from '../utils/generateJwt';
import { sendEmail } from '../utils/sendEmail';

class UserService implements IUserService {
  private JWT_EXPIRATION_TIME = '5h';

  public async signup(dto: IUserDto): Promise<IUserWithoutPassword> {
    const { email, password } = dto;

    const userAlreadyExists = await UserModel.findOne({ email });

    if (userAlreadyExists) throw new UserAlreadyExists();

    // eslint-disable-next-line no-param-reassign
    dto.password = await createHash(password);

    const user = await UserModel.create(dto);
    const userWithoutPassword = this.omitPassword(user);

    return userWithoutPassword;
  }

  public async authenticate(
    email: string,
    password: string,
  ): Promise<IUserAndToken> {
    const user = await UserModel.findOne({ email });
    if (!user) throw new EmailPasswordError();

    const match = await compareHash(password, user.password);
    if (!match) throw new EmailPasswordError();

    const userWithoutPassword = this.omitPassword(user);
    const token = generateJwt(userWithoutPassword, this.JWT_EXPIRATION_TIME);

    return { user: userWithoutPassword, token };
  }

  public async forgotPassword(email: string, req: IRequest): Promise<void> {
    const user = await UserModel.findOne({ email });
    if (!user) throw new NotFound('User');

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `
      ${req.protocol}://${req.get(
      'host',
    )}/api/v1/users/resetPassword/${resetToken}
    `;

    // email
    const subject = `${user.name}, here's is your reset-password token.`;
    const body = `Url to reset password with a PATCH request: ${resetUrl}`;

    await sendEmail({ subject, body }, user);
  }

  public async resetPassword(
    resetToken: string,
    password: string,
  ): Promise<void> {
    const hash = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await UserModel.findOne({
      passwordResetToken: hash,
    });
    if (!user) throw new NotFound('user');

    const tokenExpired = user.passwordResetExpires < new Date();
    if (tokenExpired) throw new ExpiredToken();

    user.password = await createHash(password);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    console.log('Success!');
  }

  public async getAll(): Promise<IUserWithoutPassword[]> {
    const users = await UserModel.find();

    return users.map(u => this.omitPassword(u));
  }

  public async getOne(id: string): Promise<IUserWithoutPassword> {
    const user = await UserModel.findById(id);

    if (!user) throw new NotFound('User');

    return this.omitPassword(user);
  }

  public async update(
    _id: string,
    partial: IPartialUserDto,
  ): Promise<IUserWithoutPassword> {
    if (Object.keys(partial).length < 1) throw new EmptyBody();

    if ('password' in partial) {
      partial.password = await createHash(partial.password);
    }

    const user = await UserModel.findByIdAndUpdate({ _id }, partial);

    Object.keys(partial).forEach(key => (user[key] = partial[key]));

    return this.omitPassword(user);
  }

  public async delete(id: string): Promise<IUserWithoutPassword> {
    return UserModel.findByIdAndDelete(id);
  }

  private omitPassword(user: IUser): IUserWithoutPassword {
    const { password, ...userWithoutPassword } = user._doc;

    return userWithoutPassword;
  }
}

export { UserService };
