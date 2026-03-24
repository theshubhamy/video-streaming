import { Router, RequestHandler } from 'express';
import multer from 'multer';
import { uploadVideoController } from '../controllers';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit for in-memory MVP
});

router.post('/upload', upload.single('video'), uploadVideoController as unknown as RequestHandler);

export default router;
