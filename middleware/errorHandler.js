import multer from 'multer';

const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      status: 'error',
      message:
        err.message === 'Field name missing'
          ? 'File CSV wajib diupload dan harus menggunakan field name "file".'
          : 'Terjadi kesalahan saat upload file. Silakan cek file dan coba lagi.',
      errors: [{ msg: err.message, param: 'file', location: 'body' }],
    });
  }
  res.status(500).json({
    status: 'error',
    message: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
  });
};

export default errorHandler;