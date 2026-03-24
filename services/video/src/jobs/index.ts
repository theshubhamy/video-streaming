import { KafkaManager } from '@video-streaming/shared';
import { updateVideoStatus } from '../models/video.model';

const kafkaManager = new KafkaManager('video-service', ['localhost:9092']);

export const initVideoEvents = async () => {
  const consumer = kafkaManager.getConsumer('video-group');
  await consumer.connect();
  await consumer.subscribe({ topic: 'video-events', fromBeginning: false });

  console.log('Video Service: Listening for video-events...');

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        if (!message.value) return;
        const msg = JSON.parse(message.value.toString());
        
        if (msg.action === 'TRANSCODE_COMPLETE') {
          console.log(`[DB] Updating status for uploadId ${msg.uploadId} to COMPLETED`);
          await updateVideoStatus(msg.uploadId, msg.hlsUrl);
        }
      } catch (err) {
        console.error('Failed to process video-events message', err);
      }
    },
  });
};
