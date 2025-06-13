import express, { Application } from 'express';
import cors from 'cors';
import { startConsumer } from './consumer';
const server: Application = express();
let PORT = 4000;

server.disable('x-powered-by');
server.use(cors());

server.get('/v1/health', (req, res) => {
  res.status(200).send('Server is running ... ');
});
server.use(express.urlencoded({ extended: true, limit: '1mb' }));
server.use(express.json({ limit: '1mb' }));
// IIFE Listner
(async () => {
  try {
    await startConsumer();
    server.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`),
    );
  } catch (error) {
    console.error('❌ Database Connection Failed:', error);
  }
})();

export default server;
