export interface Upload {
  id: string;
  s3Key: string;
  filename: string;
  size: number;
}
// Track multipart raw video uploads in DB
