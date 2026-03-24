export interface StreamSession {
  id: string;
  videoId: string;
  userId: string;
  startTime: Date;
}
// Redis or Memory model for tracking active streams
