import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_TOKEN_SIGNING_KEY } from '../config/env';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.sendStatus(401);
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_TOKEN_SIGNING_KEY) as any;
    req.user = {
      userId: decoded.id,
      sessionId: decoded.sessionId,
    };
    next();
  } catch (err) {
    res.sendStatus(500);
    return;
  }
};
