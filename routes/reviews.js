import express from 'express';
import {
  googlePlayValidator,
  csvUploadValidator,
} from '../middleware/validators.js';
import { upload } from '../middleware/upload.js';
import {
  googlePlayScraper,
  csvUploadHandler,
} from '../controllers/reviewsController.js';

const router = express.Router();

router.post('/google-play-scraper', googlePlayValidator, googlePlayScraper);
router.post(
  '/google-play-csv',
  upload.single('file'),
  csvUploadValidator,
  csvUploadHandler
);

export default router;
