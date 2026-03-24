import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { processEmailQueue } from './jobs/email.job';

const app: Application = express();
app.disable('x-powered-by');

app.use(cors());
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));

app.get('/v1/health', (req: Request, res: Response) => {
  res.status(200).send('notification service is running ...');
});

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await processEmailQueue();
    app.listen(PORT, () => {
      console.log(`✅ notification service running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start notification service:', err);
  }
})();
