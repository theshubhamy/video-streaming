export interface TranscodeJob {
  id: string;
  videoId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: number;
}
