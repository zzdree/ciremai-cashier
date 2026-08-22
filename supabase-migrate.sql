-- Migrasi skema RM. Ciremai: extend tabel transaksi untuk alur order -> kasir.
-- Jalankan di Supabase SQL Editor (project lnxprlvmyhqxkzarrzac) jika belum diterapkan.

alter table transaksi
  add column if not exists nama       text    default '',
  add column if not exists meja       text    default '',
  add column if not exists catatan    text    default '',
  add column if not exists metode     text    default 'cash',   -- cash | qris
  add column if not exists status     text    default 'lunas',  -- baru | diproses | lunas | piutang | batal
  add column if not exists origin     text    default 'kasir',  -- app | kasir
  add column if not exists order_type text    default '',       -- Makan di Tempat | Bungkus
  add column if not exists updated_at timestamptz default now();

-- Index agar antrian kasir cepat
create index if not exists idx_trx_status on transaksi (status);
