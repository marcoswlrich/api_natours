import express from 'express';
import * as fs from 'fs';

const app = express();

app.use(express.json());

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

app.get('/api/v1/tours/:id', (req, res) => {
  const { id } = req.params;
  const tour = tours.find(tour => tour.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'error',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tours,
    },
  });
  return res.status(201);
});

app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    sucess => {
      res.status(201).json({
        status: 'sucess',
        data: {
          tour: newTour,
        },
      });
    },
  );
});

app.patch('/api/v1/tours/:id', (req, res) => {
  const { id } = req.params;

  if (id > tours.length) {
    return res.status(404).json({
      status: 'error',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'sucess',
    data: {
      tour: '<Updated tour here...>',
    },
  });
  return res.status(201);
});

const port = 4007;
app.listen(port, () => console.log(`App running on port ${port}...`));
