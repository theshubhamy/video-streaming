import { consumer } from './config/kafka';
import { handleTranscodeJOB } from './services/transcodeJobs';

export const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'transcode-jobs', fromBeginning: false });
  await consumer.run({
    eachMessage: async ({ message }) => {
      const job = JSON.parse(message.value!.toString());
      await handleTranscodeJOB(job);
    },
  });
};
