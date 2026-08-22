/* ============================================================
   RM. CIREMAI — Kasir (POS) — kasir.html
   Transaksi tunai · struk · riwayat · laporan · kelola menu
   ============================================================ */

const pos = { cart: {} };
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const namaById = (id) => (MENU.find((m) => m.id === id) || {}).nama || id;
const hargaById = (id) => (MENU.find((m) => m.id === id) || {}).harga || 0;

// ---------- INIT ----------
let __kasirInit = false;
function initKasirUI() {
  if (__kasirInit) return;
  __kasirInit = true;
  $('#tbNama').textContent = CONFIG.namaWarung;
  renderPosGrid();
  renderMenuManage();
  bindTabs();
  bindPos();
  updatePosUI();
  bindReceiptModal();
  $('#btnPrintQr')?.addEventListener('click', () => window.print());
  bindPesanan();
  bindConfirm();
  $('#btnPrintReceipt').addEventListener('click', () => window.print());
  // Muat antrian pesanan saat buka
  renderPesanan();
  // Auto-refresh antrian tiap 5 detik (tanpa tombol Segarkan)
  window.__pesananTimer = setInterval(() => {
    // Jangan ganggu kalau sedang ambil order / ada modal terbuka
    if (document.querySelector('#receiptModal.open') || document.querySelector('#confirmModal.open')) return;
    renderPesanan();
  }, 5000);

  // Tutup modal dengan Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      $('#cartModal')?.classList.remove('open');
      $('#receiptModal')?.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // ---------- LOCK SCREEN ----------
  const screen = $('#lockScreen');
  const input = $('#pinInput');
  const err = $('#lockErr');
  if (!screen || !CONFIG.kasirPin) { screen && screen.classList.add('hidden'); initKasirUI(); return; }
  const unlock = () => {
    if (input.value.trim() === String(CONFIG.kasirPin)) {
      screen.classList.add('hidden');
      localStorage.setItem('ciremai_unlocked', '1');
      initKasirUI();
    } else {
      err.hidden = false;
      input.value = '';
      input.focus();
    }
  };
  // Ingat sesi yang sudah buka (biar gak ngetik ulang terus)
  if (localStorage.getItem('ciremai_unlocked') === '1') {
    screen.classList.add('hidden');
    initKasirUI();
  } else {
    $('#btnUnlock').addEventListener('click', unlock);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') unlock(); });
    input.focus();
  }
});

// ---------- TABS ----------
function bindTabs() {
  const main = $('#view-kasir-wrap');
  const showView = (view) => {
    $$('.tab-btn[data-view]').forEach((b) => b.classList.toggle('active', b.dataset.view === view));
    main.style.display = (view === 'kasir') ? '' : 'none';
    $$('.view').forEach((v) => v.classList.remove('active'));
    $('#view-' + view).classList.add('active');
    if (view === 'riwayat') renderRiwayat();
    if (view === 'menu') renderMenuManage();
    if (view === 'qr') renderQr();
    if (view === 'pesanan') renderPesanan();
  };
  $$('.tab-btn[data-view]').forEach((btn) => {
    btn.addEventListener('click', () => showView(btn.dataset.view));
  });
}

// ---------- SOUND: notif order baru ----------
let __knownOrderIds = new Set();
function playDing() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    [880, 1320].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      const t = now + i * 0.14;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.24);
    });
    setTimeout(() => ctx.close().catch(() => {}), 600);
  } catch (_) {}
}

