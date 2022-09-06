import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';

import { globalErrorHandler } from './controllers/errorController';
import { AppError } from './errors/AppError';
import { tourRouter } from './routes/tourRoutes';
import { userRouter } from './routes/userRoutes';

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan<Request, Response>('dev'));
}

app.use(express.json());
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
