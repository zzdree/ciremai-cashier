/* ============================================================
   RM. CIREMAI KUNINGAN — Konfigurasi Global
   Edit file ini untuk mengubah info warung & nomor WA.
   ============================================================ */

const CONFIG = {
  namaWarung: 'RM. Ciremai',
  kota: 'Kuningan, Jawa Barat',
  tagline: 'Magelangan • Nasi Goreng • Mie Dokdok',
  // Ganti dengan nomor WhatsApp resmi warung (format internasional tanpa +)
  waNomor: '6281234567890',
  jamBuka: 'Setiap hari · 16.00 – 02.00 WIB',
  alamat: 'Jl. Raya Ciremai, Kuningan, Jawa Barat',
  gmapsUrl: 'https://maps.app.goo.gl/fteodwrCPNJeU1GJ9',
  // Database cloud (opsional). Set enabled=true setelah isi url & key dari Supabase.
  // Gratis di https://supabase.com — lihat README untuk skema SQL-nya.
  supabase: {
    enabled: false,
    url: '', // contoh: 'https://xxxx.supabase.co'
    key: '', // anon key dari Settings → API
  },
};
