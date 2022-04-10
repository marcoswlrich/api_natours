// Erros de coordenadas

import { IBaseError } from './IBaseError';

class CoordsError extends Error implements IBaseError {
  public statusCode: number;
  public name: string;

  constructor() {
    super('Não são fornecidas coordenadas de latitude e longitude');

    this.statusCode = 400;
    this.name = 'NoCoords';
  }
}

export { CoordsError };
