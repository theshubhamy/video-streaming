import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import routes from './routes/index';
import { initVideoDB } from './models/video.model';
import { initVideoEvents } from './jobs/index';

const app: Application = express();
app.disable('x-powered-by');

app.use(cors());
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));

app.get('/v1/health', (req: Request, res: Response) => {
  res.status(200).send('video service is running ...');
});

// Mount video API
app.use('/v1/api', routes);

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await initVideoDB();
    await initVideoEvents();
    app.listen(PORT, () => {
      console.log(`✅ video running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start video service:', err);
  }
})();
