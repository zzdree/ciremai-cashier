/* ============================================================
   RM. CIREMAI KUNINGAN — DB Cloud (Supabase, opt-in)
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

  // Simpan satu transaksi ke cloud (fire-and-forget, gagal tidak mengganggu kasir)
  async function simpan(trx) {
    if (!aktif()) return false;
    try {
      const res = await fetch(`${cfg().url}/rest/v1/${TABEL}`, {
        method: 'POST',
        headers: headers(),
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

  return { aktif, simpan, hariIni };
})();
