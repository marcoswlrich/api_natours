import * as dotenv from 'dotenv';

dotenv.config();

const MONGO_DB_USER = process.env.MONGO_DB_USER || '';
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '';
const DATABASE_URL = `mongodb+srv://${MONGO_DB_USER}:${DATABASE_PASSWORD}@cluster0.ocgedpp.mongodb.net/?retryWrites=true&w=majority`;

const SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 4007;

export const config = {
  mongo: {
    username: MONGO_DB_USER,
    password: DATABASE_PASSWORD,
    url: DATABASE_URL,
  },
  server: {
    port: SERVER_PORT,
  },
};
