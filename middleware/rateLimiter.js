import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const redisMax = parseInt(process.env.RATE_LIMIT_MAX) || 30;
const redisWindow =
  parseInt(process.env.RATE_LIMIT_WINDOW) || 30 * 24 * 60 * 60 * 1000;
const memoryMax = parseInt(process.env.RATE_LIMIT_MAX_PER_MINUTE) || 10;
const memoryWindow =
  parseInt(process.env.RATE_LIMIT_WINDOW_PER_MINUTE) || 1 * 60 * 1000;

let limiter;

if (process.env.RATE_LIMIT_MODE === '1') {
  // Redis (Upstash) per bulan
  const redisClient = createClient({
    url: process.env.REDIS_URL,
  });
  redisClient.connect().catch(console.error);

  limiter = rateLimit({
    windowMs: redisWindow,
    max: redisMax,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args),
    }),
    message: {
      status: 'error',
      message:
        'Batas penggunaan bulanan telah tercapai, silakan coba lagi bulan depan.',
    },
  });
} else {
  // Express memory per menit
  limiter = rateLimit({
    windowMs: memoryWindow,
    max: memoryMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      status: 'error',
      message: 'Terlalu banyak permintaan, silakan coba lagi dalam satu menit.',
    },
  });
}

export default limiter;
