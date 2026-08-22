# 🎨 DESIGN.md — RM. Ciremai Cashier

Dokumen ini merangkum **sistem desain** aplikasi kasir & pemesanan RM. Ciremai.
Dibuat sebagai rujukan agar UI/UX konsisten, rapi, dan nyaman digunakan baik dalam **Light Mode** (siang hari) maupun **Dark Mode** (malam hari).

> **Referensi visual:** Mengusung filosofi POS modern yang bersih, kontras tinggi, ramah sentuhan jempol (*thumb-friendly*), dan berkarakter hangat khas warung makan Nusantara.

---

## 1. Design Principles

1. **Function over fluff.** Setiap layar melayani alur kasir dan pemesanan secara efisien: pilih menu → bayar/kirim → struk/antrean.
2. **Thumb-friendly & Accessible.** Target sentuh ≥ 40px, jarak spasi memadai untuk pengoperasian dengan satu tangan di layar mobile.
3. **High contrast & Legible.** Teks harga selalu tebal dan kontras tinggi di mode terang maupun gelap (memenuhi standar WCAG AAA).
4. **Adaptive Theming.** Mendukung transisi mulus antara Mode Terang (hangat krem) dan Mode Gelap (charcoal malam) dengan persistensi preferensi via `localStorage`.
5. **Instant Feedback.** Notifikasi toast, efek hover/active taktil, dan animasi mikro responsif pada setiap interaksi.

---

## 2. Brand & Color Palette

### 2.1 Mode Terang (`:root, [data-theme="light"]`)

| Token | Nilai | Penggunaan |
|---|---|---|
| `--cream` | `#F2ECE1` | Background canvas utama (hangat, berdimensi, ramah mata) |
| `--cream-2` | `#E5DCBA` | Background sekunder / badge netral / chip inactive |
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

### 2.2 Mode Gelap (`[data-theme="dark"]`)

| Token | Nilai | Penggunaan |
|---|---|---|
| `--cream` | `#12110F` | Background canvas malam bernuansa charcoal hangat |
| `--cream-2` | `#1A1815` | Background sekunder / input wrapper gelap |
| `--paper` | `#1C1916` | Permukaan kartu & panel gelap pekat solid |
| `--ink` | `#F6EFE6` | Teks gading terang bertinta tajam (WCAG AAA) |
| `--ink-soft` | `#A89C8F` | Teks sekunder hangat & placeholder |
| `--line` | `#2E2822` | Garis batas kartu tegas & presisi |
| `--line-strong` | `#443C33` | Border tombol & pemisah kontras |
| `--red` | `#E24B1D` | Merah cabai bara menyala untuk harga & aksi kritis |
| `--red-soft` | `#2D1812` | Latar tag kurang & seleksi merah gelap |
| `--green` | `#163623` | Hijau Ciremai malam |
| `--green-soft` | `#122519` | Latar badge sukses & kembalian pas |
| `--gold` | `#E89D2C` | Emas rempah terang untuk tombol aktif & highlight |
| `--gold-soft` | `#2D2113` | Wadah emoji kartu menu gelap |

---

## 3. Typography

| Peran | Font | Berat | Catatan |
|---|---|---|---|
| Display / Judul | **Fraunces** | 600–700 | Serif hangat berkarakter "warung makan premium" |
| Body / UI | **Plus Jakarta Sans** | 400–800 | Sans-serif modern dan tajam di layar resolusi tinggi |
| Monospace / Angka POS | **ui-monospace / Consolas** | 700–800 | Angka perhitungan struk & kalkulasi kasir |

---

## 4. Components

### 4.1 Theme Toggle Button (`.theme-toggle-btn`)
- Tombol lingkaran elegan (`width: 40px`, `height: 40px`, `border-radius: 50%`) dengan latar kaca blur transparan.
- Ikon dinamis: `🌙` saat mode terang aktif (klik untuk ganti ke gelap), `☀️` saat mode gelap aktif (klik untuk ganti ke terang).
- Penempatan:
  - **Halaman Order (`index.html`)**: Di dalam `.hero-nav` tepat di sebelah tombol **Admin**.
  - **Halaman Kasir (`admin.html`)**: Di dalam `.topbar-right` tepat di sebelah tombol **Logout**.

### 4.2 Tombol Logout Minimalis (`.btn-topbar-logout`)
- Didesain ringkas tanpa teks berlebih (`width: 36px`, `height: 36px`, `border-radius: 50%`) menggunakan ikon SVG keluar pintu yang bersih.
- Warna merah bertenaga (`#B83208`) dengan efek hover elevasi dan tooltip informatif.

### 4.3 Kartu Menu & Stepper
- Permukaan kartu berdimensi dengan wadah emoji beraksen emas rempah.
- Dilengkapi stepper kuantitas interaktif (`−` [n] `+`) yang muncul langsung saat item dipilih.
- State: `default`, `hover` (elevasi naik 3px), dan `soldout` (warna redup + tag "Habis").

### 4.4 Panel POS Kasir Modern
- **Filter Kategori Chip**: Pilihan cepat *Semua*, *Makanan*, dan *Minuman* untuk navigasi menu instan.
- **Wadah Hitung Terpadu (`.pos-calc-card`)**: Menggabungkan daftar item struk, total harga, metode bayar (Tunai/QRIS), dan preset nominal cepat (`10k`–`100k`).
- **Kalkulasi Kembalian Otomatis**: Menampilkan status hijau saat bayar pas/kembalian dan status merah saat nominal kurang.

---

## 5. Responsive & Print Layout

- **Mobile (< 640px)**: Grid 1 kolom, sticky bottom bar untuk keranjang, modal bottom-sheet.
- **Tablet & Desktop (≥ 900px)**: Grid menu fleksibel, cart panel kasir bertengger rapi di kolom kanan.
- **Print PDF A4 1 Halaman**:
  - CSS `@media print` dengan aturan `@page { size: A4 portrait; margin: 12mm 15mm; }`.
  - Hanya menampilkan struk belanja terformat rapi dan menyembunyikan seluruh kontrol antarmuka web.

---

_Dokumen living — dirancang untuk menjaga konsistensi visual dan teknis RM. Ciremai._
