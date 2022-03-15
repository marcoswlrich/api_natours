import { IBaseError } from './IBaseError';

class INoCoordsError extends Error implements IBaseError {
  public statusCode: number;
  public name: string;

  constructor() {
    super('Não são fornecidas coordenadas de latitude e longitude');

    this.statusCode = 400;
    this.name = 'Sem Coordenadas';
  }
}

export { INoCoordsError };
