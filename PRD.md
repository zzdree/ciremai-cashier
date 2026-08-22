# PRD — Aplikasi Pencatatan & Pemesanan RM. Ciremai Semarang

| | |
|---|---|
| **Produk** | Ciremai Cashier — Web App POS Kasir & Pemesanan Pelanggan Real-time |
| **Lokasi bisnis** | [RM. Ciremai UNNES](https://maps.app.goo.gl/Dzp9H1tu6BkAkfSV8) — X93V+8WX, Jl. Kalimasada, Sekaran, Kec. Gn. Pati, Kota Semarang, Jawa Tengah 50229 |
| **Folder proyek** | `C:\ANDREAS\ciremai-cashier` |
| **Deployment target** | GitHub Pages (static hosting gratis) |
| **Versi dokumen** | 1.1 — 23 Agustus 2026 |

---

## 1. Latar Belakang

RM. Ciremai adalah warung makan bergaya *burjo* (magelangan, nasi goreng, mie dokdok) yang melayani pelanggan mahasiswa dan umum di sekitar kampus UNNES Semarang.

Sistem digital ini dibuat untuk menyelesaikan 3 kebutuhan utama:
1. **Pencatatan POS Kasir yang cepat & akurat** — kalkulasi kembalian otomatis, dukungan tunai/QRIS/kasbon, dan laporan omzet instan.
2. **Pemesanan Mandiri (Self-Order) Pelanggan** — pelanggan duduk di meja, scan QR meja, pilih menu, dan kirim pesanan langsung ke antrean kasir tanpa perlu antre di meja kasir.
3. **Katalog Menu Digital 24 Jam** — daftar menu, harga transparan, dan status ketersediaan stok yang selalu tersinkronisasi.

---

## 2. Tujuan & Metrik Sukses

| Tujuan | Metrik | Status |
|---|---|---|
| Transaksi tercatat digital | 100% transaksi tersimpan di Supabase + localStorage | ✅ Tercapai |
| Hitung kembalian cepat & tanpa salah | Validasi uang kurang & kalkulasi otomatis | ✅ Tercapai |
| Pelanggan pesan langsung dari meja | Scan QR meja → nomor order global `#N` masuk kasir | ✅ Tercapai |
| Pemilik & kasir tahu omzet harian | Statistik real-time & download laporan Excel/CSV | ✅ Tercapai |

---

## 3. Persona Pengguna

### Persona A — Kasir / Pengelola Warung (`/admin`)
- Menerima pesanan langsung dari antrean real-time (dengan notifikasi suara *ding*).
- Menambah/mengubah item pesanan jika pelanggan menambah pesanan di tempat.
- Menerima pembayaran tunai (quick money buttons) / QRIS kertas / piutang (kasbon).
- Cetak struk termal/PDF dan cetak lembar kartu QR meja.
- Mengelola ketersediaan stok menu (tandai Habis/Tersedia).
- Memantau rekap omzet, jumlah transaksi, dan menu terlaris hari ini.

### Persona B — Pelanggan (`/order` atau `/`)
- Scan QR code di meja warung atau buka tautan di browser.
- Memilih menu, menentukan jumlah (stepper), memilih opsi (Makan di Tempat / Bungkus), dan menulis catatan khusus (contoh: "pedas manis, jangan pakai sawi").
- Mengirim pesanan langsung ke kasir dan mendapatkan nomor antrean order `#N`.
- Dapat menambah atau mengubah pesanan yang sama secara fleksibel.

---

## 4. Ruang Lingkup Sistem

### 4.1 Halaman Pelanggan (`index.html` / `/order`)
- **Katalog Menu**: Dikelompokkan per kategori (Magelangan, Nasi Goreng, Mie Dokdok, Minuman).
- **Pencarian Cepat & Filter Chip**: Filter kategori interaktif.
- **Deteksi Nomor Meja**: Otomatis mendeteksi parameter `?meja=N` dari QR code meja.
- **Status Stok Real-time**: Menu yang ditandai habis oleh kasir otomatis berstatus nonaktif.
- **Keranjang Belanja**: Sticky cart bottom bar, stepper jumlah item, hitung total instan.
- **Pengiriman Pesanan**: Pesanan terkirim ke Supabase dengan nomor urut global `#N` dan tersimpan di antrean kasir.
- **Modal Sukses & Opsi Tambah/Ubah**: Pelanggan dapat menambah menu ke pesanan yang sama atau membuat pesanan baru.

### 4.2 Halaman Admin & Kasir (`admin.html` / `/admin`)
- **Proteksi Akses**: Layar kunci PIN kasir aman (konfigurasi di `CONFIG.kasirPin`).
- **5 Tab Navigasi Utama**:
  1. `🛒 Kasir (POS)`: Konsol POS modern dengan input prefix `Rp`, segmented tab bayar (`💵 Tunai` / `📱 QRIS`), preset uang cepat (`10k`–`100k`), penyesuaian diskon, kalkulasi kembalian otomatis, dan opsi pencatatan piutang/kasbon.
  2. `📥 Pesanan Masuk`: Antrean pesanan real-time dari pelanggan, notifikasi suara Web Audio API (*ding*), tombol ambil & proses, serta tombol pembatalan pesanan.
  3. `📜 Laporan & Riwayat`: Ringkasan omzet harian, jumlah transaksi, menu terlaris, cetak ulang struk, dan ekspor CSV/Excel.
  4. `📋 Kelola Menu`: Toggle ketersediaan stok (Tersedia / Habis) dengan sinkronisasi ke katalog pelanggan.
  5. `🔳 Cetak QR Meja`: Generator dan cetak lembar kartu QR meja 1–10 secara rapi (print stylesheet 3 kolom).
- **Automasi Infrastruktur**: GitHub Action Keepalive otomatis berjalan setiap 1 jam untuk mencegah jeda (*inactivity pause*) pada database Supabase.

---

## 5. Arsitektur & Struktur Teknis

```text
┌──────────────────────────────────────────────────────────────┐
│                       RM. CIREMAI WEB APP                    │
│                                                              │
│  [Pelanggan]   index.html (/order) ──► js/app.js             │
│  [Admin/Kasir] admin.html (/admin) ──► js/kasir.js           │
│                                                              │
│  Shared Core Modules:                                        │
│  ├── css/style.css    (Design tokens, responsive, & print)   │
│  ├── js/data.js       (Daftar katalog menu & kategori)       │
│  ├── js/config.js     (Konfigurasi warung, PIN, & meja)      │
│  ├── js/db.js         (Koneksi Supabase REST API & RPC)      │
│  └── js/store.js      (Local storage manager & format rupiah)│
└──────────────────────────────────────────────────────────────┘
```

### Data Model (`schema.sql` / Supabase Postgres)

```sql
transaksi (
  id          text primary key,
  no          integer,                -- Nomor order global (#1, #2, #3...)
  ts          timestamptz not null,   -- Timestamp pesanan
  items       jsonb not null,         -- [{ id, nama, harga, qty }]
  subtotal    integer not null,
  diskon      integer default 0,
  total       integer not null,
  bayar       integer not null,
  kembalian   integer not null,
  nama        text default '',
  meja        text default '',        -- Nomor meja (1-10)
  catatan     text default '',        -- Catatan khusus pelanggan
  order_type  text default 'Makan di Tempat', -- 'Makan di Tempat' | 'Bungkus'
  metode      text default 'cash',    -- 'cash' | 'qris'
  status      text default 'baru',    -- 'baru' | 'diproses' | 'lunas' | 'piutang' | 'batal'
  origin      text default 'app',     -- 'app' | 'kasir'
  updated_at  timestamptz default now()
)
```

---

## 6. Status Milestone

| Fase | Deliverable | Status |
|---|---|---|
| F1 | PRD, arsitektur teknis, dan sistem desain | ✅ Selesai |
| F2 | Halaman pemesanan pelanggan (`index.html` & `/order`) | ✅ Selesai |
| F3 | Dashboard Admin & Kasir POS (`admin.html` & `/admin`) | ✅ Selesai |
| F4 | Sinkronisasi Supabase Real-time + Notifikasi Suara | ✅ Selesai |
| F5 | Dukungan Print Struk PDF & Cetak Lembar QR Meja | ✅ Selesai |
| F6 | Deployment GitHub Pages + GitHub Actions keepalive | ✅ Selesai |

---

© RM. Ciremai Semarang — Dibuat untuk kecepatan dan kemudahan operasional warung.
