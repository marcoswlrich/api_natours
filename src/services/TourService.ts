import { KeyObject } from 'crypto';
import { ObjectTyped } from 'object-typed';
import { isKeyObject } from 'util/types';

import { ITourDto, IPartialTourDto } from '../interfaces/dtos/ITourDto';
import { ITour } from '../interfaces/models/ITour';
import { ITourService } from '../interfaces/services/ITourService';
import { TourModel } from '../models/tourModel';
import { APIFeatures } from '../utils/APIFeatures';
import { CoordsError } from '../utils/errors/CoordsError';
import { NotFoundError } from '../utils/errors/NotFoundError';

class TourService implements ITourService {
  public async getAll(query: any): Promise<ITour[]> {
    // Creates mongoose query
    const features = new APIFeatures(TourModel, query)
      .filter()
      .sort()
      .select()
      .paginate();

    // Executes mongoose query
    const tours = await features.getQuery();

    return tours;
  }

  public async getToursByDistance(
    distance: number,
    latlng: string,
    unit: string,
  ): Promise<ITour[]> {
    const [lat, lng] = latlng.split(',').map(c => Number(c));

    if (!lat || !lng) throw new CoordsError();

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    const tours = await TourModel.find()
      .where('startLocation')
      .within({ center: [lat, lng], radius, spherical: true });

    return tours;
  }

  public async getOne(id: string): Promise<ITour> {
    const tour = await TourModel.findById(id);
    if (!tour) throw new NotFoundError('Tour');

    return tour;
  }

  public async create(dto: ITourDto): Promise<ITour> {
    return await TourModel.create(dto);
  }

  public async update(id: string, partial: IPartialTourDto): Promise<ITour> {
    const tour = await TourModel.findByIdAndUpdate(id, partial);

    ObjectTyped.keys(partial).forEach(key => (tour. = partial[key]));

    return tour;
  }

  public async delete(id: string): Promise<ITour> {
    return await TourModel.findByIdAndRemove(id);
  }
}

export { TourService };
