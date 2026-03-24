import { Pool } from 'pg';
const { PG_HOST, PG_DATABASE, PG_PASSWORD, PG_PORT, PG_USER } = process.env;

const pool = new Pool({
  user: PG_USER,
  host: PG_HOST,
  database: PG_DATABASE,
  password: PG_PASSWORD,
  port: parseInt(PG_PORT || '5432', 10),
});

export const initVideoDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS videos (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      upload_id VARCHAR(255) UNIQUE NOT NULL,
      title VARCHAR(255),
      creator_id UUID,
      duration INT DEFAULT 0,
      thumbnail_url TEXT,
      hls_url TEXT,
      status VARCHAR(50) DEFAULT 'PROCESSING',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('Video Postgres DB ready.');
};

export const updateVideoStatus = async (uploadId: string, hlsUrl: string) => {
  await pool.query(
    'UPDATE videos SET status = $1, hls_url = $2 WHERE upload_id = $3',
    ['COMPLETED', hlsUrl, uploadId]
  );
};

export default pool;
