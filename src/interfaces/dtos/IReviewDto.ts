import { Schema } from 'mongoose';

interface IReviewDto {
  review: string;
  rating: number;
  createdAt: Date;
  tour: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
}

interface IPartialReviewDto {
  review?: string;
  rating?: number;
  createdAt?: Date;
  tour?: Schema.Types.ObjectId;
  user?: Schema.Types.ObjectId;
}

export { IReviewDto, IPartialReviewDto };
