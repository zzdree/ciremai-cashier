# PRD — Aplikasi Pencatatan & Pemesanan RM. Ciremai Semarang

| | |
|---|---|
| **Produk** | Ciremai Cashier — web app pencatatan penjualan (POS) + pemesanan pelanggan |
| **Lokasi bisnis** | [RM. Ciremai UNNES](https://www.google.com/maps/search/?api=1&query=RM%20Ciremai%20UNNES%20Semarang) — Kampus UNNES, Sekaran, Gunungpati, Kota Semarang |
| **Folder proyek** | `C:\ANDREAS\ciremai-cashier` |
| **Deployment target** | GitHub Pages (static hosting, gratis) |
| **Versi dokumen** | 1.0 — 22 Agustus 2026 |

---

## 1. Latar Belakang

RM. Ciremai adalah warung makan bergaya *burjo* (magelangan, nasi goreng, mie dokdok) yang saat ini mencatat pesanan dan uang secara manual. Masalah yang ingin diselesaikan:

1. **Pencatatan tidak rapi** — omzet harian sulit diketahui akurat, rawan salah hitung kembalian.
2. **Pesanan pelanggan** belum ada kanal digital — pelanggan harus datang/menelepon.
3. **Info menu** hanya ada di banner fisik — tidak bisa diakses dari HP.

## 2. Tujuan & Metrik Sukses

| Tujuan | Metrik |
|---|---|
| Semua transaksi tercatat digital | 100% transaksi lewat kasir dalam 1 minggu |
| Ketepatan hitung kembalian | 0 keluhan salah hitung |
| Pelanggan bisa lihat menu & pesan dari HP | Link menu dibagikan (QR di meja/banner) |
| Pemilik tahu omzet harian | Laporan harian tersedia 1 klik |

## 3. Pengguna

### Persona A — Petugas Kasir (pemilik/staff)
- Input pesanan pelanggan yang datang langsung (dine-in / bungkus).
- Terima uang tunai, hitung kembalian, cetak/beri struk.
- Lihat riwayat transaksi & rekap omzet hari itu.

### Persona B — Pelanggan
- Buka halaman menu dari HP (via link/QR).
- Pilih menu, isi nama & catatan, kirim pesanan via **WhatsApp** ke warung.

## 4. Ruang Lingkup (v1 / MVP)

### 4.1 Halaman Pelanggan (`index.html`)
- **Katalog menu** dikelompokkan per kategori: Magelangan, Nasi Goreng, Mie Dokdok, Minuman.
- Pencarian menu + filter chip kategori.
- Item **habis** (ditandai kasir) tampil nonaktif.
- **Keranjang**: ubah qty, hapus item, subtotal realtime.
- **Checkout**: form nama pemesan, tipe pesanan (Makan di Tempat / Bungkus), catatan → tombol **"Pesan via WhatsApp"** membuka `wa.me` dengan rincian pesanan terformat.
- Info warung: alamat + link Google Maps, jam buka.

### 4.2 Halaman Kasir (`kasir.html`) — POS
- Grid menu + pencarian + filter kategori (sama seperti pelanggan).
- Panel keranjang: qty ±, hapus, **diskon nominal**, total.
- **Pembayaran tunai**: input uang diterima + tombol cepat (uang pas / 20rb / 50rb / 100rb) → kembalian otomatis; validasi uang kurang.
- **Simpan transaksi** ke `localStorage` dengan ID unik harian (`TRX-YYYYMMDD-NNN`).
- **Struk**: pratinjau + cetak (layout termal 58–80mm via `window.print()`).
- **Riwayat**: daftar transaksi hari ini, klik untuk cetak ulang struk.
- **Laporan harian**: total omzet, jumlah transaksi, item terlaris, ekspor **CSV**.
- **Kelola menu**: toggle *Habis/Tersedia* per item — tersimpan & tercermin di halaman pelanggan.

### 4.3 Di Luar Scope v1 (Non-goals)
- Pembayaran QRIS/e-wallet terintegrasi (hanya catatan "tunai").
- Sinkronisasi real-time pesanan WA → kasir (butuh backend; v2 via Supabase).
- Multi outlet, manajemen stok bahan baku, akun/login multi-user.
- Antar (delivery) dengan kurir.

## 5. Arsitektur Teknis

```
┌─────────────────────────────────────────────┐
│              Static Web App                  │
│  index.html ──► js/app.js   (Pelanggan)      │
│  kasir.html ──► js/kasir.js (POS Kasir)      │
│        └── shared: css/style.css             │
│                   js/config.js  (profil)     │
│                   js/data.js    (menu)       │
│                   js/store.js   (localStorage)│
└─────────────────────────────────────────────┘
Deploy: GitHub Pages (branch main, folder root)
```

- **Stack**: HTML5 + Vanilla CSS + Vanilla JS. Tanpa framework, tanpa build step, tanpa server.
- **Persistensi**: `localStorage` per perangkat/browser.
  - `ciremai_menu_habis` — daftar ID menu yang habis (diset kasir).
  - `ciremai_trx` — array transaksi (kasir).
  - `ciremai_counter` — nomor urut harian transaksi.
- **Komunikasi pesanan pelanggan**: deep-link WhatsApp (`https://wa.me/<nomor>?text=...`).

### Data Model

```ts
MenuItem    { id: string, nama: string, harga: number, kat: "magelangan"|"nasi-goreng"|"mie-dokdok"|"minuman", desc?: string }
Transaction { id: string, ts: ISOString, items: {id,nama,harga,qty}[], subtotal, diskon, total, bayar, kembalian }
```

## 6. Data Menu (dari banner, 22 Agustus 2026)

### Makanan

**Magelangan**
| Item | Harga |
|---|---|
| Magelangan Telur | Rp 15.000 |
| Magelangan Ayam | Rp 19.000 |
| Magelangan Sosis | Rp 17.000 |
| Magelangan Baso | Rp 17.000 |
| Magelangan Complete | Rp 22.000 |

**Nasi Goreng**
| Item | Harga |
|---|---|
| Nasi Goreng Telur | Rp 13.000 |
| Nasi Goreng Ayam | Rp 18.000 |
| Nasi Goreng Sosis | Rp 15.000 |
| Nasi Goreng Baso | Rp 15.000 |
| Nasi Goreng Complete | Rp 21.000 |

**Mie Dokdok**
| Item | Harga |
|---|---|
| Mie Dokdok Telur | Rp 13.000 |
| Mie Dokdok Ayam | Rp 17.000 |
| Mie Dokdok Sosis | Rp 15.000 |
| Mie Dokdok Baso | Rp 15.000 |
| Mie Dokdok Complete | Rp 19.000 |

### Minuman *(harga standar warung kopi/burjo — dapat diedit di `js/data.js`)*

| Item | Harga |
|---|---|
| Air Es | Rp 1.000 |
| Es Teh Manis / Teh Panas | Rp 3.000 |
| Nutrisari / Es Jeruk | Rp 4.000 |
| Kopi Hitam | Rp 5.000 |
| Kopi Susu | Rp 5.000 |
| Capucino | Rp 5.000 |
| Susu Putih / Susu Coklat | Rp 5.000 |
| Extra Joss | Rp 5.000 |
| Good Day | Rp 6.000 |
| Milo | Rp 6.000 |

## 7. Desain

- **Nuansa**: hangat ala gerobak malam Indonesia — krem (`#FBF7EF`), merah bara (`#C43C12`), hijau gunung Ciremai (`#27553B`), emas (`#E9A23B`).
- **Tipografi**: Fraunces (display/judul) + Plus Jakarta Sans (UI/body) — Google Fonts.
- **Mobile-first**: halaman pelanggan dioptimalkan untuk HP; bar keranjang menempel di bawah layar.
- **Struk cetak**: gaya struk termal (font mono, lebar ~300px).

## 8. Milestone

| Fase | Deliverable | Status |
|---|---|---|
| F1 | PRD + struktur proyek + aset ilustrasi | ✅ |
| F2 | Halaman pelanggan (katalog, keranjang, checkout WA) | 🔨 |
| F3 | Halaman kasir (POS, struk, riwayat, laporan CSV) | 🔨 |
| F4 | Uji lokal + push ke GitHub + aktifkan Pages | ⏳ |

## 9. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Data hilang jika browser/cache dibersihkan | Ekspor CSV harian; backup otomatis v2 (Supabase) |
| Nomor WA belum ada | Config terpusat `js/config.js`, mudah diganti |
| Pesanan WA tidak masuk sistem kasir | Kasir meng-input ulang pesanan WA sebagai transaksi (v2: sinkron otomatis) |
| localStorage terikat perangkat | Kasir tetap 1 perangkat khusus |

## 10. Keputusan Terbuka

- [x] Jam buka: **buka 24 jam**, setiap hari (konfirmasi pemilik).
- [x] Alamat lengkap: **Kampus UNNES, Sekaran, Gunungpati, Kota Semarang** (konfirmasi pemilik).
- [ ] Nomor WhatsApp resmi warung — tidak dipakai lagi (pesanan langsung masuk kasir).
