import { Kafka } from 'kafkajs';
import { KAFKA_BROKER } from './env';
const kafka = new Kafka({
  clientId: 'upload-service',
  brokers: [KAFKA_BROKER!],
});

console.log('kafka', kafka.logger());

export const producer = kafka.producer();
export default kafka;
