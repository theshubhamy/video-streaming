import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redis.on('error', err => console.error('Redis error:', err));
const connectRedis = redis
  .connect()
  .then(() => {
    console.log('redis server connected!');
  })
  .catch(err => {
    console.error('Error connecting to redis server', err);
  });

export { redis, connectRedis };
