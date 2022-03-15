import { error } from 'console';

import { ITourDto, IPartialTourDto } from '../@types/dtos/ITourDto';
import { INoCoordsError } from '../@types/errors/INoCoordsError';
import { ITour } from '../@types/models/ITour';
import { ITourService } from '../@types/services/ITourService';
import { TourModel } from '../models/tourModel';

class TourService {
  // public async getAll(query: unknown): Promise<ITour[]> {}

  public async getToursByDistance(
    distance: number,
    latlng: string,
    unit: string,
  ): Promise<ITour[]> {
    const [lat, lng] = latlng.split(',').map(c => Number(c));

    if (!lat || !lng) throw new INoCoordsError();

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    const tours = await TourModel.find()
      .where('startLocation')
      .within({ center: [lat, lng], radius, spherical: true });

    return tours;
  }

  public async getOne(id: string): Promise<ITour> {
    const tour = await TourModel.findById(id);

    if (!tour) throw new error();

    return tour;
  }
}
