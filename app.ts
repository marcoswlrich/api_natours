import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';

import tourRouter from './routes/tourRoutes';
import userRouter from './routes/userRoutes';

const app: Application = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

export default app;
