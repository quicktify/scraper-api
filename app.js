import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import rateLimiter from './middleware/rateLimiter.js';
import errorHandler from './middleware/errorHandler.js';
import reviewsRouter from './routes/reviews.js';

const app = express();
app.use(cors());
app.use(express.json());
app.set('trust proxy', 1);
app.use(rateLimiter);

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API is ready and running.' });
});

app.use('/api/reviews', reviewsRouter);
app.use(errorHandler);

export default app;
