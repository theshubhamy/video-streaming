import 'dotenv/config';

export const PORT: string = process.env.PORT || '';
export const PG_HOST: string = process.env.PG_HOST || '';
export const PG_PORT: string = process.env.PG_PORT || '5432';
export const PG_USER: string = process.env.PG_USER || '';
export const PG_PASSWORD: string = process.env.PG_PASSWORD || '';
export const PG_DATABASE: string = process.env.PG_DATABASE || '';
export const REDIS_URL: string = process.env.REDIS_URL || '';
export const JWT_TOKEN_SIGNING_KEY: string =
  process.env.JWT_TOKEN_SIGNING_KEY || 'JWT_TOKEN_SIGNING_KEY';
export const REFRESH_JWT_TOKEN_SIGNING_KEY: string =
  process.env.REFRESH_JWT_TOKEN_SIGNING_KEY || 'REFRESH_JWT_TOKEN_SIGNING_KEY';
