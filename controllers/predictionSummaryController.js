import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const generatePredictionSummary = async (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res
        .status(400)
        .json({
          status: 'error',
          message: 'Missing data for prediction summary.',
        });
    }

    const prompt = `Buatkan ringkasan analisis hasil prediksi estimasi rating aplikasi Google Play Store berikut dalam format markdown dengan struktur dan urutan section sebagai berikut, tanpa kalimat pembuka atau penutup, dan tanpa instruksi tambahan. Setiap section harus berupa paragraf naratif yang informatif, tidak menggunakan bullet point, dan memanfaatkan data yang diberikan secara maksimal. Pastikan hasilnya konsisten dan terstruktur untuk setiap analisis.

## Hasil Prediksi Rating dan Key Takeaways
Jelaskan hasil prediksi rating aplikasi, nilai rating yang dihasilkan, interval kepercayaan, serta model yang digunakan. Berikan interpretasi singkat mengenai arti rating tersebut dalam konteks aplikasi di Google Play Store.

## Ringkasan Karakteristik Aplikasi
Jabarkan secara naratif karakteristik utama aplikasi berdasarkan data input (seperti kategori, jumlah rating, jumlah instalasi, ukuran, content rating, dukungan iklan, pembelian dalam aplikasi, editors choice, dan tipe aplikasi). Kaitkan karakteristik ini dengan konteks pasar aplikasi.

## Faktor-Faktor Utama Penentu Rating (Feature Importance)
Analisis fitur-fitur yang paling berpengaruh terhadap prediksi rating berdasarkan data feature importance. Jelaskan fitur mana yang paling dominan, baik secara positif maupun negatif, dan bagaimana pengaruhnya terhadap rating aplikasi.

## Analisis Pengaruh Setiap Fitur (SHAP Local Explanation)
Jelaskan secara naratif bagaimana masing-masing fitur mempengaruhi hasil prediksi rating pada kasus aplikasi ini, berdasarkan nilai SHAP. Sebutkan fitur yang memberikan kontribusi positif maupun negatif, dan berikan insight mengapa hal tersebut bisa terjadi.

## Visualisasi Penjelasan Model
Deskripsikan secara singkat kegunaan visualisasi (bar plot, waterfall plot, force plot) yang tersedia, dan bagaimana visualisasi tersebut dapat membantu pemahaman stakeholder terhadap hasil prediksi dan penjelasan model.

## Insight dan Rekomendasi Pengembangan
Buat insight utama dan rekomendasi actionable yang relevan untuk pengembang aplikasi, berdasarkan hasil prediksi, faktor penting, dan analisis SHAP. Pastikan rekomendasi benar-benar relevan dengan data yang diberikan dan dapat digunakan untuk pengambilan keputusan pengembangan aplikasi.

Gunakan hanya data berikut sebagai referensi:
${JSON.stringify(data, null, 2)}

Pastikan hasil ringkasan langsung dimulai dari section pertama, tidak ada kalimat pembuka/penutup, dan tidak ada instruksi tambahan. Jangan pernah menambahkan penjelasan format di hasil output. Sebagai info tambahan saja jika 'Size' satuannya adalah MB.`;

    const model = google('gemini-2.0-flash');

    const { text } = await generateText({
      model,
      prompt,
      maxTokens: 2048,
      temperature: 0.2,
    });

    const summary = text?.trim();
    if (!summary) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Ringkasan kosong dari Gemini.' });
    }
    res.json({ status: 'success', summary });
  } catch (err) {
    console.error('Error generating prediction summary:', err);
    res
      .status(500)
      .json({
        status: 'error',
        message: 'Gagal membuat ringkasan prediksi AI.',
      });
  }
};
