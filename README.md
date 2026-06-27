# 🎓 Edu Report — Portal Pelaporan Harian Guru

<p align="center">
  <img src="https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61dafb" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

---

**Edu Report** adalah sebuah platform berbasis web (*responsive multi-device*) yang dirancang khusus untuk memodernisasi sistem pelaporan administrasi harian guru di **SMKS Fajar Indah**. Solusi ini menggantikan metode pelaporan konvensional berbasis *screenshot* galeri HP yang kurang efisien menjadi sistem input digital yang cepat, aman, terintegrasi *cloud*, serta mendukung pengawasan langsung (*review & approval*) oleh Kepala Sekolah.

---

## 🌟 Fitur Utama

### 🧑‍🏫 Portal Guru (Teacher Hub)
- **Dasbor Statistik Dinamis**: Pantau status laporan (Draf, Menunggu Review, Selesai) dalam bentuk KPI visual yang modern.
- **Form Input Terstruktur**: Mengisi detail kegiatan mengajar, tugas siswa, hambatan, hingga rencana pembelajaran berikutnya tanpa *screenshot* manual.
- **Auto-Save & Draft**: Melindungi data laporan guru agar tidak hilang secara tidak sengaja sebelum dikirim.
- **Riwayat Pelaporan & Filter**: Cari data laporan lama berdasarkan rentang tanggal, mata pelajaran, atau kelas secara instan.
- **Cetak PDF Resmi**: Ekspor berkas laporan menjadi file PDF berformat standar cetak resmi dalam satu klik.
- **One-Click Share**: Bagikan link review laporan langsung ke WhatsApp atau Email dengan templat teks yang otomatis terisi.

### 🏫 Portal Kepala Sekolah (Principal Dashboard)
- **Monitoring Terpusat**: Lihat performa administrasi pengumpulan laporan dari seluruh guru secara berkala.
- **Sistem Verifikasi (Approve/Reject)**: Terima laporan dengan melampirkan jam audit (*approval timestamp*) atau tolak dengan menambahkan catatan umpan balik (*review note*).
- **Akses Dokumen Lampiran**: Kepala sekolah dapat mengunduh secara langsung file pendukung (PDF, DOCX, gambar) atau meninjau tautan link (G-Drive, YouTube) yang disertakan guru di modal tinjauan.

### 📱 Desain Responsif & Ramah Seluler (Mobile Optimization)
- **Navigasi Bawah Seluler (Bottom Nav)**: Memudahkan pengoperasian satu tangan di HP.
- **Drawer Profil & Tombol Floating Action (FAB)**: Arahkan ke menu utama dan pembuatan laporan dengan cepat.

---

## 🏗️ Struktur Folder Proyek

```text
├── server/               # Server Backend (API RESTful)
│   ├── index.js          # Entrypoint & Inisialisasi Database Otomatis
│   ├── package.json      # Node Packages Backend
│   └── uploads/          # Folder Penyimpanan File Lampiran Guru (Gambar & Dokumen)
│
├── src/                  # Client Frontend (UI Portal)
│   ├── app/
│   │   ├── components/   # Komponen Global (Layout, Sidebar, MobileNav)
│   │   ├── pages/        # Halaman Utama (Login, Register, Dashboard, History, Settings)
│   │   └── routes.tsx    # Manajemen Rute Halaman
│   └── lib/
│       └── api.ts        # Konfigurasi Koneksi API / Axios client
│
├── .gitignore            # File Pengecualian Unggahan Git
├── package.json          # Node Packages Frontend
└── README.md             # Dokumentasi Proyek Utama
```

---

## 🚀 Panduan Menjalankan Aplikasi Secara Lokal (Getting Started)

Ikuti langkah-langkah di bawah ini untuk menginstal dan menjalankan proyek di komputer/laptop Anda:

### 📋 1. Prasyarat Sistem
Pastikan perangkat Anda telah terpasang:
- **Node.js** (versi 18.0.0 atau yang lebih baru)
- **MySQL Server** (XAMPP, Laragon, atau MySQL Standalone)
- Browser modern (Google Chrome, Microsoft Edge, Mozilla Firefox)

### 🗄️ 2. Persiapan Database MySQL
1. Aktifkan modul **MySQL** di panel control database Anda (misalnya XAMPP).
2. Buka database manager pilihan Anda (phpMyAdmin, DBeaver, dll) dan jalankan SQL berikut untuk membuat database baru:
   ```sql
   CREATE DATABASE edureport;
   ```
3. *Catatan:* Tabel-tabel yang diperlukan (`users` & `reports`) beserta kolom pendukungnya akan otomatis dibuat saat Anda menjalankan server backend pertama kali.

### 💻 3. Jalankan Server Backend
1. Buka terminal baru, navigasikan ke direktori server:
   ```bash
   cd server
   ```
2. Instal semua dependensi:
   ```bash
   npm install
   ```
3. Buat file `.env` di dalam folder `server` dan sesuaikan kredensial database Anda:
   ```env
   PORT=8080
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=edureport
   ```
4. Jalankan backend:
   ```bash
   node index.js
   ```
   *Output yang diharapkan:*
   ```text
   ✅ Database siap!
   🚀 Server berjalan di http://localhost:8080
   ```

### 🌐 4. Jalankan Server Frontend
1. Buka terminal baru lainnya, pastikan Anda berada di direktori utama (root folder):
   ```bash
   cd ..
   ```
2. Instal dependensi frontend:
   ```bash
   npm install
   ```
3. Jalankan aplikasi frontend:
   ```bash
   npm run dev
   ```
4. Aplikasi akan berjalan di alamat `http://localhost:5174/` (atau port default lainnya yang tampil di terminal). Buka alamat tersebut di Google Chrome Anda.

---

## 🔑 Kredensial Uji Coba (Tester Accounts)

Untuk mempermudah proses demonstrasi alur kerja aplikasi oleh dosen penguji, silakan gunakan akun bawaan berikut:

### 🧑‍🏫 Akun Guru (Role: Teacher)
- **Surel (Email)**: `guru@sekolah.edu`
- **Kata Sandi (Password)**: `123456`

### 🏫 Akun Kepala Sekolah (Role: Principal)
- **Surel (Email)**: `kepsek@sekolah.edu`
- **Kata Sandi (Password)**: `123456`

---
*Dikembangkan oleh **Sofiyan Hadi** — Tugas Akhir UI/UX & Web Development Proyek SMKS Fajar Indah (2026).*
