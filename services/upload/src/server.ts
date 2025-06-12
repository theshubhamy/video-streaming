import express, { Application } from 'express';
import cors from 'cors';
import { PORT } from './config/env';
import routes from './routes';
import { centralErrorHandler } from './middleware/errorHandler';
// import { connectRedis } from './config/redis';
const server: Application = express();
server.disable('x-powered-by');
server.use(cors());
server.use(centralErrorHandler);
server.get('/v1/health', (req, res) => {
  res.status(200).send('Server is running ... ');
});
server.use(express.urlencoded({ extended: true, limit: '1mb' }));
server.use(express.json({ limit: '1mb' }));
server.use('/v1/api', routes);
(async () => {
  try {
    // await connectRedis();
    server.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`),
    );
  } catch (error) {
    console.error('❌ Database Connection Failed:', error);
  }
})();
export default server;
