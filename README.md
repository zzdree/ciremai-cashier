# 🍽️ RM. Ciremai — Cashier Web App

Aplikasi kasir & pemesanan warung sederhana. Pelanggan pesan dari HP, langsung masuk ke antrian kasir secara otomatis (tanpa WhatsApp). Kasir melayani, menambah item jika kurang, mencatat pembayaran (cash / QRIS kertas), dan mencetak struk PDF.

## 🔗 3 Link Utama

| Tujuan | URL |
|--------|-----|
| **Pembeli (katalog & order)** | https://zzdree.github.io/ciremai-cashier/ |
| **Pembeli (order)** | https://zzdree.github.io/ciremai-cashier/order |
| **Kasir / Admin** | https://zzdree.github.io/ciremai-cashier/admin |

> `/` dan `/order` sama-sama mengarah ke halaman pembeli. `/admin` mengarah ke halaman kasir.

## ✨ Fitur

- **Nomor order global** — setiap pesanan dapat nomor urut `#1, #2, #3…` yang terus naik selamanya (tidak reset per hari).
- **Tanpa nama & meja** — pelanggan tinggal duduk; tidak perlu input nama/meja.
- **Sinkron real-time ke kasir** — pesanan masuk langsung ke tab *Pesanan* di halaman kasir (via Supabase).
- **Kasir bisa tambah item** — jika pesanan kurang, kasir tambahkan langsung dari keranjang.
- **Pembayaran** — cash atau QRIS (kertas fisik di warung, bukan fitur digital). Bisa dibayar sekarang atau nanti (piutang).
- **Struk PDF** — cetak struk langsung dari browser (Ctrl/Cmd+P).
- **Pencatatan ke DB** — semua transaksi tersimpan di Supabase.

## 🧱 Struktur

```
index.html        → Halaman pembeli (katalog + checkout)
kasir.html        → Halaman kasir (POS + antrian pesanan)
admin/index.html  → Redirect ke kasir.html
kosong/index.html → Redirect ke index.html (pembeli)
order/index.html  → Redirect ke index.html (pembeli)
js/               → app.js (pembeli), kasir.js (POS), db.js, store.js, data.js, config.js
css/style.css     → Semua styling
```

## ⚙️ Setup Lokal

1. Clone repo.
2. Edit `js/config.js` → isi `supabase.url` & `supabase.anonKey`.
3. Jalankan migrasi SQL (sequence + RPC `next_order_no`) di Supabase SQL Editor:
   - `supabase-order-no.sql`
4. Buka `index.html` atau `kasir.html` di browser.

## 🗄️ Database

Tabel `transaksi` (Supabase Postgres) dengan kolom: `id`, `no` (nomor urut global), `ts`, `items`, `subtotal`, `total`, `bayar`, `kembalian`, `catatan`, `order_type`, `metode`, `status`, `origin`, `updated_at`.

RPC `next_order_no()` → mengambil `nextval('order_no_seq')` (+1 selamanya).

## ☁️ Deployment

Hosting via **GitHub Pages** (branch `main`). Setiap push otomatis terdeploy. Supabase dijaga agar tidak terpause melalui GitHub Actions keepalive ping harian.

---

© RM. Ciremai — Aplikasi kasir warung sederhana.
