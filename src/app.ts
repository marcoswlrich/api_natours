import express, { Request, Response, NextFunction } from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';

import { globalErrorHandler } from './controllers/errorController';
import { AppError } from './errors/AppError';
import { tourRouter } from './routes/tourRoutes';
import { userRouter } from './routes/userRoutes';

const app = express();

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan<Request, Response>('dev'));
}

const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this Ip, please try again in an hour!',
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));

app.use(mongoSanitize());

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'maxGroupSize',
      'price',
      'ratingsAverage',
      'difficulty',
    ],
  }),
);

app.use(express.static(`${__dirname}/public`));

app.use(
  (
    req: Request<
      Record<string, never>,
      Record<string, never>,
      { requestTime: string }
    >,
    res: Response,
    next: NextFunction,
  ) => {
    req.body.requestTime = new Date().toISOString();
    // console.log(req.cookies);
    next();
  },
);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export { app };
