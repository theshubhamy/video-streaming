import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT;
export const KAFKA_BROKER = process.env.KAFKA_BROKER;
export const S3_ENDPOINT = process.env.S3_ENDPOINT;
export const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
export const S3_SECRET_KEY = process.env.S3_SECRET_KEY;
export const S3_REGION = process.env.S3_REGION;
export const S3_BUCKET = process.env.S3_BUCKET;
