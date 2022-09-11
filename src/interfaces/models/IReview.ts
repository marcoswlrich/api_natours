import mongoose from 'mongoose';

export interface IReview {
  review: string;
  rating: number;
  tour: string;
  user: string;
}
export interface IReviewDoc extends mongoose.Document {
  review: string;
  rating: number;
  createdAt: Date;
  tour: string;
  user: string;
}
