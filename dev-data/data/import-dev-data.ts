import { readFileSync } from 'fs';
import mongoose from 'mongoose';

import { config } from '../../src/config';
import { TourModel } from '../../src/models/tourModel';

// const port = process.env.PORT || 4007;

mongoose
  .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
  .then(() => {
    console.log('MongoDB Connection successfull');
  })
  .catch(error => console.log(error));

const tours = JSON.parse(readFileSync(`${__dirname}/tours.json`, 'utf-8'));

const importData = async () => {
  try {
    await TourModel.create(tours);

    console.log('Data successful created');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await TourModel.deleteMany({});

    console.log('Data successful delete');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
