import { stringify } from 'querystring';

import { ITourDto, IPartialTourDto } from '../@types/dtos/ITourDto';
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

    if (!lat || !lng) throw new NoCoordsError();

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    const tours = await TourModel.find()
      .where('startLocation')
      .within({ center: [lat, lng], radius, spherical: true });

    return tours;
  }
}
