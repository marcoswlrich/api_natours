import mongoose, { Query } from 'mongoose';

import { IReview, IReviewDoc } from '../interfaces/models/IReview';
import { TourModel } from './tourModel';

const Schema = mongoose.Schema;

export interface IReviewQuery extends Query<IReviewDoc, IReviewDoc> {
  r?: IReviewDoc;
}

interface IReviewModel extends mongoose.Model<IReviewDoc> {
  build(attrs: IReview): IReviewDoc;
  calcAverageRatings(tourId: string): void;
}

const reviewSchema = new Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
      maxLength: [300, 'Max-length allowed to review is 300 characters'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'A review must have rating'],
      set: (val: number) => Math.round(val * 10) / 10,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must belong a tour'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong a User'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre<Query<IReviewDoc[], IReviewDoc>>(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next(null);
});

reviewSchema.statics.calcAverageRatings = async function (tourId: number) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  await TourModel.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0]?.nRatings || 0,
    ratingsAverage: stats[0]?.avgRating || 0,
  });
};

reviewSchema.post('save', async function () {
  await (this.constructor as Record<string, any>).calcAverageRatings(this.tour);
});

reviewSchema.pre<IReviewQuery>(/^findOneAnd/, async function (next) {
  this.r = (await this.findOne()) || undefined;
  next(null);
});

reviewSchema.post<IReviewQuery>(/^findOneAnd/, async function () {
  // await this.findOne(); doesn't work here, query has already executed
  await (this as Record<string, any>).r.constructor.calcAverageRatings(
    (this as Record<string, any>).r.tour,
  );
});

export const ReviewModel = mongoose.model<IReviewDoc, IReviewModel>(
  'Review',
  reviewSchema,
);
