/* ============================================================
   RM. CIREMAI — Data Menu
   Sumber: banner warung (22 Agustus 2026) + harga standar burjo
   ============================================================ */

const MENU = [
  // ---- MAGELANGAN ----
  { id: 'mag-telur',    nama: 'Magelangan Telur',    harga: 15000, kat: 'magelangan', emoji: '🍳' },
  { id: 'mag-ayam',     nama: 'Magelangan Ayam',     harga: 19000, kat: 'magelangan', emoji: '🍗' },
  { id: 'mag-sosis',    nama: 'Magelangan Sosis',    harga: 17000, kat: 'magelangan', emoji: '🌭' },
  { id: 'mag-baso',     nama: 'Magelangan Baso',     harga: 17000, kat: 'magelangan', emoji: '🥟' },
  { id: 'mag-complete', nama: 'Magelangan Complete', harga: 22000, kat: 'magelangan', emoji: '🍛' },

  // ---- NASI GORENG ----
  { id: 'nas-telur',    nama: 'Nasi Goreng Telur',   harga: 13000, kat: 'nasi-goreng', emoji: '🍳' },
  { id: 'nas-ayam',     nama: 'Nasi Goreng Ayam',    harga: 18000, kat: 'nasi-goreng', emoji: '🍗' },
  { id: 'nas-sosis',    nama: 'Nasi Goreng Sosis',   harga: 15000, kat: 'nasi-goreng', emoji: '🌭' },
  { id: 'nas-baso',     nama: 'Nasi Goreng Baso',    harga: 15000, kat: 'nasi-goreng', emoji: '🥟' },
  { id: 'nas-complete', nama: 'Nasi Goreng Complete',harga: 21000, kat: 'nasi-goreng', emoji: '🍛' },

  // ---- MIE DOKDOK ----
  { id: 'mie-telur',    nama: 'Mie Dokdok Telur',    harga: 13000, kat: 'mie-dokdok', emoji: '🍜' },
  { id: 'mie-ayam',     nama: 'Mie Dokdok Ayam',     harga: 17000, kat: 'mie-dokdok', emoji: '🍗' },
  { id: 'mie-sosis',    nama: 'Mie Dokdok Sosis',    harga: 15000, kat: 'mie-dokdok', emoji: '🌭' },
  { id: 'mie-baso',     nama: 'Mie Dokdok Baso',     harga: 15000, kat: 'mie-dokdok', emoji: '🥟' },
  { id: 'mie-complete', nama: 'Mie Dokdok Complete', harga: 19000, kat: 'mie-dokdok', emoji: '🍛' },

  // ---- MINUMAN ----
  { id: 'min-aires',    nama: 'Air Es',              harga: 1000,  kat: 'minuman', emoji: '💧' },
  { id: 'min-esteh',    nama: 'Es Teh Manis',        harga: 3000,  kat: 'minuman', emoji: '🧊' },
  { id: 'min-tehpas',   nama: 'Teh Panas',           harga: 3000,  kat: 'minuman', emoji: '🍵' },
  { id: 'min-nutri',    nama: 'Nutrisari',           harga: 4000,  kat: 'minuman', emoji: '🍊' },
  { id: 'min-jeruk',    nama: 'Es Jeruk',            harga: 4000,  kat: 'minuman', emoji: '🍹' },
  { id: 'min-kopihi',   nama: 'Kopi Hitam',          harga: 5000,  kat: 'minuman', emoji: '☕' },
  { id: 'min-kopisu',   nama: 'Kopi Susu',           harga: 5000,  kat: 'minuman', emoji: '🥛' },
  { id: 'min-cappu',    nama: 'Capucino',            harga: 5000,  kat: 'minuman', emoji: '☕' },
  { id: 'min-susu',     nama: 'Susu Putih/Coklat',   harga: 5000,  kat: 'minuman', emoji: '🥛' },
  { id: 'min-extrajoss',nama: 'Extra Joss',          harga: 5000,  kat: 'minuman', emoji: '⚡' },
  { id: 'min-goodday',  nama: 'Good Day',            harga: 6000,  kat: 'minuman', emoji: '🍪' },
  { id: 'min-milo',     nama: 'Milo',                harga: 6000,  kat: 'minuman', emoji: '🍫' },
];

const KATEGORI = [
  { id: 'semua',       label: 'Semua',      emoji: '✨' },
  { id: 'magelangan',  label: 'Magelangan', emoji: '🍛' },
  { id: 'nasi-goreng', label: 'Nasi Goreng',emoji: '🍚' },
  { id: 'mie-dokdok',  label: 'Mie Dokdok', emoji: '🍜' },
  { id: 'minuman',     label: 'Minuman',    emoji: '🥤' },
];
