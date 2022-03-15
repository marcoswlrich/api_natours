import { IBaseError } from './IBaseError';

class IFoundError extends Error implements IBaseError {
  public statusCode: number;
  public name: string;

  constructor(model: string) {
    super(
      `Não foi possível encontrar nenhum ${model} que corresponda a essas condições `,
    );

    this.statusCode = 404;
    this.name = 'Não encontrado';
  }
}

export { IFoundError };
