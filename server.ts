import dotenv from 'dotenv';

import app from './app';

dotenv.config({ path: '.config.env' });
const port = 4007;
app.listen(port, () => console.log(`App running on port ${port}...`));
