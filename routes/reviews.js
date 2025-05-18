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

// File size error handler
router.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      status: 'error',
      message: 'Ukuran file melebihi batas maksimal 32MB.',
    });
  }
  next(err);
});

export default router;
