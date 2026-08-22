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

Diambil dari warna khas warung & alam Jawa Barat (krem nasi liwet + merah cabai rawit + hijau daun Ciremai + emas rempah):

| Token | Nilai | Penggunaan |
|-------|-------|-----------|
| `--cream` | `#F2ECE1` | Background canvas utama (hangat, berdimensi, ramah mata) |
| `--cream-2` | `#E5DCBA` | Background sekunder / badge netral |
| `--paper` | `#FFFFFF` | Permukaan kartu menu, modal, & panel POS (kontras tinggi) |
| `--ink` | `#1C150E` | Teks judul & angka utama (WCAG AAA) |
| `--ink-soft` | `#5C4F44` | Teks sekunder, subtitle, & placeholder |
| `--line` | `#DCD0BD` | Border kartu & garis pemisah halus |
| `--line-strong` | `#C4B49C` | Border tombol & pemisah tegas |
| `--red` | `#B83208` | Aksen utama: harga, badge pesanan, tag peringatan |
| `--red-dark` | `#8F2404` | Hover tombol merah & status kritis |
| `--red-soft` | `#FDECE5` | Latar badge promo, tag kurang, & focus ring |
| `--green` | `#204B33` | Brand navbar/topbar, tombol checkout/bayar utama |
| `--green-soft` | `#E1EBE4` | Latar badge sukses & kembalian pas/lebih |
| `--gold` | `#D9881A` | Aksen brand badge "C", highlight menu, tombol aktif |
| `--gold-soft` | `#FDF3E1` | Wadah emoji kartu menu & rank best-seller |
| `--shadow-sm` | `0 1px 3px rgba(28,21,14,.07)` | Elevasi ringan pada input & chip |
| `--shadow` | `0 4px 16px rgba(28,21,14,.08)` | Elevasi standar kartu menu & panel |
| `--shadow-lg` | `0 12px 36px rgba(28,21,14,.14)` | Hover kartu & modal dialog |

---

## 3. Typography

| Peran | Font | Berat | Catatan |
|-------|------|-------|--------|
| Display / Judul | **Fraunces** | 600–700 | Serif hangat, kesan "warung rumahan premium" |
| Body / UI | **Plus Jakarta Sans** | 400–800 | Sans modern, sangat legible di layar kecil |
| Monospace / Angka POS | **ui-monospace / Consolas** | 700–800 | Angka perhitungan struk & kalkulasi kasir |

- Ukuran dasar: `16px`, skala modular (1.25).
- Harga & angka penting: **bold**, warna `--red`.
- Hindari teks miring panjang; gunakan *weight* untuk penekanan.

---

## 4. Layout & Spacing

- **Grid:** 1 kolom di mobile, 2 kolom tablet, 3 kolom di layar ≥ 900px.
- **Spacing base:** 8px (8/16/24/32/48).
- **Radius:** `--radius: 16px` (kartu & panel), `--radius-sm: 10px` (input & tombol), `999px` (pill/chip/tombol bulat).
- **Max content width:** 1100px, centered body (`display: flex; justify-content: center`).
- **Sticky elements:** Search bar & hero nav (pelanggan), topbar & cart panel (kasir).

---

## 5. Components

### 5.1 Kartu Menu (Menu Card)
- Latar putih murni (`--paper`), wadah emoji dengan warna latar emas rempah (`--gold-soft`), teks nama pekat, dan harga merah tebal.
- State: `default`, `hover` (naik 2px + shadow tegas), `soldout` (abu + badge "Habis").
- Aksesibilitas: `role="button"`, `tabindex`, keyboard-friendly (Enter/Space).

### 5.2 Stepper (Qty)
- Tombol kapsul: `−` [n] `+`. Ukuran tombol ≥ 40px, ramah sentuhan jempol.
- Muncul inline di kartu saat item masuk keranjang.

### 5.3 Cart Bar (Pelanggan)
- Sticky di bawah: ringkasan jumlah & total + tombol "Pesan via WA / Kirim ke Kasir".
- Dilengkapi animasi badge pulse saat ada item baru ditambahkan.

