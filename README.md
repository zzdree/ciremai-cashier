# 🍽️ RM. Ciremai — Cashier POS & Real-Time Self-Ordering Web App

[![Deploy to GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-brightgreen?logo=github)](https://zzdree.github.io/ciremai-cashier/order)
[![Database](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com)
[![Tech](https://img.shields.io/badge/Tech-Vanilla%20JS%20%7C%20HTML5%20%7C%20CSS3-orange)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Aplikasi kasir Point of Sale (POS) dan sistem pemesanan mandiri (*self-ordering*) berbasis web real-time untuk warung makan **RM. Ciremai (Kampus UNNES, Sekaran, Gunungpati, Kota Semarang)**.

Pelanggan dapat langsung memesan makanan & minuman dari meja via QR code, sementara pengelola/kasir menerima pesanan secara instan dengan notifikasi suara dan memproses transaksi secara cepat dan terdata.

---

## 🌐 Live Web App

| Akses Pengguna | Tautan Langsung | Keterangan |
|---|---|---|
| 📱 **Pelanggan (Order)** | <a href="https://zzdree.github.io/ciremai-cashier/order" target="_blank" rel="noopener noreferrer"><b>zzdree.github.io/ciremai-cashier/order</b> ↗</a> | Katalog menu, keranjang belanja, deteksi meja otomatis, dan pengiriman pesanan mandiri. |
| ⚙️ **Pengelola & Kasir (Admin)** | <a href="https://zzdree.github.io/ciremai-cashier/admin" target="_blank" rel="noopener noreferrer"><b>zzdree.github.io/ciremai-cashier/admin</b> ↗</a> | Dashboard POS Kasir, antrean live pesanan, cetak struk A4, dan laporan omzet harian *(PIN default: `9900`)*. |

---

## ✨ Fitur Utama

- **🔢 Nomor Antrean Global (#N)** — Setiap pesanan pelanggan mendapatkan nomor urut antrean unik yang terus bertambah rapi (`#1, #2, #3, #4...`) tanpa reset harian.
- **📱 Pemesanan Mandiri Meja** — Pelanggan dapat memesan dari meja (`/order?meja=N`) dan nomor meja otomatis disertakan dalam pesanan.
- **⚡ Antrean Real-time & Notifikasi Suara** — Pesanan baru yang dikirim pelanggan langsung masuk ke layar kasir dan memicu notifikasi suara *ding*.
- **🛒 POS Kasir Cepat & Fleksibel** — Kasir dapat mengambil order, menyesuaikan menu jika pelanggan menambah pesanan, memberikan diskon nominal, dan menghitung uang kembalian secara otomatis melalui tombol cepat (*quick cash*).
- **💳 Dukungan Metode Pembayaran** — Tunai (Cash), QRIS, serta opsi pencatatan Piutang/Kasbon.
- **🖨️ Print Struk PDF / Kertas A4** — Dilengkapi stylesheet cetak responsif (`@media print`) untuk mencetak struk transaksi rapi pas 1 halaman penuh A4.
- **📊 Laporan & Rekap Omzet Harian** — Menghitung total omzet hari ini, transaksi sukses, daftar menu terlaris, serta fitur ekspor laporan ke format Excel/CSV.
- **🔄 Dual Storage (Cloud + Offline Fallback)** — Terintegrasi dengan database cloud **Supabase** dan otomatis menyimpan cadangan ke **LocalStorage** browser, sehingga kasir tetap dapat beroperasi normal jika jaringan internet terputus.
- **🛡️ Keepalive Otomatis** — Otomatisasi GitHub Actions aktif setiap 6 jam untuk menjaga project Supabase free-tier agar tidak pernah terkena pause/inactivity.

---

## 🧱 Struktur Folder Repositori

```text
ciremai-cashier/
├── index.html              → Halaman utama pemesanan pelanggan (katalog menu & checkout)
├── admin.html              → Halaman dashboard Admin & Kasir POS
├── admin/
│   └── index.html          → Rute /admin (redirect bersih ke admin.html)
├── order/
│   └── index.html          → Rute /order (redirect bersih ke index.html + parameter ?meja=N)
├── css/
│   └── style.css           → Sistem desain, token warna, antarmuka responsif, & aturan print
├── js/
│   ├── app.js              → Logika interaksi & pemesanan pelanggan
│   ├── kasir.js            → Logika POS kasir, antrean realtime, kelola menu, audio, & laporan
│   ├── db.js               → Modul klien Supabase REST API & RPC
│   ├── store.js            → Pengelola LocalStorage, counter order, dan format Rupiah
│   ├── data.js             → Database katalog menu & harga resmi RM. Ciremai
│   └── config.js           → Konfigurasi warung, PIN kasir, meja, dan koneksi Supabase
├── .github/
│   └── workflows/
│       └── keepalive.yml   → Workflow cron otomatis untuk menjaga database Supabase tetap aktif
├── schema.sql              → Skema PostgreSQL Supabase (tabel transaksi, sequence, & RPC)
├── DESIGN.md               → Dokumentasi lengkap sistem desain & UI/UX guidelines
├── PRD.md                  → Product Requirements Document (PRD)
├── .env.example            → Template konfigurasi environment variables
└── README.md               → Dokumentasi resmi proyek
```

---

## 🚀 Panduan Setup & Menjalankan Lokal

### 1. Clone Repositori
```bash
git clone https://github.com/zzdree/ciremai-cashier.git
cd ciremai-cashier
```

### 2. Konfigurasi Database (Supabase)
1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka **SQL Editor** di dashboard Supabase dan jalankan seluruh isi file [`schema.sql`](schema.sql).
3. Sesuaikan URL dan Anon Key pada [`js/config.js`](js/config.js) atau salin `.env.example` menjadi `.env.local`.

### 3. Jalankan Aplikasi
Karena aplikasi ini dibuat menggunakan **Vanilla Web Standards (HTML, CSS, JS)** murni tanpa build tools/compiler:
- Cukup buka file `index.html` (untuk pelanggan) atau `admin.html` (untuk kasir) langsung di browser favorit Anda.
- Atau gunakan local server seperti VS Code *Live Server* atau `npx serve .`.

---

## 📍 Profil Bisnis

- **Nama Usaha**: RM. Ciremai
- **Menu Utama**: Magelangan, Nasi Goreng, Mie Dokdok, Minuman Hangat & Dingin
- **Lokasi**: [RM. Ciremai UNNES di Google Maps](https://maps.app.goo.gl/Dzp9H1tu6BkAkfSV8) — X93V+8WX, Jl. Kalimasada, Sekaran, Kec. Gn. Pati, Kota Semarang, Jawa Tengah 50229
- **Jam Operasional**: Buka 24 Jam Setiap Hari

---

© RM. Ciremai Semarang — Dibuat untuk kecepatan dan kemudahan operasional warung.
