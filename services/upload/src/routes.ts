import express, { Router } from 'express';
import { uploadMiddleware } from './middleware/multer';
import { uploadFile } from './controllers';

const router: Router = express.Router();

router.post('/upload', uploadMiddleware.single('file'), uploadFile);

export default router;
