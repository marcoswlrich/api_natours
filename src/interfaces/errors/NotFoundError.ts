import { IBaseError } from './IBaseError';

// Erro nao encontrado
class NotFoundError extends Error implements IBaseError {
  public statusCode: number;
  public name: string;

  constructor(model: string) {
    super(
      `Não foi possível encontrar nenhum ${model} que corresponda a essas condições.`,
    );
  }
}
