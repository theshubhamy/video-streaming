import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { UPLOAD_DIR } from '../config/env';

const uploadDir = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueFileName = Date.now() + '-' + file.originalname;
    cb(null, uniqueFileName);
  },
});

export const uploadMiddleware = multer({ storage: storage });
