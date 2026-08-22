/* ============================================================
   RM. CIREMAI SEMARANG - DB Cloud (Supabase, opt-in)
   Koneksi via REST API Supabase (tanpa library eksternal).
   Aktif hanya jika CONFIG.supabase.enabled === true.
   ============================================================ */

const DB = (() => {
  const TABEL = 'transaksi';

  function cfg() { return CONFIG.supabase; }
  function aktif() { return !!(cfg() && cfg().enabled && cfg().url && cfg().key); }

  function headers() {
    return {
      'Content-Type': 'application/json',
      'apikey': cfg().key,
      'Authorization': 'Bearer ' + cfg().key,
      'Prefer': 'return=minimal',
    };
  }

  // Simpan / upsert satu transaksi ke cloud (fire-and-forget, gagal tidak mengganggu kasir)
  async function simpan(trx) {
    if (!aktif()) return false;
    try {
      const res = await fetch(`${cfg().url}/rest/v1/${TABEL}`, {
        method: 'POST',
        headers: {
          ...headers(),
          'Prefer': 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify([trx]),
      });
      return res.ok;
    } catch (e) {
      console.warn('[DB] gagal simpan ke cloud:', e);
      return false;
    }
  }

  // Ambil semua transaksi hari ini (mode UTC hari ini, filter di client)
  async function hariIni() {
    if (!aktif()) return [];
    try {
      const res = await fetch(
        `${cfg().url}/rest/v1/${TABEL}?select=*&order=ts.desc`,
        { headers: headers() }
      );
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.warn('[DB] gagal ambil dari cloud:', e);
      return [];
    }
  }

  // Ambil order dari pelanggan yang belum selesai (antrian kasir)
  async function ambilOrderBaru() {
    if (!aktif()) return [];
    try {
      const res = await fetch(
        `${cfg().url}/rest/v1/${TABEL}?select=*&status=in.(baru,diproses)&order=ts.asc`,
        { headers: headers() }
      );
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.warn('[DB] gagal ambil order:', e);
      return [];
    }
  }

  // Update satu order (status, metode, pembayaran)
  async function updateOrder(id, patch) {
    if (!aktif()) return false;
    try {
      const res = await fetch(`${cfg().url}/rest/v1/${TABEL}?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { ...headers(), 'Prefer': 'return=minimal' },
        body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }),
      });
      return res.ok;
    } catch (e) {
      console.warn('[DB] gagal update order:', e);
      return false;
    }
  }

  // Ambil satu order by id
  async function ambilOrderById(id) {
    if (!aktif()) return null;
    try {
      const res = await fetch(`${cfg().url}/rest/v1/${TABEL}?id=eq.${encodeURIComponent(id)}&select=*&limit=1`, { headers: headers() });
      if (!res.ok) return null;
      const a = await res.json();
      return a[0] || null;
    } catch { return null; }
  }

  // Ambil nomor order global berikutnya (+1 selamanya) via RPC sequence
  async function nextOrderNo() {
    if (!aktif()) return null;
    try {
      const res = await fetch(`${cfg().url}/rest/v1/rpc/next_order_no`, {
        method: 'POST',
        headers: headers(),
        body: '{}',
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.warn('[DB] gagal ambil nomor order:', e);
      return null;
    }
  }

  return { aktif, simpan, hariIni, ambilOrderBaru, updateOrder, ambilOrderById, nextOrderNo };
})();
