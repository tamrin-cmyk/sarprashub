# 📦 SarprasHub - Sistem Informasi Peminjaman Sarana & Prasarana Digital

Sistem manajemen inventaris sarana prasarana sekolah/instansi modern dengan fitur pengajuan peminjaman online, verifikasi admin, pelacakan status transparan, serta **cetak label barcode stiker** dan **cetak kartu peminjaman resmi berformat PDF otomatis**.

---

## 🌟 Fitur Utama

1. **Dashboard Overview (Tema Soft Pastel Neumorphic)**:
   - 4 kartu metrik utama (*Total Sarpras, Unit Siap Pakai, Sirkulasi Aktif, Total Selesai*).
   - Tabel inventaris dengan filter pills (*All, Tersedia, Dipinjam Sebagian, Perawatan*).
   - Diagram Donat persentase stok & *Recent Activity timeline*.
   - Kurva gelombang performa sirkulasi mingguan & top kategori.

2. **Data Inventaris & Cetak Label Barcode**:
   - CRUD lengkap data master barang inventaris.
   - Fitur cetak stiker label aset standar instansi dengan Barcode & QR Code verifikasi.

3. **Data Ruangan & Lokasi Fasilitas**:
   - Pengelolaan aula serbaguna, laboratorium CBT, dan ruang rapat.
   - Informasi kapasitas, fasilitas, status perawatan, dan nomor kontak PIC WhatsApp.

4. **Katalog Peminjaman (Publik/User)**:
   - Akses mudah untuk guru, staf, maupun pengunjung umum.
   - Filter pencarian menurut kategori, lokasi, kondisi, dan stok tersedia.

5. **Sirkulasi Transaksi & Cetak Kartu PDF Otomatis**:
   - Pelacakan alur status: *Pengajuan ➔ Verifikasi ➔ Persetujuan ➔ Sedang Dipakai ➔ Selesai*.
   - Tombol **Pratinjau & Unduh Kartu Peminjaman PDF** resmi berstempel dan ber-barcode.

6. **Keamanan & Otorisasi Admin**:
   - Menu pengelolaan inventaris dan ruangan terlindungi login password.
   - **Username default**: `admin`
   - **Password default**: `admin123` *(Dapat diganti di menu Pengaturan Pengguna)*.

---

## 💻 Cara Menjalankan di Komputer Lokal

1. Pastikan sudah menginstal **Node.js** (versi 18 atau 20+).
2. Ekstrak file ZIP proyek ini.
3. Buka folder proyek di terminal, lalu jalankan:

```bash
# 1. Install semua dependensi
npm install

# 2. Jalankan server lokal
npm run dev
```

4. Buka peramban browser di `http://localhost:3000`.

---

## 🌐 Cara Deploy / Publikasi

- **Vercel**: Cukup import repositori ini di Vercel, framework akan otomatis terdeteksi sebagai `Vite`.
- **Firebase**: Jalankan `npm run build`, lalu `firebase deploy --only hosting`.
- Panduan lengkap tersedia di file `DEPLOYMENT.md`.
