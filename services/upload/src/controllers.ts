import { NextFunction, Request, Response } from 'express';
import { uploadToS3 } from './services/uploadToS3';
import { sendTranscodeJob } from './services/transcodeJob';

export const uploadFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const file = req.file;
    const s3Res = await uploadToS3(file);

    const videoMeta = {
      id: `${Date.now()}`,
      userId: '123',
      s3Path: s3Res.Location,
      originalName: file.originalname,
      size: file.size,
    };

    await sendTranscodeJob(videoMeta);

    res.status(200).json({ message: 'Upload successful', video: videoMeta });
    return;
  } catch (error) {
    next(error);
    return;
  }
};
