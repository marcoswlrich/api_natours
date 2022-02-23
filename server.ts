import dotenv from 'dotenv';
import express from 'express';

const app = express();

dotenv.config({ path: '.config.env' });
const port = 4007;
app.listen(port, () => console.log(`App running on port ${port}...`));
