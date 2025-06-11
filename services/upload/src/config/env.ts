import 'dotenv/config';
export const PORT = process.env.PORT || 4001;
export const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
export const MAX_FILE_SIZE = parseInt(
  process.env.MAX_FILE_SIZE || '10485760',
  10,
); // Default to 10MB
export const ALLOWED_FILE_TYPES = (
  process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/jpg,image/png,image/gif'
).split(',');
export const REDIS_URL =
  process.env.REDIS_URL || 'redis://default:redispassword@redis:6379/0';
