import { Schema } from 'mongoose';

import { Location, LocationAndDay } from '../models/ITour';

interface ITourDto {
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  price: number;
  priceDiscount?: number;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  createdAt?: Date;
  startDates?: Date[];
  secretTour?: boolean;
  startLocation: Location;
  locations: LocationAndDay[];
  guides: Array<Schema.Types.ObjectId>;
}

interface IPartialTourDto {
  name?: string;
  duration?: number;
  maxGroupSize?: number;
  difficulty?: string;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  price?: number;
  priceDiscount?: number;
  summary?: string;
  description?: string;
  imageCover?: string;
  images?: string[];
  createdAt?: Date;
  startDates?: Date[];
  secretTour?: boolean;
  startLocation?: Location;
  locations?: LocationAndDay[];
  guides?: Array<Schema.Types.ObjectId>;
}

export { ITourDto, IPartialTourDto };