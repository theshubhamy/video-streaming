import 'dotenv/config';
export const PORT = process.env.PORT || 8800;
export const UPLOAD_DIR = process.env.UPLOAD_DIR || '../../tmp-files';
export const MAX_FILE_SIZE = parseInt(
  process.env.MAX_FILE_SIZE || '10485760',
  10,
); // Default to 10MB
export const ALLOWED_FILE_TYPES = (
  process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/jpg,image/png,image/gif'
).split(',');
export const REDIS_URL =
  process.env.REDIS_URL || 'redis://default:redispassword@redis:6379/0';

export const S3_ENDPOINT = process.env.S3_ENDPOINT;
export const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
export const S3_SECRET_KEY = process.env.S3_SECRET_KEY;
export const S3_REGION = process.env.S3_REGION;
export const S3_BUCKET = process.env.S3_BUCKET;
