import { s3 } from '../config/s3';
import fs from 'fs';
import { S3_BUCKET } from '../config/env';

export const uploadToS3 = async (file: Express.Multer.File) => {
  const fileStream = fs.createReadStream(file.path);
  const uploadParams = {
    Bucket: S3_BUCKET!,
    Key: `raw/${file.filename}`,
    Body: fileStream,
    ContentType: file.mimetype,
  };
  return s3.upload(uploadParams).promise();
};
