# Pembelajaran IPAS - Game Based Learning Geografi Jawa Barat

Aplikasi pembelajaran interaktif untuk siswa SD yang mempelajari geografi kabupaten di Jawa Barat dengan sistem game based learning dan integrasi AI Gemini.

## Fitur Utama

- **Login System**: User memasukkan nama dan kelas yang disimpan di memori HP
- **Home Screen**: Menampilkan skor total dan daftar kabupaten Jawa Barat
- **Sistem Misi**: Kabupaten harus dikerjakan secara berurutan (terkunci sampai misi sebelumnya selesai)
- **Deskripsi Kabupaten**: Informasi lengkap tentang kabupaten menggunakan AI Gemini
- **Quiz Interaktif**: 5 soal pilihan ganda per kabupaten dengan 3 opsi jawaban
- **Sistem Skor**: Tracking skor per quiz dan skor total

## Setup Aplikasi

### 1. Install Dependensi
```bash
npm install @react-native-async-storage/async-storage axios
```

### 2. Setup API Key Gemini
1. Dapatkan API key dari [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Buat file `.env` di root project
3. Tambahkan API key:
```
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

**Catatan**: Aplikasi menggunakan model `gemini-2.5-flash` dengan endpoint:
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=YOUR_API_KEY
```

### 3. Jalankan Aplikasi
```bash
npx expo start
```

## Struktur Aplikasi

```
my-journey/
├── app/
│   ├── _layout.tsx              # Layout utama dengan AuthContext
│   ├── login.tsx                # Halaman login
│   ├── (tabs)/
│   │   ├── index.tsx            # Home screen dengan daftar kabupaten
│   │   └── deskripsi.tsx        # Deskripsi kabupaten
│   └── quiz/
│       └── [id].tsx             # Halaman quiz per kabupaten
├── context/
│   └── AuthContext.tsx          # Context untuk autentikasi
├── constants/
│   └── kabupaten.ts             # Data kabupaten Jawa Barat
├── utils/
│   └── storage.ts               # Helper AsyncStorage
└── package.json
```

## Cara Penggunaan

1. **Login**: Masukkan nama dan kelas
2. **Home**: Lihat skor dan pilih kabupaten yang tersedia (tidak terkunci)
3. **Deskripsi**: Baca informasi kabupaten dari AI Gemini
4. **Quiz**: Jawab 5 soal pilihan ganda
5. **Progress**: Kabupaten berikutnya akan terbuka setelah menyelesaikan quiz

## Teknologi yang Digunakan

- **React Native** dengan Expo
- **Expo Router** untuk navigasi
- **AsyncStorage** untuk penyimpanan data lokal
- **Axios** untuk HTTP requests
- **Google Gemini AI 2.5 Flash** untuk generate konten
- **TypeScript** untuk type safety

## Data Kabupaten

Aplikasi mencakup 26 kabupaten/kota di Jawa Barat:
- 17 Kabupaten
- 9 Kota

Setiap kabupaten memiliki:
- ID unik
- Nama kabupaten
- Deskripsi default
- Soal quiz yang di-generate oleh AI

## Sistem Skor

- Setiap jawaban benar = +1 skor
- Skor per quiz = jumlah jawaban benar (0-5)
- Skor total = akumulasi dari semua quiz yang diselesaikan
- Progress = jumlah kabupaten yang telah diselesaikan

## API Integration

Aplikasi menggunakan Google Gemini AI dengan:
- **Model**: `gemini-2.5-flash`
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=YOUR_API_KEY`
- **Authentication**: API key sebagai query parameter
- **Fallback**: Jika API tidak tersedia, menggunakan konten default


## Catatan Penting

- Pastikan API key Gemini sudah diset dengan benar
- Aplikasi memerlukan koneksi internet untuk generate konten AI
- Data user disimpan secara lokal di device
- Progress dan skor akan hilang jika data aplikasi dihapus
- Jika API key tidak valid atau tidak tersedia, aplikasi akan menggunakan konten default

---

## Lisensi Penelitian

Aplikasi ini digunakan untuk keperluan penelitian oleh ibu **Yani Fitriyani, M.Pd**. Seluruh kode, data, dan konten aplikasi hanya diperuntukkan sebagai bagian dari penelitian akademik dan tidak untuk tujuan komersial. Hak cipta dan penggunaan aplikasi tunduk pada ketentuan penelitian yang berlaku.
