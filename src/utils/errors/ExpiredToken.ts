import { IBaseError } from '../../interfaces/errors/IBaseError';

class ExpiredToken extends Error implements IBaseError {
  public statusCode: number;
  public name: string;

  constructor() {
    super(`Não é possível continuar: token de redefinição expirado.`);

    this.statusCode = 401;
    this.name = 'ExpiredToken';
  }
}

export { ExpiredToken };
