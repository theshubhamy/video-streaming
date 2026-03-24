import { NextFunction, Request, Response } from 'express';
import { uploadToS3 } from './services/uploadToS3';
import { sendTranscodeJob } from './services/transcodeJob';
import { v4 as uuidv } from 'uuid';
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
    const s3Key: string = `raw/${Date.now()}_${file.originalname}`;
    const s3Res = await uploadToS3(file, s3Key);

    const videoMeta = {
      id: uuidv(),
      userId: uuidv(),
      s3Res: s3Res,
      video: file,
    };

    await sendTranscodeJob(videoMeta);

    res.status(200).json({ message: 'Upload successful', videoMeta });
    return;
  } catch (error) {
    next(error);
    return;
  }
};
