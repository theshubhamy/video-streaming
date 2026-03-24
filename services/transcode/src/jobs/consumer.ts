import { KafkaManager } from '@video-streaming/shared';
import { processVideo } from '../services/transcode.service';

const kafkaManager = new KafkaManager('transcode-service', ['localhost:9092']);

export const startConsumer = async () => {
  const consumer = kafkaManager.getConsumer('transcode-group');
  await consumer.connect();
  await consumer.subscribe({ topic: 'transcode-jobs', fromBeginning: false });

  console.log('Transcode Service: Listening for transcode-jobs...');

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        if (!message.value) return;
        const jobData = JSON.parse(message.value.toString());
        
        console.log(`Received job from Kafka:`, jobData);
        
        // 1. Process Video
        const result = await processVideo(jobData.uploadId, jobData.s3Key, jobData.originalName);

        // 2. Publish Success Event to `video-events` for the DB to pick up
        await kafkaManager.connectProducer();
        await kafkaManager.sendEvent('video-events', [{
          action: 'TRANSCODE_COMPLETE',
          uploadId: result.uploadId,
          hlsUrl: result.hlsUrl
        }]);

      } catch (err) {
        console.error('Failed to process message', err);
      }
    },
  });
};
