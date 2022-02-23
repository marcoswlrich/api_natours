import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
// app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRouter);

export { app };