function renderPesanan() {
  const list = $('#pesananList');
  if (!list) return;
  if (!DB.aktif()) {
    list.innerHTML = `<div class="cart-empty"><div class="big">📡</div>Database offline.<br />Cek koneksi Supabase di config.js</div>`;
    $('#pesananBadge').hidden = true;
    return;
  }
  DB.ambilOrderBaru().then((rows) => {
    // Notifikasi suara HANYA kalau ada order BARU yang belum pernah tampil
    const ids = rows.map((r) => String(r.id));
    const fresh = ids.filter((id) => !__knownOrderIds.has(id));
    if (fresh.length && __knownOrderIds.size > 0) playDing();
    ids.forEach((id) => __knownOrderIds.add(id));
    daftarPesanan = rows;
    const badge = $('#pesananBadge');
    badge.textContent = rows.length;
    badge.hidden = rows.length === 0;

    if (!rows.length) {
      list.innerHTML = `<div class="cart-empty"><div class="big">📭</div>Belum ada pesanan dari pelanggan.</div>`;
      return;
    }
    list.innerHTML = rows.map((o) => {
      const items = (o.items || []).map((i) => `
        <div class="oc-item"><span>${i.qty}× ${i.nama}</span><span>${Store.rupiah(i.harga * i.qty)}</span></div>`).join('');
      const waktu = new Date(o.ts).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      const statusTag = o.status === 'diproses'
        ? '<span class="status-tag on">⏳ Diproses</span>'
        : '<span class="status-tag new">🆕 Baru</span>';
      const label = `#${o.no ?? o.id}`;
      const diubahTag = o.diubah ? ' <span class="status-tag edit">✏️ Diubah</span>' : '';
      return `
        <div class="order-card" data-id="${o.id}">
          <div class="oc-head">
            <div>
              <div class="oc-name">🧾 Order ${label}${diubahTag}</div>
              <div class="oc-meta">🕐 ${waktu} · ${o.order_type || 'makan di tempat'}</div>
            </div>
            ${statusTag}
          </div>
          <div class="oc-items">${items}</div>
          ${o.catatan ? `<div class="oc-note">📝 ${o.catatan}</div>` : ''}
          <div class="oc-foot">
            <div class="oc-total">${Store.rupiah(o.total || 0)}</div>
            <button class="btn-primary oc-take" data-take="${o.id}">➡️ Ambil & Proses</button>
          </div>
        </div>`;
    }).join('');

    list.querySelectorAll('[data-take]').forEach((b) => {
      b.addEventListener('click', () => takeOrder(b.dataset.take));
    });
  });
}

function bindPesanan() {
  $('#btnRefreshPesanan')?.addEventListener('click', renderPesanan);
}

function takeOrder(id) {
  const o = daftarPesanan.find((x) => String(x.id) === String(id));
  if (!o) return;
  pos.cart = {};
  (o.items || []).forEach((i) => { pos.cart[i.id] = i.qty; });
  DB.updateOrder(id, { status: 'diproses' });
  Store.setCurrentOrder({ ...o, status: 'diproses' });

  $('#orderContext').hidden = false;
  $('#orderContext').innerHTML = `📥 Order <b>#${o.no ?? o.id}</b> (${o.order_type || ''}) — keranjang sudah terisi. Tambah item jika kurang, lalu bayar.`;

  $$('.tab-btn[data-view]').forEach((b) => b.classList.toggle('active', b.dataset.view === 'kasir'));
  $('#view-kasir-wrap').style.display = '';
  $$('.view').forEach((v) => v.classList.remove('active'));
  $('#view-kasir').classList.add('active');

  renderPosCart();
  updatePosUI();
  toast('Pesanan diambil ✅');
}



