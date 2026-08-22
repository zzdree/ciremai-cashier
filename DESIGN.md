# 🎨 DESIGN.md — RM. Ciremai Cashier

Dokumen ini merangkum **sistem desain** aplikasi kasir & pemesanan RM. Ciremai.
Dibuat sebagai rujukan agar UI/UX konsisten, rapi, dan menyenangkan dipakai
oleh kasir maupun pelanggan.

> **Referensi visual:** terinspirasi dari tren *cashier / POS UI* di Dribbble
> (https://dribbble.com/search/cashier-ui-design) — mengambil **prinsip**
> (clean, card-based, high-contrast, thumb-friendly), BUKAN menyalin kode.

---

## 1. Design Principles

1. **Function over fluff.** Setiap layar melayani tugas kasir yang cepat:
   tambah item → bayar → struk. Tidak ada elemen dekoratif yang menghambat.
2. **Thumb-friendly.** Tombol utama ≥ 48px, jarak antar-elemen cukup lebar
   supaya bisa ditekan pakai jempol di HP kasir.
3. **High contrast & legible.** Teks harga selalu tebal & kontras tinggi
   (merah/emu pada krem).
4. **Consistent visual language.** Satu set warna, radius, shadow, dan font
   dipakai di semua halaman.
5. **Feedback instan.** Toast, hover, dan transisi mikro memberi tahu aksi
   pengguna telah terjadi.
6. **Offline-first.** Antarmuka tetap utuh walau jaringan putus (data lokal).

---

## 2. Brand & Color Palette

Diambil dari warna khas warung (krem nasi goreng + merah cabai + emas):

| Token | Nilai | Penggunaan |
|-------|-------|-----------|
| `--cream` | `#FBF7EF` | Background utama (hangat, bersih) |
| `--red` | `#E23B2E` | Aksen utama: harga, tombol bayar, brand |
| `--gold` | `#E8A33D` | Aksen sekunder: hover, highlight menu |
| `--ink` | `#2B2622` | Teks utama |
| `--ink-soft` | `#7A7068` | Teks sekunder / placeholder |
| `--paper` | `#FFFFFF` | Kartu / panel di atas cream |
| `--line` | `#ECE3D5` | Border / pemisah |
| `--shadow` | `0 2px 10px rgba(0,0,0,.06)` | Elevasi kartu |
| `--shadow-lg` | `0 8px 24px rgba(0,0,0,.10)` | Hover kartu |

**Aturan:** Maksimal 1 warna aksen per layar. Jangan gunakan gradient norak
atau neon.

---

## 3. Typography

| Peran | Font | Berat | Catatan |
|-------|------|-------|--------|
| Display / Judul | **Fraunces** | 600–700 | Serif hangat, kesan "warung rumahan premium" |
| Body / UI | **Plus Jakarta Sans** | 400–800 | Sans modern, sangat legible di layar kecil |

- Ukuran dasar: `16px`, skala modular (1.25).
- Harga & angka penting: **bold**, warna `--red`.
- Hindari teks miring panjang; gunakan *weight* untuk penekanan.

---

## 4. Layout & Spacing

- **Grid:** 1 kolom di mobile, 2–3 kolom di layar ≥ 900px.
- **Spacing base:** 8px (8/16/24/32/48).
- **Radius:** `--radius: 14px` (kartu), `999px` (pill/chip/tombol bulat).
- **Max content width:** 1100px, centered.
- **Sticky elements:** search bar (pelanggan) & cart bar (bawah layar).

---

## 5. Components

### 5.1 Kartu Menu (Menu Card)
- Baris horizontal: emoji (52px) · nama + harga · stepper (jika di keranjang).
- State: `default`, `hover` (naik 3px + border emas), `soldout` (abu + tag "Habis").
- Aksesibilitas: `role="button"`, `tabindex`, bisa dipencet Enter/Space.

### 5.2 Stepper (Qty)
- Bulat merah: `−` [n] `+`. Ukuran tombol ≥ 40px.
- Muncul inline di kartu saat item masuk keranjang.

### 5.3 Cart Bar (Pelanggan)
- Sticky di bawah: ringkasan jumlah & total + tombol "Pesan via WA".
- Menghilang saat keranjang kosong.

### 5.4 Modal
- Backdrop gelap 50%, panel putih rounded, scroll body terkunci saat terbuka.
- Tutup via tombol ✕, klik luar, atau tombol **Esc**.

### 5.5 Struk / Receipt (Thermal)
- Lebar ~300px, font monospace, hitam di atas putih.
- Garis pemisah `----`, rata tengah untuk header/footer.
- Tombol "Cetak" → `window.print()` dengan CSS `@media print` khusus.

### 5.6 Tabs (Admin & Kasir)
- 5 tab terpadu:
  1. `🛒 Kasir (POS)` — Panel transaksi walk-in & hitung kembalian cepat.
  2. `📥 Pesanan Masuk` — Antrean pesanan live pelanggan + notifikasi audio.
  3. `📜 Laporan & Riwayat` — Riwayat harian, ekspor CSV, dan menu terlaris.
  4. `📋 Kelola Menu` — Toggle status ketersediaan stok habis/tersedia.
  5. `🔳 Cetak QR Meja` — Generator & cetak 10 kartu QR meja.
- Tab aktif ditandai underline merah + font tebal. Hanya 1 view yang tampil dalam satu waktu.

### 5.7 Quick Cash Buttons
- Nominal pas / 10rb / 20rb / 50rb / 100rb. Mempercepat input uang tunai tanpa perlu mengetik manual.

### 5.8 Toast
- Muncul di bawah layar, auto-hide 2.2 detik, background gelap + teks putih + ikon status.

---

## 6. States & Feedback

| State | Penanganan |
|-------|-----------|
| Loading | Data lokal instan; status sync Supabase non-blocking di background |
| Empty | Ilustrasi emoji + teks informatif "Belum ada transaksi hari ini" / "Belum ada pesanan masuk" |
| Sold out | Kartu abu + tag "Habis", stepper terkunci & tidak bisa dipesan pelanggan |
| Error (bayar kurang) | Notifikasi nominal kurang, tombol bayar disabled |
| Success | Modal struk + toast feedback interaktif |

---

## 7. Responsive Behavior

| Breakpoint | Perilaku |
|-----------|----------|
| < 600px | 1 kolom, cart sticky bawah, panel kasir static |
| 600–899px | 2 kolom menu, adaptasi flex layout |
| ≥ 900px | 3 kolom menu, cart panel kasir sticky kanan (`top: 82px`) |

---

## 8. Inspirasi Dribbble → Adaptasi

| Tren Dribbble | Implementasi Aktual |
|---------------|---------------------|
| Card-based menu grid | ✅ Kartu menu horizontal berbayang lembut & micro-animation |
| Large touch targets | ✅ Tombol ≥ 48px, stepper besar ramah jempol |
| Bold price hierarchy | ✅ Harga merah tebal & kontras tinggi |
| Minimal top bar | ✅ Header ramping, brand badge, dan tab navigasi terintegrasi |
| Receipt-style detail | ✅ Struk monospace thermal bersih |
| Soft neutral palette | ✅ Cream (`#FBF7EF`) + merah cabai (`#E23B2E`) + emas (`#E8A33D`) |

---

## 9. Accessibility

- Kontras warna memenuhi standar WCAG AA.
- Semua elemen interaktif dapat diakses keyboard (Tab/Enter/Esc).
- `aria-label` disematkan pada tombol ikon, close button, dan toggle mute audio.
- `prefers-reduced-motion` dihormati.

---

## 10. Do's & Don'ts

**✅ Do:**
- Pakai token warna resmi dari `:root`.
- Jaga jarak antar elemen (grid kelipatan 8px).
- Berikan audio & visual feedback instan pada tiap interaksi pengguna.

**❌ Don't:**
- Jangan gunakan warna di luar palette warung tanpa alasan fungsional.
- Jangan membuat target sentuh < 44px.
- Jangan memecah rute admin dan kasir karena keduanya adalah satu kesatuan dashboard.

---

## 11. Fitur QR Code Meja

Pelanggan scan QR di meja → langsung membuka katalog `/order` dengan nomor meja terdeteksi otomatis.

- **URL:** `/order?meja=N` → badge "🪑 Meja N" muncul di hero, dan nomor meja otomatis tersimpan pada payload pesanan.
- **Generator (Admin):** Tab **Cetak QR Meja** merender N kartu QR via CDN `api.qrserver.com`.
- **Print Layout:** Tombol "Cetak Semua QR" → `@media print` menyembunyikan semua elemen lain, grid diformat 3 kolom per halaman, dan kartu tidak terpotong (`break-inside: avoid`).
- **Konfigurasi:** `CONFIG.jumlahMeja` (default 10) + `CONFIG.mejaUrl(no)`.

---

## 12. Alur Pencatatan & Pemesanan Real-time

### 12.1 Dua Pintu Masuk
1. **Pelanggan (`/order` atau `/`)** — Memilih menu, menentukan jumlah & catatan, lalu mengirim pesanan langsung ke kasir. Pesanan mendapatkan nomor antrean order `#N` dan tersimpan ke Supabase (`status=baru`, `origin=app`).
2. **Kasir Walk-in (`/admin`)** — Untuk pelanggan yang memesan langsung di kasir; kasir memilih menu pada panel kasir POS dan memproses pembayaran seketika.

### 12.2 Antrean Kasir Live
- Tab **📥 Pesanan Masuk** menampilkan semua order berstatus `baru` atau `diproses`.
- Terdapat notifikasi suara *ding* saat pesanan baru masuk secara otomatis.
- Tombol **➡️ Ambil & Proses** mengisi keranjang kasir dengan rincian order, mengubah status menjadi `diproses`, dan membuka tab POS kasir untuk penambahan menu jika diperlukan.
- Tombol **✕ Batalkan** untuk menolak pesanan yang dibatalkan pelanggan.

### 12.3 Pembayaran & Konfirmasi
- Pilihan metode: **💵 Cash** atau **📱 QRIS** (kertas fisik warung).
- Opsi **Piutang / Kasbon** untuk pesanan yang belum dibayar lunas.
- Modal konfirmasi memastikan kebenaran nominal dan rincian sebelum transaksi dicatat.
- Transaksi otomatis tersimpan ke Supabase dan localStorage, serta memperbarui antrean secara instan.

### 12.4 Cetak Struk (Thermal / PDF)
- Tombol **🖨️ Cetak Struk (PDF)** memanggil `window.print()`.
- Rule `@media print` khusus memastikan hanya struk belanja yang tercetak tanpa header/tombol antarmuka web.

---

## 13. Skema Data Terpadu (`transaksi`)

```sql
transaksi (
  id, no, ts, items[], subtotal, diskon, total, bayar, kembalian,
  nama, meja, catatan, order_type, metode (cash|qris),
  status (baru|diproses|lunas|piutang|batal), origin (app|kasir), updated_at
)
```

_Dokumen living — selalu diselaraskan bersama evolusi fitur repositori._
