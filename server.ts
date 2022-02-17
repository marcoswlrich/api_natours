import express from 'express';

const app = express();

const port = 4007;
app.listen(port, () => console.log(`App running on port ${port}...`));
