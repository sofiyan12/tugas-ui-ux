# EduReport - Teacher Daily Reporting System

A modern, fully responsive web-based dashboard for teacher daily administration and reporting.

## Features

### Core Functionality
- **Teacher Dashboard** - Overview with KPI cards, recent reports, and upcoming tasks
- **Daily Report Creation** - Comprehensive form with auto-save functionality
- **Report History** - Searchable and filterable report archive
- **Grade Recap** - Student performance analytics with charts
- **Principal Dashboard** - School-wide monitoring and reporting
- **Settings** - Profile, notifications, security, and preferences management

### File Upload Support
- PDF documents
- DOCX files
- PPTX presentations
- Images (JPG, PNG)
- Google Drive links
- YouTube/video links

### Sharing Options
- One-click WhatsApp sharing
- Email integration
- Principal dashboard sharing

### Responsive Design
- **Desktop**: Sidebar navigation, full table views, multi-column layouts
- **Tablet**: Adaptive grid layouts, responsive cards
- **Mobile**: Bottom navigation bar, floating action button, card-based layouts, touch-friendly interfaces

## Design System

### Color Palette
- **Primary**: Soft Blue (#3b82f6)
- **Secondary**: Light Blue (#e0f2fe)
- **Background**: Off-white (#f8fafc)
- **Card**: White (#ffffff)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- Clean, readable fonts
- Responsive text sizes
- Consistent spacing

### Components
- Responsive cards
- Status badges
- Progress bars
- Auto-save indicators
- Mobile navigation
- Floating action button
- Data tables (desktop) / Card views (mobile)

## Pages

1. **Login Page** - Secure authentication
2. **Register Page** - New teacher registration
3. **Teacher Dashboard** - Main overview and quick actions
4. **Create Report Page** - Daily report form with attachments
5. **Report History Page** - Archive with search and filters
6. **Report Detail Page** - Full report view with actions
7. **Grade Recap Page** - Analytics and performance tracking
8. **Principal Dashboard** - School-wide monitoring
9. **Settings Page** - Account and preference management

## User Experience Goals

- Minimize repetitive input
- Fast report creation
- Easy archive retrieval
- Support for non-tech-savvy teachers
- Auto-save functionality
- Mobile-friendly touch interfaces
- Intuitive navigation

## Technical Stack

- React 18.3.1
- React Router 7.13.0
- Tailwind CSS 4.1.12
- Recharts 2.15.2
- Lucide React Icons
- Sonner Toast Notifications
- TypeScript

## Mobile Features

- **Bottom Navigation**: Quick access to main sections
- **Floating Action Button**: Fast report creation
- **Responsive Tables**: Convert to cards on mobile
- **Touch-Friendly**: Large buttons and adequate spacing
- **Collapsible Sidebar**: Overlay menu on mobile

## Cara Menjalankan Aplikasi (Getting Started)

Berikut adalah panduan instalasi dan menjalankan aplikasi **Edu Report** secara lokal di laptop/komputer Anda:

### 📋 Prasyarat Sistem
Pastikan Anda sudah menginstal:
1. **Node.js** (versi 18 ke atas)
2. **Package Manager** (`npm` atau `pnpm`)
3. **MySQL Server** (XAMPP / Laragon / MySQL Standalone)

---

### 🗄️ 1. Persiapan Database MySQL
1. Jalankan **MySQL** Anda (misalnya melalui panel XAMPP Control Panel).
2. Buka database manager pilihan Anda (phpMyAdmin / DBeaver / Navicat).
3. Buat database baru bernama **`edureport`**:
   ```sql
   CREATE DATABASE edureport;
   ```
4. *Catatan:* Tabel database (`users`, `reports`) akan otomatis digenerate dan bermigrasi saat server backend dijalankan pertama kali!

---

### 💻 2. Menjalankan Server Backend (API & DB)
1. Buka terminal baru dan masuk ke folder `server`:
   ```bash
   cd server
   ```
2. Instal semua dependensi server:
   ```bash
   npm install
   ```
3. Salin file konfigurasi `.env` (pastikan pengaturan DB_HOST, DB_USER, DB_PASSWORD, dan DB_NAME sudah sesuai dengan konfigurasi local MySQL Anda):
   ```env
   PORT=8080
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=edureport
   ```
4. Jalankan server backend:
   ```bash
   node index.js
   ```
   *Output sukses:* `🚀 Server berjalan di http://localhost:8080` dan `✅ Database siap!`

---

### 🌐 3. Menjalankan Server Frontend (UI)
1. Buka terminal baru lagi dan pastikan berada di root folder utama proyek:
   ```bash
   cd ..
   ```
2. Instal dependensi frontend:
   ```bash
   npm install
   # atau jika menggunakan pnpm:
   pnpm install
   ```
3. Jalankan server lokal frontend:
   ```bash
   npm run dev
   # atau jika menggunakan pnpm:
   pnpm dev
   ```
4. Buka browser Anda dan akses tautan yang muncul (misalnya `http://localhost:5174/` atau `http://localhost:5173/`).

---

### 🔑 4. Akun Uji Coba (Tester Accounts)
Untuk memudahkan pengujian alur kerja, silakan gunakan akun demo berikut:

* **Akun Guru (Akses Input & Riwayat Laporan):**
  - **Email:** `guru@sekolah.edu`
  - **Kata Sandi:** `123456`
* **Akun Kepala Sekolah (Akses Approval & Review):**
  - **Email:** `kepsek@sekolah.edu`
  - **Kata Sandi:** `123456`

*(Anda juga dapat mendaftarkan akun baru secara mandiri melalui menu pendaftaran di halaman utama)*

---
© 2026 Edu Report System. All rights reserved.
