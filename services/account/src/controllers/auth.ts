import { Request, Response, NextFunction } from 'express';
import { CreateUser, findOneUser } from '../repositories';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { redis } from '../config/redis';
import {
  JWT_TOKEN_SIGNING_KEY,
  REFRESH_JWT_TOKEN_SIGNING_KEY,
} from '../config/env';
import { generateFingerprint } from '../middlewere/fingerprint';

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { emailorPhone, password } = req.body;
    let existingUser;
    if (emailorPhone?.includes('@')) {
      existingUser = await findOneUser('email', emailorPhone);
    } else {
      existingUser = await findOneUser('phone', emailorPhone);
    }
    if (!existingUser) {
      res.status(404).json('User not found.');
    }
    let isVaidPassword = await bcrypt.compare(
      password,
      existingUser?.password_hash,
    );
    if (!isVaidPassword) {
      res.status(403).json('Invalid Credentials.');
    }
    let sessionId = uuidv4();
    let accessToken = jwt.sign(
      { id: existingUser.id, sessionId },
      JWT_TOKEN_SIGNING_KEY,
      {
        expiresIn: '12h',
      },
    );
    let refreshToken = jwt.sign(
      { id: existingUser.id, sessionId },
      REFRESH_JWT_TOKEN_SIGNING_KEY,
      {
        expiresIn: '24h',
      },
    );
    const fingerprint = generateFingerprint(
      req.ip as string,
      req.headers['user-agent'] || '',
    );

    const sessionData = {
      userId: existingUser.id,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      fingerprint,
      createdAt: Date.now(),
    };

    await redis.set(`session:${sessionId}`, JSON.stringify(sessionData), {
      EX: 7 * 86400,
    });
    await redis.sAdd(`user-sessions:${existingUser.id}`, sessionId);

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, phone, password } = req.body;
    const existingUser = await findOneUser('email', email);
    if (existingUser) {
      res.status(401).json('User Alredy exist.');
    }
    const hashedPassowrd = await bcrypt.hash(password, 10);

    await CreateUser({ email, phone, password_hash: hashedPassowrd });
    res.status(201).json({
      success: true,
      message: 'Profile created successfully.',
    });
  } catch (error) {
    next(error);
  }
};
export const logout = async (req: Request, res: Response) => {
  const { sessionId, userId } = req.user;

  await redis.del(`session:${sessionId}`);
  await redis.sRem(`user-sessions:${userId}`, sessionId);

  res.json({ message: 'Logged out successfully.' });
};
export const logoutAll = async (req: Request, res: Response) => {
  const { userId } = req.user;

  const sessions = await redis.sMembers(`user-sessions:${userId}`);
  const pipeline = redis.multi();
  sessions.forEach(sessionId => {
    pipeline.del(`session:${sessionId}`);
  });
  pipeline.del(`user-sessions:${userId}`);
  await pipeline.exec();

  res.json({ message: 'Logged out from all devices.' });
};
export const listSessions = async (req: Request, res: Response) => {
  const { userId } = req?.user;

  const sessionIds = await redis.sMembers(`user-sessions:${userId}`);
  const sessions = await Promise.all(
    sessionIds.map(id =>
      redis
        .get(`session:${id}`)
        .then(data => ({ id, ...JSON.parse(data || '{}') })),
    ),
  );

  res.status(200).json(sessions);
};
