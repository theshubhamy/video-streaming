import express, { Router } from 'express';
import { authMiddleware } from '../middlewere/auth';
import {
  listSessions,
  login,
  logout,
  logoutAll,
  register,
} from '../controllers/auth';
const router: Router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.post('/logout-all', authMiddleware, logoutAll);
router.get('/sessions', authMiddleware, listSessions);
export default router;
