import mongoose from 'mongoose';

export interface ITour {
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  slug?: string;
  priceDiscount: number;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  startDates: Date[];
  secretTour: boolean;
  startLocation?: {
    type: string;
    description: string;
    coordinates: [number];
    address: string;
  };
  location?: [
    {
      type: string;
      coordinates: [number];
      address: string;
      description: string;
      day: number;
    },
  ];
}

export interface ITourDoc extends mongoose.Document {
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  slug?: string;
  priceDiscount: number;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  startDates: Date[];
  secretTour: boolean;
  startLocation?: {
    type: string;
    description: string;
    coordinates: [number];
    address: string;
  };
  location?: [
    {
      type: string;
      coordinates: [number];
      address: string;
      description: string;
      day: number;
    },
  ];
}
