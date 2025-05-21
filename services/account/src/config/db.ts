import { Client } from 'pg';
import { PG_HOST, PG_DATABASE, PG_PASSWORD, PG_PORT, PG_USER } from './env';

// Database connection configuration
const dbConfig = {
  user: PG_USER,
  host: PG_HOST,
  database: PG_DATABASE,
  password: PG_PASSWORD,
  port: Number(PG_PORT),
};

// Create a new PostgreSQL client
const client = new Client(dbConfig);

// Connect to the database
export const connectDB = client
  .connect()
  .then(() => {
    console.log('Connected to PostgreSQL database!');
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });
