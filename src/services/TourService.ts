import { AppError } from '../errors/AppError';
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

  async create(dto: ITourDto): Promise<ITour> {
    const document = await TourModel.create(dto);

    return document;
  }

  public async update(id: string, partial: IPartialTourDto): Promise<any> {
    const tour = await TourModel.findByIdAndUpdate(id, partial, {
      new: true,
      runValidators: true,
    });

    if (!tour) throw new AppError(`ID (${id}) not found!`, 404);

    const modelName = TourModel.collection.collectionName;
    const data = { [`${modelName}`]: tour };

    return data;
  }

  public async delete(id: string): Promise<any> {
    const document = await TourModel.findByIdAndRemove(id);

    return document;
  }
}
export { TourService };
