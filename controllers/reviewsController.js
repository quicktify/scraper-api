import gplay from 'google-play-scraper';
import fs from 'fs';
import csv from 'csv-parser';
import { validationResult } from 'express-validator';

export const googlePlayScraper = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message:
        'Validasi gagal: data yang dikirim tidak sesuai. Silakan cek kembali input Anda.',
      errors: errors.array(),
    });
  }
  const { appId, sort, num } = req.body;
  let sortType;
  switch (sort) {
    case 'NEWEST':
      sortType = gplay.sort.NEWEST;
      break;
    case 'RATING':
      sortType = gplay.sort.RATING;
      break;
    case 'HELPFULNESS':
      sortType = gplay.sort.HELPFULNESS;
      break;
    default:
      return res.status(400).json({
        status: 'error',
        message:
          'Tipe sort tidak valid. Pilih salah satu: NEWEST, RATING, atau HELPFULNESS.',
      });
  }
  try {
    const result = await gplay.reviews({
      appId,
      lang: 'id',
      country: 'id',
      sort: sortType,
      num: Number(num),
    });
    if (!result.data || result.data.length === 0) {
      return res.status(404).json({
        status: 'error',
        message:
          'Tidak ada review ditemukan atau appId tidak valid. Pastikan appId benar dan aplikasi memiliki review.',
      });
    }
    const reviews = result.data.map((r) => r.text).filter(Boolean);
    res.json({
      status: 'success',
      reviewsCount: reviews.length,
      reviews,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message:
        'Terjadi kesalahan pada server atau layanan Google Play. Silakan coba lagi nanti atau gunakan CSV Upload untuk mengambil review dari file CSV.',
    });
  }
};

export const csvUploadHandler = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(400).json({
      status: 'error',
      message:
        'Validasi gagal: file CSV tidak sesuai atau tidak ditemukan. Silakan cek kembali file yang diupload.',
      errors: errors.array(),
    });
  }
  const reviews = [];
  let foundColumn = null;
  let responded = false;

  const fileStream = fs.createReadStream(req.file.path);
  const csvStream = fileStream.pipe(csv());

  csvStream
    .on('headers', (headers) => {
      if (headers.includes('review')) foundColumn = 'review';
      else if (headers.includes('ulasan')) foundColumn = 'ulasan';
      if (!foundColumn) {
        responded = true;
        csvStream.destroy();
        fileStream.destroy();
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          status: 'error',
          message:
            "Kolom 'review' atau 'ulasan' tidak ditemukan pada file CSV. Pastikan file memiliki salah satu kolom tersebut.",
        });
      }
    })
    .on('data', (row) => {
      if (foundColumn && row[foundColumn]) {
        reviews.push(row[foundColumn]);
      }
    })
    .on('end', () => {
      if (!responded) {
        fs.unlinkSync(req.file.path);
        res.json({
          status: 'success',
          reviewsCount: reviews.length,
          reviews,
        });
      }
    })
    .on('error', (err) => {
      if (!responded) {
        fs.unlinkSync(req.file.path);
        res.status(500).json({
          status: 'error',
          message:
            'Terjadi kesalahan saat memproses file CSV. Silakan coba lagi dengan file yang benar.',
        });
      }
    });
};
