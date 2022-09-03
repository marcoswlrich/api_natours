import { IBaseError } from '../../interfaces/errors/IBaseError';

class EmptyBody extends Error implements IBaseError {
  public statusCode: number;
  public name: string;

  constructor() {
    super(`Não é possível continuar: o corpo da solicitação está vazio`);

    this.statusCode = 400;
    this.name = 'EmptyBody';
  }
}

export { EmptyBody };
