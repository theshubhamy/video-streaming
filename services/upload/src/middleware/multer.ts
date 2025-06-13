import multer, { FileFilterCallback } from 'multer';
import fs from 'fs';
import path from 'path';
import { UPLOAD_DIR } from '../config/env';
import { Request } from 'express';

const uploadDir = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: any) {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req: Request, file: Express.Multer.File, cb: any) {
    const uniqueFileName = Date.now() + '-' + file.originalname;
    cb(null, uniqueFileName);
  },
});
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExt = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
  if (!allowedExt.includes(ext)) {
    return cb(new Error('Only video files are allowed'));
  }
  cb(null, true);
};

export const uploadMiddleware = multer({ storage, fileFilter });
