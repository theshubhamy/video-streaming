import { downloadFromS3 } from './downloadFromS3';
import ffmpeg from 'fluent-ffmpeg';
import { uploadToS3 } from './uploadToS3';
import fs from 'fs/promises';
import { notifyTranscodeComplete } from './notifyTranscode';
export const handleTranscodeJOB = async (job: any) => {
  const { id, s3Path, userId } = job;
  try {
    const inputFilePath = await downloadFromS3(s3Path, `${id}-original.mp4`);
    const resolutions = [1080, 720, 480, 360];
    const outputs: any[] = [];
    for (const res of resolutions) {
      const outputPath = `/tmp/${id}-${res}p.mp4`;
      await new Promise((resolve, reject) => {
        ffmpeg(inputFilePath)
          .videoCodec('libx264')
          .size(`?x${res}`)
          .output(outputPath)
          .on('end', resolve)
          .on('error', reject)
          .run();
      });
      const uploaded = await uploadToS3(
        outputPath,
        `transcoded/${id}/${res}p.mp4`,
      );
      outputs.push({ resolution: res, url: uploaded.Location });

      await fs.unlink(outputPath);
    }
    await notifyTranscodeComplete({ id, userId, status: 'success', outputs });
  } catch (error) {
    console.error('Transcoding failed:', error);
    await notifyTranscodeComplete({
      id,
      userId,
      status: 'failed',
      error: error,
    });
  }
};
