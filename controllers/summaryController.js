import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const generateSummary = async (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Missing data for prompt.' });
    }

    // Compose a comprehensive, structured prompt with explicit instructions
    const prompt = `Buatkan ringkasan analisis ulasan aplikasi berikut dalam format markdown dengan struktur dan urutan section sebagai berikut, tanpa kalimat pembuka atau penutup, dan tanpa instruksi tambahan. Setiap section harus berupa paragraf yang informatif, tidak menggunakan bullet point, dan memanfaatkan data yang diberikan secara maksimal. Pastikan hasilnya konsisten dan terstruktur untuk setiap analisis.

## Poin yang Paling Dihargai Pengguna
Jelaskan secara naratif apa saja aspek, fitur, atau pengalaman yang paling dihargai oleh pengguna berdasarkan pola kata, tema, dan contoh ulasan positif yang tersedia. Gunakan data top_words dan contoh ulasan positif untuk memperkuat narasi.

## Area yang Perlu Ditingkatkan
Jelaskan secara naratif area, fitur, atau pengalaman yang paling banyak dikeluhkan atau perlu ditingkatkan menurut pengguna, berdasarkan pola kata, tema, dan contoh ulasan negatif yang tersedia. Gunakan data top_words dan contoh ulasan negatif untuk memperkuat narasi.

## Analisis Emosi Pengguna
Jabarkan secara naratif bagaimana distribusi emosi pengguna terhadap aplikasi ini, serta bagaimana emosi tersebut tercermin dalam ulasan-ulasan yang ada. Kaitkan dengan data emosi dan contoh ulasan yang relevan.

## Analisis Sentimen Pengguna
Jelaskan secara naratif bagaimana persebaran sentimen (positif, netral, negatif) pada ulasan aplikasi, serta faktor-faktor yang mempengaruhi sentimen tersebut. Kaitkan dengan data sentimen, top_words, dan contoh ulasan.

## Rekomendasi Pengembangan
Buat rekomendasi pengembangan aplikasi yang spesifik dan actionable, berdasarkan temuan dari analisis sentimen, emosi, dan pola ulasan pengguna. Pastikan rekomendasi benar-benar relevan dengan data yang diberikan.

## Ulasan Tidak Relevan/Spam
Jelaskan secara naratif tentang keberadaan, jumlah, dan karakteristik ulasan yang terindikasi sebagai spam atau tidak relevan, serta dampaknya terhadap analisis secara keseluruhan. Gunakan data spam yang tersedia.

## Kesimpulan
Tuliskan satu paragraf insight utama dan ringkasan mendalam dari analisis di atas, tanpa mengulang instruksi atau basa-basi. Pastikan insight benar-benar membantu pengambilan keputusan pengembangan aplikasi.

Gunakan hanya data berikut sebagai referensi:
${JSON.stringify(data, null, 2)}

Pastikan hasil ringkasan langsung dimulai dari section pertama, tidak ada kalimat pembuka/penutup, dan tidak ada instruksi tambahan. Jangan pernah menambahkan penjelasan format di hasil output.`;

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
    console.error('Error generating summary:', err);
    res
      .status(500)
      .json({ status: 'error', message: 'Gagal membuat ringkasan AI.' });
  }
};
