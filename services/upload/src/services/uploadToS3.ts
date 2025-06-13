import { s3 } from '../config/s3';
import { S3_BUCKET } from '../config/env';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
export const uploadToS3 = async (file: Express.Multer.File, s3Key: string) => {
  const fileStream = fs.createReadStream(file.path);
  const uploadParams = {
    Bucket: S3_BUCKET!,
    Key: s3Key,
    Body: fileStream,
    ContentType: file.mimetype,
  };
  const command = new PutObjectCommand(uploadParams);
  const result = await s3.send(command);
  return result;
};
