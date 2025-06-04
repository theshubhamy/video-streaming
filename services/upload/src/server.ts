import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import { PORT } from './config/env';
const server: Application = express();
server.disable('x-powered-by');
server.use(express.urlencoded({ extended: true, limit: '1mb' }));
server.use(express.json({ limit: '1mb' }));

(async () => {
  try {
    server.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`),
    );
  } catch (error) {
    console.error('❌ Database Connection Failed:', error);
  }
})();
