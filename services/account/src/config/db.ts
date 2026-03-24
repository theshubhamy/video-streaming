import { Pool } from 'pg';
import { PG_HOST, PG_DATABASE, PG_PASSWORD, PG_PORT, PG_USER } from './env';

// Database connection configuration
const dbConfig = {
  user: PG_USER,
  host: PG_HOST,
  database: PG_DATABASE,
  password: PG_PASSWORD,
  port: parseInt(PG_PORT, 10),
};

// Create a new PostgreSQL client
const client = new Pool(dbConfig);

client.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});
// Connect to the database
const connectDB = async () =>
  await client
    .connect()
    .then(async () => {
      console.log('Connected to PostgreSQL database!');
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Users table initialized.');
    })
    .catch(err => {
      console.error('Error connecting PostgreSQL:', err);
    });
export { client, connectDB };
