import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import { PORT } from './config/env';
import { connectDB } from './config/db';
import { connectRedis, redis } from './config/redis';
const server: Application = express();
server.disable('x-powered-by');

server.get('/', (req: Request, res: Response) => {
  res.status(200).send('Server is running ... ');
});

// ✅ Connect DB and start server
(async () => {
  try {
    await connectDB;
    await connectRedis;
    server.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`),
    );
  } catch (error) {
    console.error('❌ Database Connection Failed:', error);
  }
})();
