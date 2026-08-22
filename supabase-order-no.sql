-- Nomor order global, +1 selamanya (tidak reset per hari)
CREATE SEQUENCE IF NOT EXISTS order_no_seq START WITH 1;

CREATE OR REPLACE FUNCTION next_order_no()
RETURNS int
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT nextval('order_no_seq')::int;
$$;

-- Izinkan role anon (web) memanggil RPC ini
GRANT EXECUTE ON FUNCTION next_order_no() TO anon, authenticated;

-- Kolom nomor urut di tabel transaksi
ALTER TABLE transaksi ADD COLUMN IF NOT EXISTS no integer;
CREATE INDEX IF NOT EXISTS idx_trx_no ON transaksi(no);
