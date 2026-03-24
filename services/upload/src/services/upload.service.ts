import { createS3Client, PutObjectCommand } from '@video-streaming/shared';
import { v4 as uuidv4 } from 'uuid';

const s3Client = createS3Client(
  process.env.AWS_REGION || 'us-east-1',
  process.env.AWS_ACCESS_KEY_ID || 'dummy_access',
  process.env.AWS_SECRET_ACCESS_KEY || 'dummy_secret',
  process.env.S3_ENDPOINT // optional for MinIO local
);

const BUCKET_NAME = process.env.S3_RAW_BUCKET || 'video-raw-uploads';

export const uploadToS3 = async (fileBuffer: Buffer, mimetype: string, originalName: string) => {
  const fileExtension = originalName.split('.').pop() || 'tmp';
  const fileKey = `uploads/${uuidv4()}.${fileExtension}`;
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
    Body: fileBuffer,
    ContentType: mimetype,
  });
  
  await s3Client.send(command);
  
  return {
    s3Key: fileKey,
    bucket: BUCKET_NAME
  };
};
