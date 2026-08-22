# PRD — Aplikasi Pencatatan & Pemesanan RM. Ciremai Semarang

| | |
|---|---|
| **Produk** | Ciremai Cashier — Web App POS Kasir & Pemesanan Pelanggan Real-time |
| **Lokasi bisnis** | [RM. Ciremai UNNES](https://maps.app.goo.gl/Dzp9H1tu6BkAkfSV8) — Jl. Kalimasada, Sekaran, Kec. Gn. Pati, Kota Semarang, Jawa Tengah 50229 |
| **Folder proyek** | `C:\ANDREAS\ciremai-cashier` |
| **Deployment target** | GitHub Pages (static hosting gratis) |
| **URL Produksi** | [Order Pelanggan](https://zzdree.github.io/ciremai-cashier/order) · [Admin & POS Kasir](https://zzdree.github.io/ciremai-cashier/admin) |
| **Versi dokumen** | 1.3 — 23 Agustus 2026 |

---

## 1. Latar Belakang

RM. Ciremai adalah warung makan bergaya *burjo* (magelangan, nasi goreng, mie dokdok, nasi kuning, ayam & crispy) yang melayani pelanggan mahasiswa dan umum di sekitar kampus UNNES Semarang.

Sistem digital ini dibuat untuk menyelesaikan kebutuhan utama:
1. **Pencatatan POS Kasir yang Cepat & Akurat** — kalkulasi kembalian otomatis, dukungan tunai/QRIS/kasbon, filter kategori menu terpadu (*Semua*, *Magelangan*, *Nasi Goreng*, *Nasi Kuning*, *Mie Dokdok*, *Mie Goreng/Rebus*, *Ayam & Crispy*, *Minuman*), dan laporan omzet instan.
2. **Pemesanan Mandiri (Self-Order) Pelanggan** — pelanggan memilih menu dari katalog digital, menentukan variasi/opsi bungkus, dan mengirim pesanan langsung ke kasir dengan nomor order urut global `#N`.
3. **Antrean Pesanan Real-Time Otomatis** — kasir menerima pesanan pelanggan secara otomatis melalui polling auto-refresh 4 detik tanpa perlu refresh manual.
4. **Desain Dual Mode (Default: Light Mode)** — tampilan awal ramah mata bernuansa gading hangat (*Light Mode* sebagai default) dengan opsi *Dark Mode* malam, dilengkapi rasio kontras tinggi standar **WCAG AAA (16:1)** dan tombol toggle tema instan di halaman order maupun kasir admin.
5. **Notifikasi Toast Pojok Kanan Bawah** — seluruh umpan balik sistem (toast alert) ditempatkan presisi di sudut kanan bawah layar agar tidak menghalangi alur kerja.

---

## 2. Tujuan & Metrik Sukses

| Tujuan | Metrik | Status |
|---|---|---|
| Transaksi tercatat digital | 100% transaksi tersimpan di Supabase + localStorage | ✅ Tercapai |
| Hitung kembalian cepat & tanpa salah | Validasi uang kurang & kalkulasi otomatis | ✅ Tercapai |
| Pelanggan pesan langsung dari HP | Nomor order global `#N` masuk ke antrean kasir otomatis | ✅ Tercapai |
| Auto-refresh antrean kasir | Pembaruan data tiap 4 detik tanpa tombol manual | ✅ Tercapai |
| Default Light Mode & Dark Mode | Tampilan awal Light Mode + opsi Dark Mode persisten lokal | ✅ Tercapai |
| Kontras Tinggi Standar Aksesibilitas | Rasio kontras 16:1 (WCAG AAA) pada teks & garis pemisah | ✅ Tercapai |
| Struk rapi 1 halaman | Struk termal 80mm & PDF A4 presisi tanpa halaman berlebih | ✅ Tercapai |

---

## 3. Persona Pengguna

### Persona A — Kasir / Pengelola Warung (`/admin`)
- Menerima pesanan masuk langsung dari antrean real-time (auto-refresh 4 detik).
- Menambah/mengubah item pesanan jika pelanggan menambah pesanan di tempat.
- Menerima pembayaran tunai (*quick money buttons* 10k–100k) / QRIS / piutang (kasbon).
- Cetak struk termal 80mm atau PDF A4 1 halaman rapi.
- Tab navigasi berada di kanan sejajar dengan toggle tema dan tombol logout.
- Tombol logout minimalis berbentuk ikon proteksi melingkar di pojok kanan atas.
- Memantau rekap omzet harian, jumlah transaksi, menu terlaris, dan ekspor CSV/Excel.
- Toggle tema Gelap/Terang langsung dari topbar.

### Persona B — Pelanggan (`/order` atau `/`)
- Buka tautan menu di browser HP atau scan QR.
- Memilih menu per kategori lengkap, menentukan jumlah (stepper), memilih opsi (Makan di Tempat / Bungkus), dan menulis catatan khusus.
- Mengirim pesanan langsung ke kasir dan mendapatkan nomor antrean order urut `#N`.
- Dapat menambah atau mengubah pesanan yang sama secara fleksibel.
- Toggle tema Gelap/Terang di navbar hero tepat di samping tombol Admin (tanpa ikon gerigi).

---

## 4. Ruang Lingkup Sistem

### 4.1 Halaman Pelanggan (`index.html` / `/order`)
- **Header & Navbar**: Brand mark dua baris seragam + Tombol Toggle Tema (🌙/☀️) + Tombol Admin minimalis tanpa ikon gerigi.
- **Katalog Menu**: Dikelompokkan per kategori (*Semua*, *Magelangan*, *Nasi Goreng*, *Nasi Kuning*, *Mie Dokdok*, *Mie Goreng/Rebus*, *Ayam & Crispy*, *Minuman*).
- **Pencarian Cepat & Filter Chip**: Filter kategori interaktif instan.
- **Keranjang Belanja**: Sticky cart bottom bar, stepper jumlah item, hitung total instan.
- **Pengiriman Pesanan**: Pesanan terkirim ke Supabase dengan nomor urut global `#N` dan tersimpan di antrean kasir.
- **Modal Sukses & Opsi Tambah/Ubah**: Pelanggan dapat menambah menu ke pesanan yang sama atau membuat pesanan baru.

### 4.2 Halaman Admin & Kasir (`admin.html` / `/admin`)
- **Proteksi Akses**: Layar kunci PIN kasir aman (konfigurasi di `CONFIG.kasirPin = '9900'`).
- **Topbar Terpadu**: Brand mark dua baris + Navigasi 3 Tab di sisi kanan (POS, Pesanan Masuk, Riwayat) + Tombol Toggle Tema + Tombol Logout Ikon Sederhana.
- **3 Tab Navigasi Utama**:
  1. `🛒 Kasir (POS)`: Konsol POS modern dengan filter kategori chip lengkap, pencarian cepat, input prefix `Rp`, segmented tab bayar (`💵 Tunai` / `📱 QRIS`), preset uang cepat (`10k`–`100k`), kalkulasi kembalian otomatis, dan opsi pencatatan piutang/kasbon.
  2. `📥 Pesanan Masuk`: Antrean pesanan real-time dari pelanggan dengan auto-refresh 4 detik, status pesanan (*baru*, *diproses*, *lunas*), tombol ambil & proses, serta tombol pembatalan pesanan.
  3. `📜 Laporan & Riwayat`: Ringkasan omzet harian, jumlah transaksi, menu terlaris, cetak ulang struk A4, dan ekspor CSV/Excel.
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
│  ├── css/style.css    (Design tokens, dark/light, print A4)  │
│  ├── js/data.js       (Daftar katalog menu & kategori)       │
│  ├── js/config.js     (Konfigurasi warung, PIN, & database)  │
│  ├── js/db.js         (Koneksi Supabase REST API & RPC)      │
│  └── js/store.js      (Local storage manager & format rupiah)│
└──────────────────────────────────────────────────────────────┘
```

### Skema Data (`schema.sql` / Supabase Postgres)

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
  meja        text default '',
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
| F4 | Sinkronisasi Supabase Real-time + Auto-refresh Pesanan 4s | ✅ Selesai |
| F5 | Default Light Mode + Opsi Dark Mode + Rasio Kontras AAA | ✅ Selesai |
| F6 | Notifikasi Toast Presisi di Pojok Kanan Bawah | ✅ Selesai |
| F7 | Cetak Struk PDF A4 1 Halaman Rapi & Termal 80mm | ✅ Selesai |
| F8 | Deployment GitHub Pages + GitHub Actions keepalive | ✅ Selesai |

---

© RM. Ciremai Semarang — Dibuat untuk kecepatan dan kemudahan operasional warung.
