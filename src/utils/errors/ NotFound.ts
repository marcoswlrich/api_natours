import { IBaseError } from '../../interfaces/errors/IBaseError';

class NotFound extends Error implements IBaseError {
  public statusCode: number;
  public name: string;

  constructor(model: string) {
    super(
      `Não foi possível encontrar ${model} que corresponda a essas condições.`,
    );

    this.statusCode = 404;
    this.name = 'NotFound';
  }
}

export { NotFound };
