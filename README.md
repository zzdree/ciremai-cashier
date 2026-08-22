# 🍽️ RM. Ciremai — Cashier & Order Web App

Aplikasi kasir (POS) & pemesanan warung modern berbasis web. Pelanggan pesan langsung dari HP melalui QR meja / link tanpa repot, pesanan masuk otomatis ke antrean dashboard admin & kasir secara real-time. Kasir memproses transaksi, melayani penambahan menu, mencatat metode pembayaran (Cash / QRIS kertas), dan mencetak struk thermal / PDF.

---

## 🔗 2 Rute Akses Utama

| Rute | Pengguna | Fungsi |
|---|---|---|
| **`/order`** *(atau `/`)* | 📱 **Pelanggan** | Katalog menu interaktif, keranjang belanja, pilihan makan di tempat / bungkus, dan kirim pesanan langsung ke kasir. |
| **`/admin`** | ⚙️ **Pengelola / Kasir** | Dashboard POS Kasir, antrean pesanan real-time dengan notifikasi suara, kelola menu habis, cetak QR meja, dan laporan omzet harian. |

---

## ✨ Fitur Utama

- **Nomor Order Global (#N)** — Setiap pesanan mendapatkan nomor antrean yang terus bertambah rapi (`#1, #2, #3…`).
- **QR Meja Pintar** — Pelanggan scan QR di meja, menu langsung terbuka dengan nomor meja terisi otomatis.
- **Antrean Real-time & Notifikasi Suara** — Saat pesanan baru masuk dari pembeli, dashboard kasir berbunyi "ding" dan menampilkan kartu pesanan secara instan (via Supabase).
- **Fleksibilitas Kasir** — Kasir dapat mengambil order, menambah/mengubah pesanan pelanggan jika ada tambahan di tempat, lalu memproses pembayaran.
- **Dukungan Pembayaran & Kasbon** — Pembayaran tunai (cash) dengan hitung kembalian cepat, QRIS kertas, atau dicatat sebagai piutang (kasbon).
- **Cetak Struk & Lembar QR Meja (Print Friendly)** — Cetak struk PDF/thermal printer dan cetak seluruh kartu QR meja sekaligus tanpa hambatan.
- **Penyimpanan Ganda (Offline Fallback & Cloud)** — Data tersimpan di localStorage browser dan otomatis tersinkron ke Supabase cloud database.

---

## 🧱 Struktur Folder Repo

```text
├── admin.html          → Halaman dashboard Admin & Kasir (POS, antrean, menu, laporan, QR meja)
├── index.html          → Halaman pemesanan Pelanggan (katalog & checkout)
├── admin/
│   └── index.html      → Route /admin (redirect bersih ke admin.html)
├── order/
│   └── index.html      → Route /order (redirect bersih ke index.html + menjaga query ?meja=N)
├── css/
│   └── style.css       → Design system & styling responsif + print stylesheet
├── js/
│   ├── app.js          → Logika aplikasi pemesanan pelanggan
│   ├── kasir.js        → Logika dashboard POS kasir & manajemen
│   ├── db.js           → Komunikasi Supabase REST API & RPC
│   ├── store.js        → Local storage manager, counter & format rupiah
│   ├── data.js         → Daftar katalog menu & harga default RM. Ciremai
│   └── config.js       → Konfigurasi warung, PIN kasir, meja, dan credentials Supabase
├── DESIGN.md           → Dokumentasi panduan desain antarmuka
├── PRD.md              → Product Requirements Document
└── schema.sql          → Skema database Supabase PostgreSQL lengkap
```

---

## ⚙️ Setup & Menjalankan Lokal

1. Clone repositori ini:
   ```bash
   git clone https://github.com/zzdree/ciremai-cashier.git
   ```
2. Sesuaikan konfigurasi di `js/config.js` jika diperlukan.
3. Buka `index.html` (untuk pelanggan) atau `admin.html` (untuk kasir) langsung di browser atau gunakan server lokal seperti Live Server / `npx serve`.

---

© RM. Ciremai Semarang — Dibuat untuk kecepatan dan kemudahan operasional warung.
