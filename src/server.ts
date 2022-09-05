// import * as dotenv from 'dotenv';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { app } from './app';
import { config } from './config';

// dotenv.config({ path: '../config.env' });

mongoose
  .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
  .then(() => {
    console.log('Sucess');
  })
  .catch(error => console.log(error));

const port = process.env.PORT || 4007;

app.listen(port, () => console.log(`App running on port ${port}...`));
