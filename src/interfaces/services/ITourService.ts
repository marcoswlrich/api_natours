import { ITourDto, IPartialTourDto } from '../dtos/ITourDto';
import { ITour } from '../models/ITour';

interface ITourService {
  getAll(query: any): Promise<ITour[]>;
  getOne(id: string): Promise<ITour>;
  create(dto: ITourDto): Promise<ITour>;
  update(id: string, partial: IPartialTourDto): Promise<ITour>;
  delete(id: string): Promise<ITour>;
  getToursByDistance(
    distance: number,
    latlng: string,
    unit: string,
  ): Promise<ITour[]>;
}

export { ITourService };
