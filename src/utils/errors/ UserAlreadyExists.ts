import { IBaseError } from '../../interfaces/errors/IBaseError';

class UserAlreadyExists extends Error implements IBaseError {
  public statusCode: number;
  public name: string;

  constructor() {
    super(`Já existe um usuário com este e-mail!`);

    this.statusCode = 422;
    this.name = 'UserAlreadyExists';
  }
}

export { UserAlreadyExists };