// ---------- QR MEJA ----------
function renderQr() {
  const grid = $('#qrGrid');
  if (!grid || grid.dataset.rendered) return;
  const n = CONFIG.jumlahMeja || 10;
  let html = '';
  for (let i = 1; i <= n; i++) {
    const url = CONFIG.mejaUrl(i);
    const qr = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(url)}`;
    html += `
      <div class="qr-card">
        <img src="${qr}" alt="QR Meja ${i}" loading="lazy" width="120" height="120" />
        <div class="qr-no">Meja ${i}</div>
        <div class="qr-url">${url}</div>
      </div>`;
  }
  grid.innerHTML = html;
  grid.dataset.rendered = '1';
}

// ---------- GRID MENU KASIR ----------
function renderPosGrid() {
  const habis = Store.getHabis();
  const q = ($('#posSearch').value || '').trim().toLowerCase();
  const grid = $('#posGrid');
  const items = MENU.filter((m) => !q || m.nama.toLowerCase().includes(q));
  grid.innerHTML = items.map((m) => {
    const sold = habis.includes(m.id);
    return `
      <button class="card" data-id="${m.id}" ${sold ? 'disabled' : ''}>
        <div class="card-emoji">${m.emoji}</div>
        <div class="card-body">
          <div class="card-name">${m.nama}</div>
          <div class="card-price">${Store.rupiah(m.harga)}</div>
          ${sold ? '<span class="soldout-tag">Habis</span>' : ''}
        </div>
      </button>`;
  }).join('');

  grid.querySelectorAll('.card:not(:disabled)').forEach((card) => {
    card.addEventListener('click', () => addPosItem(card.dataset.id));
  });
}

function addPosItem(id) {
  pos.cart[id] = (pos.cart[id] || 0) + 1;
  renderPosCart();
  updatePosUI();
  toast(`+1 ${namaById(id)}`);
}
function changePosQty(id, delta) {
  const next = (pos.cart[id] || 0) + delta;
  if (next <= 0) delete pos.cart[id];
  else pos.cart[id] = Math.min(next, 99);
  renderPosCart();
  updatePosUI();
}

function renderPosCart() {
  const wrap = $('#posItems');
  const entries = Object.entries(pos.cart);
  if (!entries.length) {
    wrap.innerHTML = `<div class="cart-empty"><div class="big">🧺</div>Klik menu di kiri<br />untuk menambah item.</div>`;
    return;
  }
  wrap.innerHTML = entries.map(([id, qty]) => {
    const harga = hargaById(id);
    return `
      <div class="cart-item">
        <div class="ci-info">
          <div class="ci-name">${namaById(id)}</div>
          <div class="ci-price">${Store.rupiah(harga)} × ${qty}</div>
        </div>
        <div class="stepper">
          <button type="button" data-dec="${id}" aria-label="Kurangi">−</button>
          <span>${qty}</span>
          <button type="button" data-inc="${id}" aria-label="Tambah">+</button>
        </div>
        <div class="ci-total">${Store.rupiah(harga * qty)}</div>
      </div>`;
  }).join('');

  wrap.querySelectorAll('[data-inc]').forEach((b) => b.addEventListener('click', () => changePosQty(b.dataset.inc, +1)));
  wrap.querySelectorAll('[data-dec]').forEach((b) => b.addEventListener('click', () => changePosQty(b.dataset.dec, -1)));
}

// ---------- PERHITUNGAN ----------
function calcSubtotal() {
  return Object.entries(pos.cart).reduce((s, [id, qty]) => s + hargaById(id) * qty, 0);
}
function calcTotal() {
  const diskon = Math.max(0, Number($('#posDiskon').value) || 0);
  return Math.max(0, calcSubtotal() - diskon);
}

function updatePosUI() {
  const total = calcTotal();
  $('#posTotal').textContent = Store.rupiah(total);

  const bayar = Number($('#posBayar').value) || 0;
  const piutang = $('#cbPiutang').checked;
  const line = $('#changeLine');
  const btn = $('#btnBayar');

  if (piutang) {
    line.hidden = true;
    btn.disabled = Object.keys(pos.cart).length === 0;
    return;
  }

  if (bayar <= 0 || total <= 0) {
    line.hidden = true;
    btn.disabled = true;
    return;
  }
  const kembalian = bayar - total;
  $('#changeVal').textContent = Store.rupiah(Math.abs(kembalian));
  if (kembalian >= 0) {
    line.className = 'change-line ok';
    line.querySelector('span:first-child').textContent = 'Kembalian';
    btn.disabled = false;
  } else {
    line.className = 'change-line bad';
    line.querySelector('span:first-child').textContent = 'Kurang';
    btn.disabled = true;
  }
  line.hidden = false;
}

// ---------- EVENTS POS ----------
function bindPos() {
  $('#posSearch').addEventListener('input', renderPosGrid);

  $('#btnClearPos').addEventListener('click', () => {
    if (!Object.keys(pos.cart).length && !$('#posDiskon').value && !$('#posBayar').value) return;
    if (confirm('Bersihkan struk ini?')) resetPos();
  });

  $('#posDiskon').addEventListener('input', updatePosUI);
  $('#posBayar').addEventListener('input', updatePosUI);

  $('#cbPiutang').addEventListener('change', updatePosUI);

  $$('.money-btn').forEach((b) => b.addEventListener('click', () => {
    const v = b.dataset.money;
    $('#posBayar').value = v === 'pas' ? calcTotal() : v;
    updatePosUI();
  }));

  $('#btnBayar').addEventListener('click', doBayar);
}

function resetPos() {
  pos.cart = {};
  $('#posDiskon').value = '';
  $('#posBayar').value = '';
  renderPosCart();
  updatePosUI();
}

// ---------- BAYAR & STRUK ----------
function doBayar() {
  const total = calcTotal();
  const bayar = Number($('#posBayar').value) || 0;
  if (!Object.keys(pos.cart).length) { toast('Keranjang kosong'); return; }
  if (bayar < total) { toast('Uang kurang 😅'); return; }

  const diskon = Math.max(0, Number($('#posDiskon').value) || 0);
  const items = Object.entries(pos.cart).map(([id, qty]) => ({
    id, nama: namaById(id), harga: hargaById(id), qty,
  }));
  const metode = ($('input[name="metode"]:checked') || {}).value || 'cash';
  const piutang = $('#cbPiutang').checked;

  const trx = {
    id: Store.nextId(),
    ts: new Date().toISOString(),
    items,
    subtotal: calcSubtotal(),
    diskon,
    total,
    bayar: piutang ? 0 : bayar,
    kembalian: piutang ? 0 : bayar - total,
    metode,
    status: piutang ? 'piutang' : 'lunas',
    origin: 'kasir',
  };

  // Jika ini berasal dari pesanan pelanggan, sambungkan ID asli
  const cur = Store.getCurrentOrder();
  if (cur && cur.id) {
    trx.id = cur.id;
    trx.origin = cur.origin || 'kasir';
    trx.nama = cur.nama;
    trx.meja = cur.meja;
    trx.catatan = cur.catatan;
    trx.order_type = cur.order_type;
  }

  // Simpan ke cloud (status lunas/piutang)
  Store.addTrx(trx);
  if (cur && cur.id) DB.updateOrder(cur.id, { status: trx.status, metode, total: trx.total });
  Store.clearCurrentOrder();

  $('#kembalianMsg').textContent = piutang
    ? '📝 Dicatat sebagai PIUTANG (belum lunas)'
    : (trx.kembalian > 0 ? `Kembalian: ${Store.rupiah(trx.kembalian)}` : 'Uang pas. Makasih! 🙏');
  $('#receiptPaper').innerHTML = receiptHTML(trx);
  openReceipt();

  resetPos();
  renderMenuManage();
  renderPesanan();
}

function processPay() {
  // Dipanggil dari modal konfirmasi
  const total = calcTotal();
  const bayar = Number($('#posBayar').value) || 0;
  if (!Object.keys(pos.cart).length) { toast('Keranjang kosong'); return; }
  if (!$('#cbPiutang').checked && bayar < total) { toast('Uang kurang 😅'); return; }
  doBayar();
}

function bindConfirm() {
  $('#btnBayar').addEventListener('click', () => {
    const total = calcTotal();
    const bayar = Number($('#posBayar').value) || 0;
    const piutang = $('#cbPiutang').checked;
    if (!Object.keys(pos.cart).length) { toast('Keranjang kosong'); return; }
    if (!piutang && bayar < total) { toast('Uang kurang 😅'); return; }

    const items = Object.entries(pos.cart).map(([id, qty]) => `${qty}× ${namaById(id)}`).join(', ');
    const metode = ($('input[name="metode"]:checked') || {}).value || 'cash';
    const cur = Store.getCurrentOrder();
    const head = cur ? `🧾 Order #${cur.no ?? cur.id}` : 'Struk Kasir';
    $('#confirmBody').innerHTML = `
      <div style="background:var(--bg);border-radius:12px;padding:12px 14px;margin-bottom:10px;">
        <div style="font-weight:700;margin-bottom:6px;">${head}</div>
        <div style="color:var(--ink-soft);font-size:.9rem;">${items}</div>
      </div>
      <div class="r-row"><span>Total</span><span>${Store.rupiah(total)}</span></div>
      <div class="r-row"><span>Metode</span><span>${metode === 'qris' ? '📱 QRIS' : '💵 Cash'}</span></div>
      <div class="r-row"><span>Status</span><span>${piutang ? '💳 Piutang (nanti)' : '✅ Lunas'}</span></div>`;
    $('#confirmModal').classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  const close = () => { $('#confirmModal').classList.remove('open'); document.body.style.overflow = ''; };
  $('#btnCloseConfirm').addEventListener('click', close);
  $('#btnCancelConfirm').addEventListener('click', close);
  $('#confirmModal').addEventListener('click', (e) => { if (e.target === e.currentTarget) close(); });
  $('#btnProceedPay').addEventListener('click', () => { close(); processPay(); });
}



