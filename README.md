# 🍽️ RM. Ciremai — Cashier POS & Real-Time Self-Ordering Web App

[![Deploy to GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-brightgreen?logo=github)](https://zzdree.github.io/ciremai-cashier/order)
[![Theme](https://img.shields.io/badge/Theme-Light%20%26%20Dark%20(Default%20Light)-blue)](DESIGN.md)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%20AAA%20(16:1)-success)](DESIGN.md)
[![Database](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com)
[![Tech](https://img.shields.io/badge/Tech-Vanilla%20JS%20%7C%20HTML5%20%7C%20CSS3-orange)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Aplikasi kasir Point of Sale (POS) dan sistem pemesanan mandiri (*self-ordering*) berbasis web real-time untuk warung makan **RM. Ciremai (Kampus UNNES, Sekaran, Gunungpati, Kota Semarang)**.

Pelanggan dapat langsung memesan makanan & minuman dari katalog digital mandiri, sementara kasir/pengelola menerima pesanan secara instan melalui antrean real-time otomatis (polling 4 detik + notifikasi suara), memproses pembayaran tunai/QRIS, dan mencetak struk secara cepat dan akurat.

---

## 🌐 Live Web App

| Akses Pengguna | Tautan Langsung | Keterangan |
|---|---|---|
| 📱 **Pelanggan (Order)** | <a href="https://zzdree.github.io/ciremai-cashier/order" target="_blank" rel="noopener noreferrer"><b>zzdree.github.io/ciremai-cashier/order</b> ↗</a> | Katalog menu 8 kategori, keranjang belanja interaktif, opsi makan di tempat/bungkus, catatan khusus, dan nomor antrean `#N`. |
| ⚙️ **Pengelola & Kasir (Admin)** | <a href="https://zzdree.github.io/ciremai-cashier/admin" target="_blank" rel="noopener noreferrer"><b>zzdree.github.io/ciremai-cashier/admin</b> ↗</a> | Dashboard POS Kasir, antrean live pesanan auto-refresh 4 detik, cetak struk termal 80mm / A4, dan laporan omzet harian *(PIN: `9900`)*. |

---

## ✨ Fitur Utama

- ☀️ **Dual Theme System (Default: Light Mode)** — Tampilan awal ramah mata dengan nuansa gading hangat (*Light Mode* sebagai default) serta opsi *Dark Mode* malam, mematuhi standar aksesibilitas kontras tinggi **WCAG AAA (16:1)** dengan persistensi lokal (`localStorage`).
- 🔔 **Notifikasi Toast Pojok Kanan Bawah** — Seluruh notifikasi aksi (tambah menu, ganti tema, pesanan diambil) ditempatkan presisi di sudut kanan bawah layar agar tidak mengganggu antarmuka utama.
- ⚡ **Antrean Pesanan Real-Time Otomatis** — Pesanan baru pelanggan langsung masuk ke layar kasir melalui sinkronisasi auto-refresh tiap 4 detik dan memicu notifikasi audio *ding* (Web Audio API) tanpa perlu tombol refresh manual.
- 🔢 **Nomor Antrean Global (#N)** — Setiap pesanan pelanggan mendapatkan nomor urut antrean unik yang terus bertambah rapi (`#1, #2, #3, #4...`) melalui PostgreSQL sequence Supabase.
- 🏷️ **Katalog & Filter Kategori Terpadu** — 8 Kategori menu lengkap (*Semua*, *Magelangan*, *Nasi Goreng*, *Nasi Kuning*, *Mie Dokdok*, *Mie Goreng/Rebus*, *Ayam & Crispy*, *Minuman*) sinkron antara halaman pelanggan dan kasir.
- 🛒 **POS Kasir Cepat & Fleksibel** — Konsol kasir modern untuk mengambil pesanan antrean, menambah menu baru, menghitung nominal kembalian otomatis, dan tombol nominal cepat (*quick cash* 10k–100k).
- 💳 **Dukungan Pembayaran Fleksibel** — Tunai (Cash), QRIS, serta opsi pencatatan Piutang/Kasbon.
- 🖨️ **Pencetakan Struk Fleksibel** — Mendukung cetak struk termal 80mm serta stylesheet cetak PDF / kertas A4 1 halaman rapi (`@media print`).
- 📊 **Laporan & Rekap Omzet Harian** — Menghitung total omzet hari ini, transaksi sukses, daftar menu terlaris, serta fitur ekspor laporan ke format CSV/Excel.
- 🔄 **Dual Storage (Cloud + Offline Fallback)** — Terintegrasi dengan database cloud **Supabase** dan otomatis menyimpan cadangan ke **LocalStorage** browser, sehingga kasir tetap dapat beroperasi normal jika jaringan internet terputus.
- 🛡️ **Keepalive Otomatis** — Otomatisasi GitHub Actions berjalan berkala untuk menjaga project database Supabase tetap aktif dan terhindar dari jeda *inactivity*.

---

## 🧱 Struktur Folder Repositori

```text
ciremai-cashier/
├── index.html              → Halaman utama pemesanan pelanggan (katalog menu & checkout)
├── admin.html              → Halaman dashboard Admin & Kasir POS
├── admin/
│   └── index.html          → Rute /admin (redirect bersih ke admin.html)
├── order/
│   └── index.html          → Rute /order (redirect bersih ke index.html + parameter meja)
├── css/
│   └── style.css           → Sistem desain, token tema Light & Dark, antarmuka responsif, & aturan print
├── js/
│   ├── app.js              → Logika interaksi katalog & pemesanan mandiri pelanggan
│   ├── kasir.js            → Logika POS kasir, antrean realtime, audio notifikasi, & laporan
│   ├── db.js               → Modul klien Supabase REST API & RPC sequence
│   ├── store.js            → Pengelola LocalStorage, counter fallback, dan format Rupiah
│   ├── data.js             → Database katalog menu & kategori resmi RM. Ciremai
│   └── config.js           → Konfigurasi warung, PIN kasir, dan kredensial Supabase
├── .github/
│   └── workflows/
│       └── keepalive.yml   → Workflow cron otomatis untuk menjaga database Supabase tetap aktif
├── schema.sql              → Skema PostgreSQL Supabase (tabel transaksi, sequence, & RPC)
├── DESIGN.md               → Dokumentasi lengkap sistem desain & UI/UX guidelines (v1.3)
├── PRD.md                  → Product Requirements Document (v1.3)
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
3. Sesuaikan URL dan Anon Key pada [`js/config.js`](js/config.js).

### 3. Jalankan Aplikasi
Karena aplikasi ini dibuat menggunakan **Vanilla Web Standards (HTML, CSS, JS)** murni tanpa build tools/compiler yang rumit:
- Buka file `index.html` (untuk pelanggan) atau `admin.html` (untuk kasir) langsung di browser.
- Atau gunakan local server seperti VS Code *Live Server* atau `npx serve .`.

---

## 📚 Dokumen Spesifikasi Terkait

- 📄 [Product Requirements Document (PRD.md)](PRD.md) — Dokumen spesifikasi fungsional, arsitektur data, dan roadmap sistem.
- 🎨 [Design System & UI Guidelines (DESIGN.md)](DESIGN.md) — Rujukan palet warna, tipografi, token WCAG AAA, dan tata letak komponen.

---

## 📍 Profil Bisnis

- **Nama Usaha**: RM. Ciremai
- **Menu Utama**: Magelangan, Nasi Goreng, Mie Dokdok, Nasi Kuning, Ayam & Crispy, Minuman Hangat & Dingin
- **Lokasi**: [RM. Ciremai UNNES di Google Maps](https://maps.app.goo.gl/Dzp9H1tu6BkAkfSV8) — Jl. Kalimasada, Sekaran, Kec. Gn. Pati, Kota Semarang, Jawa Tengah 50229
- **Jam Operasional**: Buka 24 Jam Setiap Hari

---

© RM. Ciremai Semarang — Dibuat untuk kecepatan dan kemudahan operasional warung.
