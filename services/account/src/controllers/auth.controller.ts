import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const user = await userService.register(email, password);
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const result = await userService.login(email, password);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    // Assuming a middleware extracted the user ID from JWT into req.user
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const profile = await userService.getProfile(userId);
    res.status(200).json({ profile });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