function receiptHTML(t) {
  const waktu = new Date(t.ts).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const rows = t.items.map((i) => `
    <div class="r-row"><span>${i.qty}× ${i.nama}</span><span>${Store.rupiah(i.harga * i.qty)}</span></div>`).join('');
  const diskonLine = t.diskon > 0
    ? `<div class="r-row"><span>Diskon</span><span>-${Store.rupiah(t.diskon)}</span></div>` : '';
  return `
    <div class="r-center r-bold">${CONFIG.namaWarung.toUpperCase()}</div>
    <div class="r-center r-small">${CONFIG.alamat}</div>
    <div class="r-center r-small">${waktu}</div>
    <div class="r-line"></div>
    <div class="r-bold">${t.id}</div>
    <div class="r-line"></div>
    ${rows}
    <div class="r-line"></div>
    ${diskonLine}
    <div class="r-row r-bold"><span>TOTAL</span><span>${Store.rupiah(t.total)}</span></div>
    <div class="r-row"><span>BAYAR</span><span>${Store.rupiah(t.bayar)}</span></div>
    <div class="r-row"><span>KEMBALI</span><span>${Store.rupiah(t.kembalian)}</span></div>
    <div class="r-line"></div>
    <div class="r-center r-small">~ Terima kasih ~</div>
    <div class="r-center r-small">${CONFIG.kota}</div>`;
}

