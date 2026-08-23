-- ============================================================
-- RM. CIREMAI — Skema Database Supabase PostgreSQL
-- Tabel, Urutan Nomor Pesanan (Sequence), dan RPC
-- ============================================================

-- 1. Tabel Transaksi & Antrean Pesanan
CREATE TABLE IF NOT EXISTS transaksi (
  id          TEXT PRIMARY KEY,
  no          INTEGER,
  ts          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  items       JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal    INTEGER NOT NULL DEFAULT 0,
  diskon      INTEGER DEFAULT 0,
  total       INTEGER NOT NULL DEFAULT 0,
  bayar       INTEGER DEFAULT 0,
  kembalian   INTEGER DEFAULT 0,
  nama        TEXT DEFAULT '',
  meja        TEXT DEFAULT '',
  catatan     TEXT DEFAULT '',
  order_type  TEXT DEFAULT 'Makan di Tempat', -- 'Makan di Tempat' | 'Bungkus'
  metode      TEXT DEFAULT 'cash',            -- 'cash' | 'qris'
  status      TEXT DEFAULT 'baru',            -- 'baru' | 'diproses' | 'lunas' | 'piutang' | 'batal'
  origin      TEXT DEFAULT 'app',             -- 'app' | 'kasir'
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk query cepat antrean & laporan
CREATE INDEX IF NOT EXISTS idx_trx_status ON transaksi (status);
CREATE INDEX IF NOT EXISTS idx_trx_no ON transaksi (no);
CREATE INDEX IF NOT EXISTS idx_trx_ts ON transaksi (ts DESC);

-- 2. Sequence Nomor Order Global (#1, #2, #3...)
CREATE SEQUENCE IF NOT EXISTS order_no_seq START WITH 1;

-- 3. RPC Function untuk Generate Nomor Order Berikutnya
CREATE OR REPLACE FUNCTION next_order_no()
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT nextval('order_no_seq')::INTEGER;
$$;

-- Berikan izin akses RPC ke role anon (web client) & authenticated
GRANT EXECUTE ON FUNCTION next_order_no() TO anon, authenticated;

-- Aktifkan Row Level Security (RLS) & Policy Akses
ALTER TABLE transaksi ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read transaksi" ON transaksi;
CREATE POLICY "Allow public read transaksi"
  ON transaksi FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public insert transaksi" ON transaksi;
CREATE POLICY "Allow public insert transaksi"
  ON transaksi FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update transaksi" ON transaksi;
CREATE POLICY "Allow public update transaksi"
  ON transaksi FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Catatan: Operasi DELETE sengaja TIDAK diberi policy publik (hanya bisa via service_role/admin) untuk mencegah penghapusan data transaksi.
