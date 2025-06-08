# QUICKTIFY SCRAPER AND SUMMARIZE API Documentation

API ini menyediakan layanan:

- Scrape review aplikasi dari Google Play Store
- Upload dan proses file CSV berisi review
- Generate ringkasan analisis review (AI)
- Generate ringkasan analisis prediksi rating (AI)

---

## Daftar Endpoint Terbaru

### 1. Cek Status API

- **GET /**  
  Mengecek apakah API siap digunakan.
  - **Response:**
    ```json
    { "status": "ok", "message": "API is ready and running." }
    ```

---

### 2. Scrape Review Google Play

- **POST /api/reviews/google-play-scraper**
- **Body (JSON):**
  ```json
  {
    "appId": "com.example.app",
    "sort": "NEWEST|RATING|HELPFULNESS",
    "num": 10
  }
  ```
- **Response (200):**
  ```json
  {
    "status": "success",
    "reviewsCount": 10,
    "reviews": ["review 1", "review 2", ...]
  }
  ```
- **Error (400/404):**
  ```json
  {
    "status": "error",
    "message": "Tipe sort tidak valid. Pilih salah satu: NEWEST, RATING, atau HELPFULNESS."
  }
  ```

---

### 3. Upload & Proses File CSV Review

- **POST /api/reviews/google-play-csv**
- **Form Data:**
  - `file`: File CSV (maksimal 32MB)
- **Kolom CSV yang didukung:** `review` atau `ulasan`
- **Response (200):**
  ```json
  {
    "status": "success",
    "reviewsCount": 100,
    "reviews": ["review 1", "review 2", ...]
  }
  ```
- **Error (400):**
  - Jika file >32MB:
    ```json
    {
      "status": "error",
      "message": "Ukuran file melebihi batas maksimal 32MB."
    }
    ```
  - Jika kolom tidak ditemukan:
    ```json
    {
      "status": "error",
      "message": "Kolom 'review' atau 'ulasan' tidak ditemukan pada file CSV. Pastikan file memiliki salah satu kolom tersebut."
    }
    ```

---

### 4. Generate Summary Analisis Review (AI)

- **POST /api/reviews/generate-summary**
- **Body (JSON):**
  ```json
  {
    "data": {
      // Struktur data hasil analisis review (top_words, emosi, sentimen, spam, dsb)
    }
  }
  ```
- **Response (200):**
  ```json
  {
    "status": "success",
    "summary": "Ringkasan analisis review dalam format markdown."
  }
  ```
- **Error (400/500):**
  ```json
  {
    "status": "error",
    "message": "Missing data for prompt." // atau error lain dari AI
  }
  ```

---

### 5. Generate Prediction Summary (AI)

- **POST /api/rating-estimation/summary**
- **Body (JSON):**
  ```json
  {
    "data": {
      // Struktur data hasil prediksi rating, feature importance, SHAP, dsb
    }
  }
  ```
- **Response (200):**
  ```json
  {
    "status": "success",
    "summary": "Ringkasan analisis prediksi rating dalam format markdown."
  }
  ```
- **Error (400/500):**
  ```json
  {
    "status": "error",
    "message": "Missing data for prediction summary." // atau error lain dari AI
  }
  ```

---

## Batasan

- Ukuran file upload maksimal 32MB (batas Cloud Run & Multer).
- File CSV harus memiliki kolom `review` atau `ulasan`.
- Untuk file besar, disarankan parsing di client lalu kirim data hasil parsing ke server.
- Semua endpoint AI membutuhkan struktur data yang sesuai dengan analisis yang diharapkan.

---

## Contoh Request: Upload CSV (cURL)

```bash
curl -X POST http://localhost:PORT/api/reviews/google-play-csv \
  -F "file=@/path/to/review.csv"
```

## Contoh Request: Scrape Google Play (cURL)

```bash
curl -X POST http://localhost:PORT/api/reviews/google-play-scraper \
  -H "Content-Type: application/json" \
  -d '{"appId":"com.example.app","sort":"NEWEST","num":10}'
```

## Contoh Request: Generate Summary Analisis Review (AI)

```bash
curl -X POST http://localhost:PORT/api/reviews/generate-summary \
  -H "Content-Type: application/json" \
  -d '{"data":{...}}'
```

## Contoh Request: Generate Prediction Summary (AI)

```bash
curl -X POST http://localhost:PORT/api/rating-estimation/summary \
  -H "Content-Type: application/json" \
  -d '{"data":{...}}'
```

---

## Setup & Menjalankan

1. Clone repo ini
2. Install dependencies: `npm install`
3. Jalankan: `npm start` atau `npm run dev`
4. API berjalan di port sesuai konfigurasi (default: 3000)

---

## Catatan Penting

- Endpoint upload CSV hanya menerima file dengan ukuran maksimal 32MB.
- Untuk keamanan, file CSV yang sudah diproses akan dihapus otomatis dari server.
- Jika ingin upload file besar, pertimbangkan untuk parsing di client dan kirim data hasil parsing saja.

---

## Lisensi

MIT
