import { Router, RequestHandler } from 'express';
import { register, login, getProfile } from '../controllers/auth.controller';
import { verifyToken } from '@video-streaming/shared';

const router = Router();

// Middleware to protect routes
const authMiddleware = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_TOKEN_SIGNING_KEY || 'your_jwt_secret_key';
  
  const payload = verifyToken(token, secret);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  req.user = payload;
  next();
};

router.post('/register', register as unknown as RequestHandler);
router.post('/login', login as unknown as RequestHandler);
router.get('/profile', authMiddleware, getProfile as unknown as RequestHandler);

export default router;
