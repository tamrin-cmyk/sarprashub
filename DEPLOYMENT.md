# Panduan Lengkap Publikasi SarprasHub ke GitHub, Vercel & Firebase

Panduan langkah demi langkah untuk mempublikasikan aplikasi **SarprasHub** ke **GitHub**, **Vercel**, dan **Firebase Hosting** tanpa mengurangi fitur apa pun.

---

## 📋 Ringkasan File Konfigurasi yang Tersedia
Aplikasi sudah disiapkan dengan konfigurasi bawaan siap deploy:
1. `vercel.json` ➔ Menangani *Single Page Application (SPA)* routing dan build command Vite untuk **Vercel**.
2. `firebase.json` & `.firebaserc` ➔ Menangani hosting static build `dist` dan routing SPA untuk **Firebase Hosting**.
3. `.github/workflows/deploy.yml` ➔ Otomatisasi build & linting berkala di **GitHub Actions**.

---

## 🚀 BAGIAN 1: Mengunggah Proyek ke GitHub

### Langkah 1: Buat Repositori Baru di GitHub
1. Buka [github.com](https://github.com) dan masuk ke akun GitHub Anda.
2. Klik tombol hijau **New** (atau ikon `+` di kanan atas lalu pilih **New repository**).
3. Beri nama repositori, contoh: `sarprashub` atau `sarpras-management`.
4. Pilih **Public** atau **Private** (bebas sesuai kebutuhan).
5. **Jangan centang** opsi *"Initialize this repository with a README"* atau *.gitignore* (karena proyek sudah memilikinya).
6. Klik **Create repository**.

### Langkah 2: Hubungkan & Push dari Komputer / Terminal Lokal
Buka terminal pada folder proyek Anda, lalu jalankan perintah berikut secara berurutan:

```bash
# 1. Inisialisasi git jika belum
git init

# 2. Tambahkan semua file proyek
git add .

# 3. Buat commit pertama
git commit -m "feat: inisialisasi aplikasi SarprasHub dengan tema pastel neumorphic dan cetak PDF"

# 4. Ubah nama branch utama menjadi main
git branch -M main

# 5. Sambungkan ke repositori GitHub Anda (ganti username-anda dan nama-repo)
git remote add origin https://github.com/username-anda/sarprashub.git

# 6. Unggah kode ke GitHub
git push -u origin main
```

---

## ⚡ BAGIAN 2: Publikasi ke Vercel (Paling Cepat & Direkomendasikan)

Vercel sangat optimal untuk aplikasi Vite + React dan menyediakan domain HTTPS gratis (`.vercel.app`).

### Metode A: Melalui Dashboard Web Vercel (Otomatis & Tanpa Install CLI)
1. Buka [vercel.com](https://vercel.com) dan login menggunakan akun GitHub Anda.
2. Di halaman Dashboard, klik tombol **Add New...** ➔ **Project**.
3. Cari repositori **sarprashub** yang baru saja Anda push ke GitHub, lalu klik **Import**.
4. Di bagian konfigurasi proyek:
   - **Framework Preset**: Pilih `Vite` (biasanya terdeteksi otomatis).
   - **Root Directory**: Biarkan `./`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Klik **Deploy**.
6. Tunggu proses build sekitar 30–60 detik. Setelah selesai, Anda akan mendapatkan URL publik live (contoh: `https://sarprashub.vercel.app`).

### Metode B: Melalui Terminal (Vercel CLI)
Jika Anda ingin deploy langsung lewat baris perintah:
```bash
# Install Vercel CLI secara global
npm install -g vercel

# Jalankan perintah deploy
vercel

# Ikuti instruksi di layar (tekan Enter untuk opsi default).
# Untuk deploy versi produksi final:
vercel --prod
```

---

## 🔥 BAGIAN 3: Publikasi ke Firebase Hosting

Firebase Hosting menyediakan hosting CDN berkecepatan tinggi dengan sertifikat SSL gratis (`.web.app` / `.firebaseapp.com`).

### Langkah 1: Buat Proyek di Firebase Console
1. Buka [console.firebase.google.com](https://console.firebase.google.com).
2. Klik **Tambahkan Proyek** (*Add Project*).
3. Beri nama proyek, misalnya `sarprashub-app`.
4. Nonaktifkan atau aktifkan Google Analytics (opsional), lalu klik **Buat Proyek**.

### Langkah 2: Install Firebase CLI & Login
Buka terminal Anda:
```bash
# Install Firebase Tools CLI
npm install -g firebase-tools

# Login ke akun Google Anda
firebase login
```

### Langkah 3: Hubungkan Proyek Lokal ke Firebase
```bash
# Hubungkan proyek lokal dengan Project ID dari Firebase Console Anda:
firebase use --add
# (Pilih proyek yang baru saja Anda buat di Firebase Console)
```

Atau cukup ubah nama project ID di file `.firebaserc`:
```json
{
  "projects": {
    "default": "ID-PROYEK-FIREBASE-ANDA"
  }
}
```

### Langkah 4: Build & Deploy ke Firebase
```bash
# 1. Lakukan build produksi aplikasi
npm run build

# 2. Deploy ke Firebase Hosting
firebase deploy --only hosting
```
Setelah proses selesai, terminal akan menampilkan tautan aplikasi aktif Anda, misalnya:
`Hosting URL: https://sarprashub-app.web.app`

---

## 🔒 Catatan Keamanan & Kredensial Admin Bawaan
Setelah dipublikasikan, seluruh fitur tetap aktif secara mandiri (termasuk penyimpanan lokal *localStorage*, generate barcode label stiker, dan cetak kartu PDF):
- **Akses Pengunjung**: Bebas mengajukan peminjaman dan melacak status tiket.
- **Login Petugas/Admin**:
  - **Username**: `admin`
  - **Password**: `admin123`
- Anda dapat mengubah password admin kapan saja melalui menu **Pengaturan Pengguna** di dalam aplikasi.