### 5.4 Search Box (`.search-wrap`)
- Input kapsul dengan ikon SVG pencarian presisi di sebelah kiri.
- Berlaku seragam di halaman pelanggan (`#searchInput`) dan halaman kasir (`#posSearch`).

### 5.5 Panel Struk Kasir Terintegrasi (POS Console)
- **Kotak Struk Terpadu (`.pos-calc-card`)**: Satu kesatuan wadah kalkulasi dan instrumen pembayaran.
- **Input Prefix Mata Uang (`.currency-input-wrap`)**: Wadah input modern dengan tag `Rp` terintegrasi untuk diskon dan uang diterima.
- **Highlight Total Akhir (`.total-highlight`)**: Wadah khusus dengan teks kapital tegas dan nominal Fraunces tebal.
- **Segmented Method Tabs (`.metode-segmented`)**: Pilihan `💵 Tunai` dan `📱 QRIS` berbentuk tombol tab taktil.
- **Preset Uang Cepat (`.money-btn`)**: Pilihan cepat `Uang Pas`, `10k`, `20k`, `50k`, `100k`.
- **Card Status Kembalian & Kasbon**: Badge hijau saat uang pas/kembalian, merah saat kurang, dan kartu putus-putus untuk piutang/kasbon.

### 5.6 Modal & Dialog
- Backdrop blur gelap, panel putih rounded (`--paper`), scroll body terkunci saat terbuka.
- Tutup via tombol ✕ bulat, klik luar, atau tombol **Esc**.

### 5.7 Struk / Receipt (Thermal)
- Lebar ~300px, font monospace, hitam di atas putih.
- Garis pemisah `----`, rata tengah untuk header/footer.
- Tombol "Cetak" → `window.print()` dengan CSS `@media print` khusus.

### 5.8 Tabs (Admin & Kasir)
- 5 tab terpadu pada topbar hijau Ciremai:
  1. `🛒 Kasir (POS)` — Panel transaksi walk-in & konsol hitung cepat.
  2. `📥 Pesanan Masuk` — Antrean pesanan live pelanggan + notifikasi audio *ding*.
  3. `📜 Laporan & Riwayat` — Riwayat harian, ekspor CSV, dan menu terlaris.
  4. `📋 Kelola Menu` — Toggle status ketersediaan stok habis/tersedia.
  5. `🔳 Cetak QR Meja` — Generator & cetak 10 kartu QR meja.
- Tab aktif ditandai background emas rempah + teks pekat.

---

## 6. States & Feedback

| State | Penanganan |
|-------|-----------|
| Loading | Data lokal instan; status sync Supabase non-blocking di background |
| Empty | Ilustrasi emoji + teks informatif "Belum ada transaksi hari ini" / "Belum ada pesanan masuk" |
| Sold out | Kartu abu + tag "Habis", stepper terkunci & tidak bisa dipesan pelanggan |
| Error (bayar kurang) | Notifikasi nominal kurang dengan kartu merah pastel, tombol bayar disabled |
| Success | Modal struk + toast feedback interaktif |

---

## 7. Responsive Behavior

| Breakpoint | Perilaku |
|-----------|----------|
| < 640px | 1 kolom, cart sticky bawah, panel kasir static |
| 640–899px | 2 kolom menu, adaptasi flex layout |
| ≥ 900px | 3 kolom menu, cart panel kasir sticky kanan |

---

## 8. Inspirasi Dribbble → Adaptasi

| Tren Dribbble | Implementasi Aktual |
|---------------|---------------------|
| Card-based menu grid | ✅ Kartu menu putih murni berbayang multi-layer & micro-animation |
| Large touch targets | ✅ Tombol ≥ 44px, stepper besar ramah jempol |
| Bold price hierarchy | ✅ Harga merah cabai tebal & kontras tinggi |
| Integrated POS console | ✅ Input prefix `Rp`, segmented tab bayar, dan chip uang cepat |
| Minimal top bar | ✅ Header hijau Ciremai ramping, brand badge "C", dan tab terpadu |
| Receipt-style detail | ✅ Struk monospace thermal bersih & siap cetak |
| Warm earthy palette | ✅ Canvas krem (`#F2ECE1`) + hijau (`#204B33`) + merah (`#B83208`) + emas (`#D9881A`) |

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
