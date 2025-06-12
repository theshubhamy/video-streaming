import { producer } from '../config/kafka';
export const sendTranscodeJob = async (videoMeta: any) => {
  await producer.connect();
  await producer.send({
    topic: 'transcode-jobs',
    messages: [{ key: videoMeta.id, value: JSON.stringify(videoMeta) }],
  });
  await producer.disconnect();
};
