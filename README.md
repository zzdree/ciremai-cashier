# 🍛 RM. Ciremai Kuningan — Web Kasir & Pemesanan

Website statis untuk pencatatan & pemesanan makanan di RM. Ciremai (Kuningan, Jawa Barat).

## Fitur
- **Katalog pelanggan** (`index.html`) — lihat menu, cari, lalu pesan via WhatsApp.
- **Kasir / POS** (`kasir.html`) — transaksi tunai, struk termal (cetak), riwayat harian, laporan omzet, dan export CSV.
- **Kelola menu habis** — toggle tersedia/habis, otomatis nonaktif di halaman pelanggan (shared via `localStorage`).

## Struktur
```
index.html        Halaman pelanggan (katalog + pesan WA)
kasir.html        Halaman kasir / POS
css/style.css     Design system
js/
  config.js       Info warung & nomor WhatsApp (edit di sini)
  data.js         Daftar menu & harga
  store.js        Helper localStorage (keranjang, transaksi, counter)
  app.js          Logika halaman pelanggan
  kasir.js        Logika halaman kasir
PRD.md            Product Requirements Document
```

## Cara Pakai (Lokal)
Buka `index.html` di browser. Untuk kasir, buka `kasir.html`.
Data transaksi & status menu tersimpan di `localStorage` per-browser (belum tersinkron antar perangkat).

## Konfigurasi
Edit `js/config.js`:
- `waNomor` — nomor WhatsApp tujuan pesanan (format internasional tanpa `+`).
- `jamBuka`, `alamat`, `gmapsUrl` — info warung.

## Deploy
Dideploy otomatis ke GitHub Pages dari branch `main` (root).
▶ https://zzdree.github.io/ciremai-cashier/

---
Dibuat dengan 🔥 oleh [@zzdree](https://github.com/zzdree).
