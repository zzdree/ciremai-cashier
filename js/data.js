/* ============================================================
   RM. CIREMAI — Data Menu
   Sumber: banner warung (22 Agustus 2026) + pembaruan menu
   pemilik (23 Agustus 2026): nasi kuning, mie goreng/rebus,
   ayam & crispy.
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

  // ---- NASI KUNING ----
  { id: 'nk-telur',       nama: 'Nasi Kuning + Telur',             harga: 11000, kat: 'nasi-kuning', emoji: '🍛' },
  { id: 'nk-omelet',      nama: 'Nasi Kuning + Omelet',            harga: 14000, kat: 'nasi-kuning', emoji: '🍳' },
  { id: 'nk-geprek',      nama: 'Nasi Kuning + Ayam Geprek',       harga: 15000, kat: 'nasi-kuning', emoji: '🍗' },
  { id: 'nk-bakar',       nama: 'Nasi Kuning + Ayam Bakar',        harga: 16000, kat: 'nasi-kuning', emoji: '🍖' },
  { id: 'nk-balii',       nama: 'Nasi Kuning + Ayam Bali',         harga: 14000, kat: 'nasi-kuning', emoji: '🍗' },
  { id: 'nk-bakarcrispy', nama: 'Nasi Kuning + Ayam Bakar Crispy', harga: 17000, kat: 'nasi-kuning', emoji: '🍗' },
  { id: 'nk-oraktelur',   nama: 'Nasi Kuning + Orak Arik Telur',   harga: 14000, kat: 'nasi-kuning', emoji: '🍳' },
  { id: 'nk-telbalado',   nama: 'Nasi Kuning + Telur Balado',      harga: 15000, kat: 'nasi-kuning', emoji: '🍅' },

  // ---- MIE DOKDOK ----
  { id: 'mie-telur',    nama: 'Mie Dokdok Telur',    harga: 13000, kat: 'mie-dokdok', emoji: '🍜' },
  { id: 'mie-ayam',     nama: 'Mie Dokdok Ayam',     harga: 17000, kat: 'mie-dokdok', emoji: '🍗' },
  { id: 'mie-sosis',    nama: 'Mie Dokdok Sosis',    harga: 15000, kat: 'mie-dokdok', emoji: '🌭' },
  { id: 'mie-baso',     nama: 'Mie Dokdok Baso',     harga: 15000, kat: 'mie-dokdok', emoji: '🥟' },
  { id: 'mie-complete', nama: 'Mie Dokdok Complete', harga: 19000, kat: 'mie-dokdok', emoji: '🍛' },

  // ---- MIE GORENG & REBUS ----
  { id: 'mig-telur', nama: 'Mie Goreng + Telur',     harga: 11000, kat: 'mie-goreng', emoji: '🍝' },
  { id: 'mir-telur', nama: 'Mie Rebus + Telur',      harga: 11000, kat: 'mie-goreng', emoji: '🍲' },
  { id: 'mig-polos', nama: 'Mie Goreng Tanpa Telur', harga: 9000,  kat: 'mie-goreng', emoji: '🍝' },
  { id: 'mir-polos', nama: 'Mie Rebus Tanpa Telur',  harga: 9000,  kat: 'mie-goreng', emoji: '🍲' },

  // ---- AYAM & CRISPY ----
  { id: 'balap-crispy',  nama: 'Balap Crispy',   harga: 17000, kat: 'ayam', emoji: '🍗' },
  { id: 'bali-crispy',   nama: 'Bali Crispy',    harga: 16000, kat: 'ayam', emoji: '🍗' },
  { id: 'crispy-balado', nama: 'Crispy Balado',  harga: 17000, kat: 'ayam', emoji: '🌶️' },
  { id: 'suir-balado',   nama: 'Suir Balado',    harga: 16000, kat: 'ayam', emoji: '🌶️' },
  { id: 'orak-ayam',     nama: 'Orak Arik Ayam', harga: 16000, kat: 'ayam', emoji: '🍳' },

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
  { id: 'semua',       label: 'Semua',            emoji: '✨' },
  { id: 'magelangan',  label: 'Magelangan',       emoji: '🍛' },
  { id: 'nasi-goreng', label: 'Nasi Goreng',      emoji: '🍚' },
  { id: 'nasi-kuning', label: 'Nasi Kuning',      emoji: '🟡' },
  { id: 'mie-dokdok',  label: 'Mie Dokdok',       emoji: '🍜' },
  { id: 'mie-goreng',  label: 'Mie Goreng/Rebus', emoji: '🍝' },
  { id: 'ayam',        label: 'Ayam & Crispy',    emoji: '🍗' },
  { id: 'minuman',     label: 'Minuman',          emoji: '🥤' },
];
