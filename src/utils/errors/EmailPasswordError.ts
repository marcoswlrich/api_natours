import { IBaseError } from '../../interfaces/errors/IBaseError';

class EmailPasswordError extends Error implements IBaseError {
  public statusCode: number;
  public name: string;

  constructor() {
    super(`Email ou senha errada`);

    this.statusCode = 404;
    this.name = 'EmailPasswordError';
  }
}

export { EmailPasswordError };
