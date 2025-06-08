import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();

const memoryMax = parseInt(process.env.RATE_LIMIT_MAX_PER_MINUTE) || 10;
const memoryWindow =
  parseInt(process.env.RATE_LIMIT_WINDOW_PER_MINUTE) || 1 * 60 * 1000;

const limiter = rateLimit({
  windowMs: memoryWindow,
  max: memoryMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Terlalu banyak permintaan, silakan coba lagi dalam satu menit.',
  },
});

export default limiter;
