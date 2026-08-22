# 🍛 RM. Ciremai Kuningan — Kasir & Pemesanan

> Kasir ringan buat warung nasi goreng. Buka di HP kasir, catat transaksi, cetak struk, lihat laporan. Tanpa install, tanpa server.

[![Deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-ef4444)](https://zzdree.github.io/ciremai-cashier/)
[![Status](https://img.shields.io/badge/license-Private-red)]()
[![Stack](https://img.shields.io/badge/stack-vanilla%20JS-22c55e)]()
[![DB](https://img.shields.io/badge/db-Supabase-3ecf8e)]()

**▶ Live Web:** https://zzdree.github.io/ciremai-cashier/
**📍 Lokasi:** Kuningan, Jawa Barat · [Google Maps](https://maps.app.goo.gl/fteodwrCPNJeU1GJ9)
**🕒 Jam Buka:** Setiap hari · 16.00 – 02.00 WIB

---

## 🏪 Tentang

**RM. Ciremai** adalah warung makanan khas Kuningan, Jawa Barat yang menyajikan
**magelangan, nasi goreng, dan mie dokdok** dengan pilihan topping telur, ayam,
sosis, baso, maupun *complete*. Web ini dibuat untuk memudahkan pencatatan
transaksi harian dan pemesanan pelanggan — dari layar HP kasir hingga order
WhatsApp.

Dibangun tanpa framework dan tanpa backend rumit: murni HTML, CSS, dan JavaScript
yang di-deploy gratis ke GitHub Pages, dengan opsi sinkronisasi cloud via Supabase
supaya data kasir bisa diakses lintas perangkat.

---

## ✨ Kenapa ini keren?

- **Nol install.** Cukup buka di browser — di HP, tablet, atau PC kasir.
- **Mode ganda.**
  - 🛒 **Pelanggan** (`index.html`) — lihat menu, cari cepat, lalu pesan langsung ke WhatsApp warung.
  - 💵 **Kasir** (`kasir.html`) — transaksi tunai, struk termal yang bisa dicetak, riwayat harian, laporan omzet, export CSV.
- **Menu "habis" otomatis.** Tandai menu habis di kasir → langsung nonaktif di halaman pelanggan.
- **Simpan lokal.** Data tetap aman di browser (localStorage) walau offline.
- **Sinkron cloud (opsional).** Aktifkan Supabase → transaksi masuk ke semua HP kasir (gratis).
- **QR code meja.** Kasir cetak QR per meja → pelanggan scan, langsung buka menu & nomor meja otomatis masuk ke pesanan WhatsApp.

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
│  ├─ db.js        Sync cloud (Supabase, opt-in)
│  ├─ app.js       Logika Pelanggan
│  └─ kasir.js     Logika Kasir
├─ setup-db.ps1   Script bantu buat tabel Supabase
├─ images/         Favicon
├─ PRD.md          Dokumen kebutuhan produk
├─ DESIGN.md       Sistem desain UI/UX terpusat
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
  supabase: { enabled: false, url: '', key: '' },
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
3. Masukkan ke `js/config.js`: `supabase: { enabled: true, url, key }`.
4. Transaksi otomatis tersimpan ke cloud & bisa di-rekap lintas perangkat.

> Nonaktifkan dengan `supabase.enabled = false` untuk kembali ke mode lokal.

---

## 📊 Laporan

Di halaman kasir → tab **Riwayat**: lihat omzet harian, item terlaris, dan
export ke CSV untuk rekap Excel.

---

## 🧰 Tech Stack

- **Frontend:** HTML5 · CSS3 (vanilla) · JavaScript ES6 (vanilla, tanpa build)
- **Storage lokal:** `localStorage` (Web Storage API)
- **Storage cloud:** Supabase (Postgres + REST API)
- **Hosting:** GitHub Pages (static)
- **Lainnya:** Tidak ada dependency / npm package

---

## 🔐 Lisensi

**Proprietary / Private.** Seluruh kode, desain, dan aset milik **RM. Ciremai
Kuningan**. Tidak diperbolehkan menyebarluaskan atau digunakan untuk pihak lain
tanpa izin. Lihat `LICENSE`.

---

Dibuat dengan 🔥 oleh [@zzdree](https://github.com/zzdree).
