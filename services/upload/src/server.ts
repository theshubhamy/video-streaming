import express, { Application } from 'express';
import cors from 'cors';
import { PORT } from './config/env';
import { connectRedis } from './config/redis';
const server: Application = express();
server.disable('x-powered-by');
server.use(cors());

server.get('/v1/health', (req, res) => {
  res.status(200).send('Server is running ... ');
});
server.use(express.urlencoded({ extended: true, limit: '1mb' }));
server.use(express.json({ limit: '1mb' }));
server.use('/v1/upload', (req, res) => {
  res.status(200).send('Upload service is running ... ');
});
(async () => {
  try {
    await connectRedis();
    server.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`),
    );
  } catch (error) {
    console.error('❌ Database Connection Failed:', error);
  }
})();
export default server;
