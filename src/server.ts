import dotenv from 'dotenv';
import express from 'express';
import * as mongoose from 'mongoose';

dotenv.config({ path: '../config.env' });

const DB = process.env.DATABASE?.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD as string,
) as string;

mongoose
  .connect(DB)
  .then(() => console.log('DB connected successfully'))
  .catch(err => console.error(err));

const app = express();

const port = 4007;
app.listen(port, () => console.log(`App running on port ${port}...`));
