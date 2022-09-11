import { NextFunction, Response } from 'express';

import { ReviewModel } from '../models/reviewModel';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from '../services/UserService';
import { IAuthRequestUser } from './authController';

export const setTourUserId = (
  req: IAuthRequestUser,
  res: Response,
  next: NextFunction,
) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user!.id;
  next();
};

export const getAllReviews = getAll(ReviewModel);
export const getReview = getOne(ReviewModel);
export const createReview = createOne(ReviewModel);
export const deleteReview = deleteOne(ReviewModel);
export const updateReview = updateOne(ReviewModel);
