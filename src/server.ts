import dotenv from 'dotenv';
import * as mongoose from 'mongoose';

import { app } from './app';

dotenv.config({ path: '../config.env' });

const DB = process.env.DATABASE?.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD as string,
) as string;

mongoose
  .connect(DB)
  .then(() => console.log('DB connected successfully'))
  .catch(err => console.error(err));

const port = process.env.PORT || 4007;

app.listen(port, () => console.log(`App running on port ${port}...`));
