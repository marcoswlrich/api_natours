// import * as dotenv from 'dotenv';
import mongoose, { Error } from 'mongoose';

import { app } from './app';
import { config } from './config';

process.on('uncaughtException', (err: Error) => {
  console.log('UNHANDLED EXPECTION! 💥 Shutting down');
  console.log(err.name, err.message);

  process.exit(1);
});

// dotenv.config({ path: '../config.env' });

mongoose
  .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
  .then(() => {
    console.log('MongoDB Connection successfull');
  })
  .catch(error => console.log(error));

const port = process.env.PORT || 4007;

const server = app.listen(port, () =>
  console.log(`App running on port ${port}...`),
);

process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