function openReceipt() {
  $('#receiptModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function bindReceiptModal() {
  const close = () => {
    $('#receiptModal').classList.remove('open');
    document.body.style.overflow = '';
  };
  $('#btnCloseReceipt').addEventListener('click', close);
  $('#btnDoneReceipt').addEventListener('click', close);
  $('#btnCsv').addEventListener('click', exportCSV);
  $('#receiptModal').addEventListener('click', (e) => { if (e.target === e.currentTarget) close(); });
}

// ---------- RIWAYAT & LAPORAN ----------
function renderRiwayat() {
  const trx = Store.todayTrx();

  const omzet = trx.reduce((s, t) => s + t.total, 0);
  const count = trx.length;
  const itemCount = trx.reduce((s, t) => s + t.items.reduce((a, i) => a + i.qty, 0), 0);

  $('#statGrid').innerHTML = `
    <div class="stat-card"><div class="stat-label">Omzet Hari Ini</div><div class="stat-value red">${Store.rupiah(omzet)}</div></div>
    <div class="stat-card"><div class="stat-label">Transaksi</div><div class="stat-value">${count}</div></div>
    <div class="stat-card"><div class="stat-label">Item Terjual</div><div class="stat-value">${itemCount}</div></div>
    <div class="stat-card"><div class="stat-label">Rata-rata / Trx</div><div class="stat-value">${Store.rupiah(count ? Math.round(omzet / count) : 0)}</div></div>`;

  const list = $('#trxList');
  if (!trx.length) {
    list.innerHTML = `<div class="cart-empty"><div class="big">📭</div>Belum ada transaksi hari ini.</div>`;
  } else {
    list.innerHTML = trx.map((t) => {
      const waktu = new Date(t.ts).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      const ringkas = t.items.map((i) => `${i.qty}× ${i.nama}`).join(', ');
      return `
        <button class="trx-row" data-id="${t.id}">
          <div>
            <div class="trx-id">${t.id}</div>
            <div class="trx-meta">${waktu} · ${ringkas}</div>
          </div>
          <div class="trx-amount">${Store.rupiah(t.total)}</div>
        </button>`;
    }).join('');
    list.querySelectorAll('.trx-row').forEach((row) => {
      row.addEventListener('click', () => {
        const t = Store.getTrx().find((x) => x.id === row.dataset.id);
        if (t) {
          $('#kembalianMsg').textContent = t.kembalian > 0 ? `Kembalian: ${Store.rupiah(t.kembalian)}` : 'Uang pas.';
          $('#receiptPaper').innerHTML = receiptHTML(t);
          openReceipt();
        }
      });
    });
  }

  // Menu terlaris
  const map = {};
  trx.forEach((t) => t.items.forEach((i) => { map[i.nama] = (map[i.nama] || 0) + i.qty; }));
  const best = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8);
  $('#bestList').innerHTML = best.length
    ? best.map(([nama, qty]) => `<li><span>${nama}</span><span class="qty">${qty}×</span></li>`).join('')
    : '<li><span style="color:var(--ink-soft)">Belum ada data.</span></li>';
}

