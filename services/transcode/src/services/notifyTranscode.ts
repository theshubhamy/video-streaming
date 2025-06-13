import { producer } from '../config/kafka';

export const notifyTranscodeComplete = async (payload: any) => {
  await producer.connect();
  await producer.send({
    topic: 'transcode-status',
    messages: [{ key: payload.id, value: JSON.stringify(payload) }],
  });
  await producer.disconnect();
};
