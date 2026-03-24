import { client } from '../config/db';
import bcrypt from 'bcryptjs';
import { generateToken } from '@video-streaming/shared';

export class UserService {
  async register(email: string, passwordRaw: string) {
    const existing = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rowCount && existing.rowCount > 0) throw new Error('User already exists');
    
    const passwordHash = await bcrypt.hash(passwordRaw, 10);
    const result = await client.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, passwordHash]
    );
    const user = result.rows[0];
    return { id: user.id, email: user.email };
  }

  async login(email: string, passwordRaw: string) {
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (!result.rowCount || result.rowCount === 0) throw new Error('Invalid credentials');
    
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(passwordRaw, user.password_hash);
    if (!isMatch) throw new Error('Invalid credentials');
    
    const secret = process.env.JWT_TOKEN_SIGNING_KEY || 'your_jwt_secret_key';
    const token = generateToken({ id: user.id, email: user.email }, secret, '24h');
    
    return { token, user: { id: user.id, email: user.email } };
  }

  async getProfile(userId: string) {
    const result = await client.query('SELECT id, email, created_at as "createdAt" FROM users WHERE id = $1', [userId]);
    if (!result.rowCount || result.rowCount === 0) return null;
    return result.rows[0];
  }
}