function exportCSV() {
  const trx = Store.todayTrx();
  if (!trx.length) { toast('Tidak ada data untuk diexport'); return; }
  const header = ['ID', 'Waktu', 'Items', 'Subtotal', 'Diskon', 'Total', 'Bayar', 'Kembalian'];
  const rows = trx.map((t) => [
    t.id,
    new Date(t.ts).toLocaleString('id-ID'),
    t.items.map((i) => `${i.qty}x ${i.nama}`).join('; '),
    t.subtotal, t.diskon, t.total, t.bayar, t.kembalian,
  ].map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','));
  const csv = [header.join(','), ...rows].join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const ymd = new Date().toISOString().slice(0, 10);
  a.href = url; a.download = `ciremai-laporan-${ymd}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast('CSV terdownload ⬇️');
}

// ---------- KELOLA MENU (habis) ----------
function renderMenuManage() {
  const habis = Store.getHabis();
  $('#menuManageList').innerHTML = MENU.map((m) => {
    const sold = habis.includes(m.id);
    return `
      <div class="menu-manage-row">
        <div class="card-emoji" style="width:40px;height:40px;font-size:1.2rem;border-radius:11px;">${m.emoji}</div>
        <div class="mm-name">${m.nama}</div>
        <div class="mm-price">${Store.rupiah(m.harga)}</div>
        <button class="toggle ${sold ? 'habis' : ''}" data-id="${m.id}" aria-label="Toggle ${m.nama}">${sold ? 'Habis' : 'Ada'}</button>
      </div>`;
  }).join('');
  $('#menuManageList').querySelectorAll('.toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      Store.toggleHabis(btn.dataset.id);
      renderMenuManage();
      renderPosGrid();
    });
  });
}

// ---------- TOAST ----------
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

