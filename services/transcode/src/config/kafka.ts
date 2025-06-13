import { Kafka } from 'kafkajs';
import { KAFKA_BROKER } from './env';
const kafka = new Kafka({
  clientId: 'transcode-service',
  brokers: [KAFKA_BROKER!],
});

export const consumer = kafka.consumer({ groupId: 'transcode-group' });
export const producer = kafka.producer();

export default kafka;
