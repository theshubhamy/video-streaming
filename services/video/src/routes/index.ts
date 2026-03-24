import { Router } from 'express';
import { getVideoMetadata } from '../controllers';

const router = Router();
router.get('/:id', getVideoMetadata);

export default router;
