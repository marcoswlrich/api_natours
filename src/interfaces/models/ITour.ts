import { Schema, Document } from 'mongoose';

type Location = {
  type: string;
  coordinates: number[];
  address: string;
  description: string;
};

type LocationAndDay = {
  type: string;
  coordinates: number[];
  address: string;
  description: string;
  day: number;
};

interface ITour extends Document {
  id: number;
  name: string;
  duration: number;
  slug: string;
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

export { Location, LocationAndDay, ITour };
