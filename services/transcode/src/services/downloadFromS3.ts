import { s3 } from '../config/s3';
import fs from 'fs';
import { S3_BUCKET } from '../config/env';
import path from 'path';

export const downloadFromS3 = async (
  s3Key: string,
  outputPath: string,
): Promise<string> => {
  const localPath = path.join('/temp' + outputPath);
  const file = fs.createWriteStream(localPath);
  const params = {
    Bucket: S3_BUCKET!,
    Key: s3Key,
  };
  await new Promise<void>((resolve, reject) => {
    s3.getObject(params)
      .createReadStream()
      .pipe(file)
      .on('close', () => resolve())
      .on('error', () => reject());
  });

  return localPath;
};
