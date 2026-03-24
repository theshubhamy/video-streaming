import { Request, Response } from 'express';
import { uploadToS3 } from '../services/upload.service';
import { emitTranscodeJob } from '../jobs';

export const uploadVideoController = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }
    
    // In production, handling huge files in memory is bad. Multer usually uses disk or streams to S3 directly via multer-s3.
    // For MVp, memory buffer is acceptable up to a certain limit.
    const file = req.file;
    
    // 1. Upload to S3
    const { s3Key, bucket } = await uploadToS3(file.buffer, file.mimetype, file.originalname);
    
    const uploadId = s3Key.split('/')[1].split('.')[0]; // extracting uuid from uploads/uuid.mp4
    
    // 2. Publish Kafka Event
    await emitTranscodeJob(uploadId, s3Key, bucket, file.originalname);
    
    res.status(202).json({
      message: 'Upload successful, queued for processing',
      uploadId,
      s3Key
    });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload video' });
  }
};
