import express from 'express';
import { generatePredictionSummary } from '../controllers/predictionSummaryController.js';

const router = express.Router();

router.post('/summary', generatePredictionSummary);

export default router;
