import { createClient } from 'redis';
import { REDIS_URL } from './env';
const redis = createClient({
  url: REDIS_URL,
});
console.log(`Connecting to Redis at ${REDIS_URL}`);

redis.on('error', err => console.error('Redis error:', err));
const connectRedis = async () =>
  await redis
    .connect()
    .then(() => {
      console.log('redis server connected!');
    })
    .catch(err => {
      console.error('Error connecting to redis server', err);
    });

export { redis, connectRedis };
