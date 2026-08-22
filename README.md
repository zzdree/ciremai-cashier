# 🍛 RM. Ciremai Kuningan — Kasir & Pemesanan

> Kasir ringan buat warung nasi goreng. Buka di HP kasir, catat transaksi, cetak struk, lihat laporan. Tanpa install, tanpa server.

[![Deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-ef4444)](https://zzdree.github.io/ciremai-cashier/)
[![Status](https://img.shields.io/badge/license-Private-red)]()
[![Stack](https://img.shields.io/badge/stack-vanilla%20JS-22c55e)]()

**▶ Live:** https://zzdree.github.io/ciremai-cashier/

---

## ✨ Kenapa ini keren?

- **Nol install.** Cukup buka di browser — di HP, tablet, atau PC kasir.
- **Mode ganda.**
  - 🛒 **Pelanggan** (`index.html`) — lihat menu, cari cepat, lalu pesan langsung ke WhatsApp warung.
  - 💵 **Kasir** (`kasir.html`) — transaksi tunai, struk termal yang bisa dicetak, riwayat harian, laporan omzet, export CSV.
- **Menu "habis" otomatis.** Tandai menu habis di kasir → langsung nonaktif di halaman pelanggan.
- **Simpan lokal.** Data tetap aman di browser (localStorage) walau offline.
- **Sinker cloud (opsional).** Mau data masuk ke semua HP kasir? Aktifkan Supabase — gratis.

---

## 🚀 Cara Pakai

| Keperluan | Buka |
|-----------|------|
| Lihat menu & pesan | `index.html` |
| Kasir / POS | `kasir.html` |

Bisa di-double-click langsung, atau buka lewat link di atas.

---

## 🗂️ Struktur

```
ciremai-cashier/
├─ index.html      Tampilan Pelanggan (katalog + order WA)
├─ kasir.html      Tampilan Kasir (POS + riwayat + laporan)
├─ css/style.css   Design system
├─ js/
│  ├─ config.js    Info warung & nomor WA  ← EDIT DI SINI
│  ├─ data.js      Daftar menu & harga
│  ├─ store.js     Helper localStorage
│  ├─ app.js       Logika Pelanggan
│  └─ kasir.js     Logika Kasir
├─ images/         Favicon
├─ PRD.md          Dokumen kebutuhan produk
└─ LICENSE         Hak cipta privat
```

---

## ⚙️ Konfigurasi

Edit `js/config.js`:

```js
const CONFIG = {
  namaWarung: 'RM. Ciremai',
  waNomor: '62812xxxxxxx',   // nomor WA tujuan pesanan (tanpa +)
  jamBuka: 'Setiap hari · 16.00 – 02.00 WIB',
  alamat: 'Jl. Raya Ciremai, Kuningan, Jawa Barat',
  gmapsUrl: 'https://maps.app.goo.gl/...',
};
```

---

## ☁️ Database Cloud (Gratis — Supabase)

Secara default data hanya di **localStorage** (per-browser). Mau semua HP kasir
sinkron? Pakai **Supabase** (free tier, tanpa kartu kredit):

1. Buat project di https://supabase.com → **SQL Editor** → jalankan:
   ```sql
   create table transaksi (
     id text primary key,
     ts timestamptz not null,
     items jsonb not null,
     subtotal int not null,
     diskon int default 0,
     total int not null,
     bayar int not null,
     kembalian int not null
   );
   ```
2. **Settings → API** → salin `URL` & `anon key`.
3. Masukkan ke `js/config.js`:
   ```js
   supabase: {
     url: 'https://xxxx.supabase.co',
     key: 'eyJhbGci...',
     enabled: true
   }
   ```
4. Transaksi otomatis tersimpan ke cloud & bisa di-rekap lintas perangkat.

> Nonaktifkan dengan `supabase.enabled = false` untuk kembali ke mode lokal.

---

## 📊 Laporan

Di halaman kasir → tab **Riwayat**: lihat omzet harian, item terlaris, dan
export ke CSV untuk rekap Excel.

---

## 🔐 Lisensi

Proprietary / Private. Seluruh kode milik **RM. Ciremai Kuningan**.
Lihat `LICENSE`.

---

Dibuat dengan 🔥 oleh [@zzdree](https://github.com/zzdree).
