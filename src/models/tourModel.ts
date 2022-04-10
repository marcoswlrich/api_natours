import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import slugify from 'slugify';

import { ITour } from '../interfaces/models/ITour';
// import { UserModel } from './UserModel';

const tourSchema: Schema<ITour> = new mongoose.Schema(
  {
    id: Number,
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      maxlength: [40, 'A tour mas must have a name shorter than 40 characters'],
      minlength: [10, 'A tour mas must have a name longer than 5 characters'],
    },
    duration: { type: Number, required: [true, 'A tour must have a duration'] },
    slug: String,
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a maxGroupSize'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'tour difficulty is either easy or meduim or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'rating must be grater than 1'],
      max: [5, 'rating must be less than 5'],
      set: (val: number) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: { type: Number, default: 0 },
    price: { type: Number, required: [true, 'A tour must have a price'] },
    priceDiscount: {
      type: Number,
      validate: {
        validator(val: number, price: number): boolean {
          return val < price;
        },
        message: 'price discount must be less than price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: { type: String, trim: true },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: new Date(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.index({ ratingsAverage: -1, price: 1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function (this: ITour) {
  return this.duration / 7;
});

// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// document Middeware
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre(/^find/, function (this: any, next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.pre(/^find/, function (this: any, next) {
  this.populate({
    path: 'guides',
    select: '-passwordChangedAt -__v',
  });

  next();
});

tourSchema.post('find', function (this: any, docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const TourModel = mongoose.model<ITour>('Tour', tourSchema);

export { TourModel };
