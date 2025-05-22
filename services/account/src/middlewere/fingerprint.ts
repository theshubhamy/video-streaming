import crypto from 'crypto';
import { NextFunction } from 'express';
import { redis } from '../config/redis';
// Extend Express Request with 'ip' and 'user'
declare module 'express-serve-static-core' {
  interface Request {
    fingerprint?: {
      ip: string;
      userAgent: string;
      deviceId: string;
    };
  }
}

export const generateFingerprint = (ip: string, userAgent: string) => {
  return crypto
    .createHash('sha256')
    .update(ip + userAgent)
    .digest('hex');
};
export const fingerprintMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const ip =
      req.headers['x-forwarded-for']?.toString().split(',')[0] ||
      req.socket.remoteAddress ||
      req.ip;

    const userAgent = req.headers['user-agent'] || 'unknown';

    // Example: use sessionId or userId or fallback to generate a new one
    const deviceId = req.user?.sessionId || uuidv4();

    req.fingerprint = {
      ip,
      userAgent,
      deviceId,
    };

    next();
  } catch (error) {
    console.error('Error in fingerprint middleware:', error);
    res.sendStatus(500);
    return;
  }
};
