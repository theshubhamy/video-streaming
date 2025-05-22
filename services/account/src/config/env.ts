import 'dotenv/config';

export const NODE_ENV: string = process.env.NODE_ENV || 'DEV';
export const PORT: string = process.env.PORT || '';
export const PG_HOST: string = process.env.PG_HOST || '';
export const PG_PORT: string = process.env.PG_PORT || '5432';
export const PG_USER: string = process.env.PG_USER || '';
export const PG_PASSWORD: string = process.env.PG_PASSWORD || '';
export const PG_DATABASE: string = process.env.PG_DATABASE || '';
export const REDIS_HOST: string = process.env.REDIS_HOST || '';
export const REDIS_PORT: string = process.env.REDIS_PORT || '';
export const JWT_TOKEN_SIGNING_KEY: string =
  process.env.JWT_TOKEN_SIGNING_KEY || 'JWT_TOKEN_SIGNING_KEY';
export const REFRESH_JWT_TOKEN_SIGNING_KEY: string =
  process.env.REFRESH_JWT_TOKEN_SIGNING_KEY || 'REFRESH_JWT_TOKEN_SIGNING_KEY';
export const ACCESS_TOKEN_EXPIRY: string =
  process.env.ACCESS_TOKEN_EXPIRY || '12h';
export const REFRESH_TOKEN_EXPIRY: string =
  process.env.REFRESH_TOKEN_EXPIRY || '24h';
