import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

export const createS3Client = (region: string, accessKeyId?: string, secretAccessKey?: string, endpoint?: string) => {
  return new S3Client({
    region,
    ...(accessKeyId && secretAccessKey ? { credentials: { accessKeyId, secretAccessKey } } : {}),
    ...(endpoint ? { endpoint, forcePathStyle: true } : {})
  });
};

export { PutObjectCommand, GetObjectCommand };
