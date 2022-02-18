import express from 'express';
import * as fs from 'fs';

const app = express();

app.get('/', (req, res) => {
  res.send('Olá');
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'),
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tours,
    },
  });
});

const port = 4007;
app.listen(port, () => console.log(`App running on port ${port}...`));
