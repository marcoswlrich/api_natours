import { Router } from 'express';

import { protect, restrictTo } from '../controllers/authController';
import {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourUserId,
  getReview,
} from '../controllers/reviewController';

const reviewRouter = Router({ mergeParams: true });

reviewRouter.use(protect);
reviewRouter
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), setTourUserId, createReview);

reviewRouter
  .route('/:id')
  .delete(restrictTo('user', 'admin'), deleteReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .get(getReview);

export { reviewRouter };
