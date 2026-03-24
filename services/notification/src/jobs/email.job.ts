import { KafkaManager } from '@video-streaming/shared';

const kafkaManager = new KafkaManager('notification-service', ['localhost:9092']);

export const processEmailQueue = async () => {
  const consumer = kafkaManager.getConsumer('notification-group');
  await consumer.connect();
  await consumer.subscribe({ topic: 'video-events', fromBeginning: false });

  console.log('Notification Service: Listening for video-events to send emails...');

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        if (!message.value) return;
        const msg = JSON.parse(message.value.toString());
        
        if (msg.action === 'TRANSCODE_COMPLETE') {
          // Mock sending email
          console.log(`[Nodemailer] Sending email: "Your video (${msg.uploadId}) has finished processing and is ready to view!"`);
        }
      } catch (err) {
        console.error('Failed to process video-events for email dispatch', err);
      }
    },
  });
};
