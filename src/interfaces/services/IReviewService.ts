import { Schema } from 'mongoose';

import { IReviewDto, IPartialReviewDto } from '../dtos/IReviewDto';
import { IReview } from '../models/IReview';

export interface IReviewService {
  getAll(filter: { tour?: Schema.Types.ObjectId }): Promise<IReview[]>;
  getOne(id: string): Promise<IReview>;
  create(dto: IReviewDto): Promise<IReview>;
  update(id: string, partial: IPartialReviewDto): Promise<IReview>;
  delete(id: string): Promise<IReview>;
}
