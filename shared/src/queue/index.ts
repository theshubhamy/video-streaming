import { Kafka, Producer, Consumer } from 'kafkajs';

export class KafkaManager {
  private kafka: Kafka;
  private producer: Producer;

  constructor(clientId: string, brokers: string[]) {
    this.kafka = new Kafka({ clientId, brokers });
    this.producer = this.kafka.producer();
  }

  async connectProducer() {
    await this.producer.connect();
  }

  async sendEvent(topic: string, messages: any[]) {
    await this.producer.send({
      topic,
      messages: messages.map(msg => ({ value: JSON.stringify(msg) }))
    });
  }

  getConsumer(groupId: string): Consumer {
    return this.kafka.consumer({ groupId });
  }
}
