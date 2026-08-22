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

### 5.6 Tabs (Kasir)
- 3 tab: Kasir · Riwayat · Menu. Aktif = underline merah + tebal.
- Konten hanya 1 view yang tampil (lainnya `display:none`).

### 5.7 Quick Cash Buttons
- Nominal pas / 20rb / 50rb / 100rb. Mempercepat input uang tunai.

### 5.8 Toast
- Muncul bawah-tengah, auto-hide 2.2 detik, background gelap + teks putih.

---

## 6. States & Feedback

| State | Penanganan |
|-------|-----------|
| Loading | (minimal — data lokal instan; spinner hanya saat sync cloud) |
| Empty | Ilustrasi emoji + teks "Belum ada transaksi hari ini." |
| Sold out | Kartu abu + tag "Habis", tidak bisa diklik |
| Error (bayar kurang) | Baris "Kurang" merah, tombol bayar disabled |
| Success | Modal struk + toast "Kembalian: Rp ..." |

---

## 7. Responsive Behavior

| Breakpoint | Perilaku |
|-----------|----------|
| < 600px | 1 kolom, cart sticky bawah, panel kasir static |
| 600–899px | 2 kolom menu |
| ≥ 900px | 3 kolom, cart panel sticky kanan (`top: 82px`) |

---

## 8. Inspirasi Dribbble → Adaptasi

| Tren Dribbble | Yang kita ambil |
|---------------|-----------------|
| Card-based menu grid | ✅ Kartu menu horizontal, shadow lembut |
| Large touch targets | ✅ Tombol ≥ 48px, stepper besar |
| Bold price hierarchy | ✅ Harga merah tebal |
| Minimal top bar | ✅ Header ramping + search sticky |
| Receipt-style detail | ✅ Struk monospace thermal |
| Soft neutral palette | ✅ Cream + merah + emas (brand) |

---

## 9. Accessibility

- Kontras warna memenuhi WCAG AA.
- Semua elemen interaktif bisa diakses keyboard (Tab/Enter/Esc).
- `aria-label` pada tombol ikon & toggle.
- `prefers-reduced-motion` dihormati (transisi bisa dikurangi).

---

## 10. Do's & Don'ts

**✅ Do:**
- Pakai token warna dari `:root`.
- Jaga jarak antar elemen (minimal 8px grid).
- Beri feedback instan pada tiap aksi.

**❌ Don't:**
- Jangan pakai warna di luar palette tanpa alasan.
- Jangan buat tombol < 44px di layar sentuh.
- Jangan overload 1 layar dengan terlalu banyak info.
- Jangan gunakan font selain Fraunces & Plus Jakarta Sans.

---

_Dokumen living — update saat ada perubahan komponen atau palette._
