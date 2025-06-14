import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { PORT } from './config/env';
import { connectDB } from './config/db';
import { connectRedis } from './config/redis';
import accountRoutes from './routes/index';
import { fingerprintMiddleware } from './middleware/fingerprint';
import { centralErrorHandler } from './middleware/errorHandler';

declare module 'express-serve-static-core' {
  interface Request {
    fingerprint?: {
      [key: string]: any;
    };
    user: {
      [key: string]: any;
    };
  }
}

const server: Application = express();
server.disable('x-powered-by');

server.use(cors());
// fingerprint middleware
server.use(fingerprintMiddleware);
// error Handler middleware
server.use(centralErrorHandler);

server.get('/v1/health', (req: Request, res: Response) => {
  res.status(200).send('Server is running ... ');
});
// ✅ Now safe to use express.json() for all other routes
server.use(express.urlencoded({ extended: true, limit: '1mb' }));
server.use(express.json({ limit: '1mb' }));
server.use('/v1/auth', accountRoutes);
// ✅ Connect DB and start server
(async () => {
  try {
    await connectDB();
    await connectRedis();
    server.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`),
    );
  } catch (error) {
    console.error('❌ Database Connection Failed:', error);
  }
})();
