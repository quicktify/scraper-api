import { body, validationResult } from 'express-validator';

export const googlePlayValidator = [
  body('appId')
    .notEmpty()
    .withMessage('Kolom appId wajib diisi.')
    .matches(/^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+[0-9a-z_]$/i)
    .withMessage(
      'Format appId tidak valid. Contoh: com.example atau com.example.app'
    ),
  body('sort')
    .notEmpty()
    .withMessage('Kolom sort wajib diisi.')
    .isIn(['NEWEST', 'RATING', 'HELPFULNESS'])
    .withMessage(
      'Kolom sort hanya boleh berisi NEWEST, RATING, atau HELPFULNESS.'
    ),
  body('num')
    .notEmpty()
    .withMessage('Kolom num wajib diisi.')
    .isInt({ min: 1 })
    .withMessage('Kolom num harus berupa angka bulat positif.'),
];

export const csvUploadValidator = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      status: 'error',
      message: 'File CSV wajib diupload. Silakan pilih file CSV yang sesuai.',
      errors: [
        { msg: 'File CSV wajib diupload.', param: 'file', location: 'body' },
      ],
    });
  }
  next();
};
