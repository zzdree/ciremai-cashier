/* ============================================================
   RM. CIREMAI — Store (localStorage helpers)
   ============================================================ */

const Store = {
  KEYS: {
    habis: 'ciremai_menu_habis',
    trx: 'ciremai_trx',
    counter: 'ciremai_counter',
  },

  // ---- Menu habis ----
  getHabis() {
    try { return JSON.parse(localStorage.getItem(this.KEYS.habis)) || []; }
    catch { return []; }
  },
  toggleHabis(id) {
    const h = this.getHabis();
    const i = h.indexOf(id);
    if (i >= 0) h.splice(i, 1); else h.push(id);
    localStorage.setItem(this.KEYS.habis, JSON.stringify(h));
  },

  // ---- Transaksi ----
  getTrx() {
    try { return JSON.parse(localStorage.getItem(this.KEYS.trx)) || []; }
    catch { return []; }
  },
  addTrx(trx) {
    const all = this.getTrx();
    all.unshift(trx);
    localStorage.setItem(this.KEYS.trx, JSON.stringify(all));
  },
  todayTrx() {
    const today = new Date().toDateString();
    return this.getTrx().filter(t => new Date(t.ts).toDateString() === today);
  },

  // ---- Counter harian ----
  nextId() {
    const d = new Date();
    const ymd = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
    let c = JSON.parse(localStorage.getItem(this.KEYS.counter)) || {};
    if (c.ymd !== ymd) c = { ymd, n: 0 };
    c.n += 1;
    localStorage.setItem(this.KEYS.counter, JSON.stringify(c));
    return `TRX-${ymd}-${String(c.n).padStart(3, '0')}`;
  },

  // ---- Util ----
  rupiah(n) {
    return 'Rp ' + Number(n).toLocaleString('id-ID');
  },
};
