import { KafkaManager } from '@video-streaming/shared';

const kafkaManager = new KafkaManager('upload-service', ['localhost:9092']);

export const initKafka = async () => {
  await kafkaManager.connectProducer();
  console.log('Upload Service: Kafka Producer connected');
};

export const emitTranscodeJob = async (uploadId: string, s3Key: string, bucket: string, originalName: string) => {
  const event = {
    eventId: Date.now().toString(),
    uploadId,
    s3Key,
    bucket,
    originalName,
    timestamp: new Date().toISOString()
  };
  
  await kafkaManager.sendEvent('transcode-jobs', [event]);
  console.log(`Kafka event emitted to transcode-jobs for uploadId: ${uploadId}`);
};
