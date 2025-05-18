import multer from 'multer';

export const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 32 * 1024 * 1024 },
});
