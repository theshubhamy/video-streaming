import { s3 } from '../config/s3';
import fs from 'fs';
import { S3_BUCKET } from '../config/env';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export const uploadToS3 = async (filePath: string, s3Key: string) => {
  const fileContent = fs.readFileSync(filePath);
  const uploadParams = {
    Bucket: S3_BUCKET!,
    Key: s3Key,
    Body: fileContent,
    ACL: 'public-read',
    ContentType: 'video/mp4',
  };

  const command = new PutObjectCommand(uploadParams);
  const result = await s3.send(command);

  return {
    Location: `https://${S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${s3Key}`,
    ...result,
  };
};
