import express, { Request, Response } from 'express';
import morgan from 'morgan';

import { AppError } from './errors/AppError';
import { tourRouter } from './routes/tourRoutes';
import { userRouter } from './routes/userRoutes';

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan<Request, Response>('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, _res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on server`, 404));
});

export { app };
