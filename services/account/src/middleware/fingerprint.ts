import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv } from 'uuid';
import type { Socket } from 'net';
// Extend Express Request with 'ip' and 'user'

export const generateFingerprint = (ip: string, userAgent: string) => {
  return crypto
    .createHash('sha256')
    .update(ip + userAgent)
    .digest('hex');
};

// Helper function to safely get IP
function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return (req.socket as Socket).remoteAddress || '';
}

export const fingerprintMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const ip = getClientIp(req);
    const userAgent =
      typeof req?.headers['user-agent'] === 'string'
        ? req?.headers['user-agent']
        : 'unknown';

    const deviceId = req?.user?.sessionId || uuidv();

    req.fingerprint = {
      ip,
      userAgent,
      deviceId,
    };

    next();
  } catch (error) {
    next(error);
  }
};
