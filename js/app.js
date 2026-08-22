/* ============================================================
   RM. CIREMAI — Halaman Pelanggan (index.html)
   Katalog menu + keranjang + checkout via WhatsApp
   ============================================================ */

// ---------- STATE ----------
const state = {
  cart: {},        // { itemId: qty }
  kat: 'semua',
  q: '',
  orderType: 'Makan di Tempat',
  editNo: null,    // nomor order yang sedang diedit (ubah/tambah item)
  editId: null,    // id order yang diedit
};

const $ = (sel) => document.querySelector(sel);

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
  // Isi data warung dari CONFIG
  $('#brandNama').textContent = CONFIG.namaWarung;
  $('#brandKota').textContent = CONFIG.kota;
  $('#jamBuka').textContent = CONFIG.jamBuka.replace(/^Setiap hari\s*·\s*/, '');
  $('#gmapsLink').href = CONFIG.gmapsUrl;
  $('#footNama').textContent = CONFIG.namaWarung;
  $('#footAlamat').textContent = CONFIG.alamat;
  $('#footJam').textContent = CONFIG.jamBuka;

  // QR meja: jika dibuka via ?meja=N, tampilkan badge & simpan ke state
  const mejaParam = new URLSearchParams(location.search).get('meja');
  if (mejaParam && /^\d+$/.test(mejaParam)) {
    state.meja = mejaParam;
    const badge = $('#mejaBadge');
    $('#mejaNo').textContent = mejaParam;
    badge.hidden = false;
  }

  renderChips();
  renderMenu();
  updateCartBar();

  // Events
  $('#searchInput').addEventListener('input', (e) => {
    state.q = e.target.value.trim().toLowerCase();
    renderMenu();
  });

  $('#btnOpenCart').addEventListener('click', openCart);
  $('#btnCloseCart').addEventListener('click', closeCart);
  $('#cartModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeCart();
  });

  document.querySelectorAll('.type-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.type-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.orderType = btn.dataset.type;
    });
  });

  $('#btnClearCart').addEventListener('click', () => {
    if (!Object.keys(state.cart).length) return;
    if (confirm('Kosongkan semua item di keranjang?')) {
      state.cart = {};
      refreshAll();
    }
  });

  $('#checkoutForm').addEventListener('submit', submitOrder);

  // Modal pesanan terkirim — opsi nambah lagi atau selesai
  const closeSuccess = () => {
    $('#successModal').classList.remove('open');
    document.body.style.overflow = '';
  };
  // Ubah pesanan yang SAMA (tambah/ubah item ke #N)
  $('#btnEditOrder').addEventListener('click', async () => {
    const no = ($('#successTitle').textContent.match(/#(\d+)/) || [])[1];
    state.editNo = Number(no);
    state.editId = String(no);
    state.cart = {};
    closeSuccess();
    toast(`Edit pesanan #${no} — mengambil data...`);
    // Preselect item lama dan catatan biar user gak pilih ulang dari nol
    try {
      const old = await DB.ambilOrderById(String(no));
      if (old) {
        if (Array.isArray(old.items)) {
          old.items.forEach((i) => { state.cart[i.id] = i.qty; });
        }
        if (old.catatan) {
          $('#custNote').value = old.catatan;
        }
        if (old.order_type) {
          state.orderType = old.order_type;
          document.querySelectorAll('.type-btn').forEach((b) => {
            b.classList.toggle('active', b.dataset.type === old.order_type);
          });
        }
      }
    } catch (_) {}
    refreshAll();
    openCart();
    toast(`Edit pesanan #${no} — ubah lalu kirim ulang`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  $('#btnAddMore').addEventListener('click', () => {
    // Pesan BARU (nomor beda)
    state.editNo = null;
    state.editId = null;
    state.cart = {};
    $('#custNote').value = '';
    closeSuccess();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  $('#btnDone').addEventListener('click', () => {
    state.editNo = null;
    state.editId = null;
    state.cart = {};
    $('#custNote').value = '';
    closeSuccess();
    toast('Terima kasih! Sampai jumpa 👋');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  $('#successModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeSuccess();
  });
});

// ---------- RENDER: CHIPS ----------
function renderChips() {
  const wrap = $('#chips');
  wrap.innerHTML = '';
  KATEGORI.forEach((k) => {
    const b = document.createElement('button');
    b.className = 'chip' + (state.kat === k.id ? ' active' : '');
    b.textContent = `${k.emoji} ${k.label}`;
    b.setAttribute('role', 'tab');
    b.addEventListener('click', () => {
      state.kat = k.id;
      wrap.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
      b.classList.add('active');
      renderMenu();
    });
    wrap.appendChild(b);
  });
}

// ---------- RENDER: MENU ----------
function filteredItems() {
  const habis = Store.getHabis();
  return MENU.filter((m) => {
    const okKat = state.kat === 'semua' || m.kat === state.kat;
    const okQ = !state.q || m.nama.toLowerCase().includes(state.q);
    return okKat && okQ;
  }).map((m) => ({ ...m, habis: habis.includes(m.id) }));
}

function renderMenu() {
  const items = filteredItems();
  const list = $('#menuList');
  list.innerHTML = '';

  if (!items.length) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="big">🔍</div>
        <p><strong>Nggak ketemu.</strong><br />Coba kata kunci lain ya.</p>
      </div>`;
    return;
  }

  // Kelompokkan per kategori (kecuali filter "semua" tetap dikelompokkan biar rapi)
  KATEGORI.filter((k) => k.id !== 'semua').forEach((k) => {
    const group = items.filter((m) => m.kat === k.id);
    if (!group.length) return;

    const title = document.createElement('div');
    title.className = 'cat-title';
    title.innerHTML = `<h2>${k.emoji} ${k.label}</h2><span>${group.length} menu</span>`;
    list.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'grid';
    group.forEach((m) => grid.appendChild(cardEl(m)));
    list.appendChild(grid);
  });
}

function cardEl(m) {
  const card = document.createElement('div');
  card.className = 'card' + (m.habis ? ' soldout' : '');
  card.dataset.id = m.id;
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', m.habis ? '-1' : '0');
  if (m.habis) card.setAttribute('aria-disabled', 'true');

  const qty = state.cart[m.id] || 0;

  card.innerHTML = `
    <div class="card-emoji">${m.emoji}</div>
    <div class="card-body">
      <div class="card-name">${m.nama}</div>
      <div class="card-price">${Store.rupiah(m.harga)}</div>
      ${m.habis ? '<span class="soldout-tag">Habis</span>' : ''}
    </div>
    ${qty > 0 ? stepperHTML(qty) : ''}
  `;

  if (!m.habis) {
    card.addEventListener('click', (e) => {
      const minusBtn = e.target.closest('[data-minus]');
      const plusBtn = e.target.closest('[data-plus]');
      if (minusBtn) changeQty(m.id, -1);
      else if (plusBtn) changeQty(m.id, +1);
      else if (!state.cart[m.id]) addToCart(m.id);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!state.cart[m.id]) addToCart(m.id);
      }
    });
  }
  return card;
}

function stepperHTML(qty) {
  return `
    <span class="qty-in-card">
      <button type="button" data-minus aria-label="Kurangi">−</button>
      <span>${qty}</span>
      <button type="button" data-plus aria-label="Tambah">+</button>
    </span>`;
}

// ---------- CART LOGIC ----------
function addToCart(id) {
  state.cart[id] = (state.cart[id] || 0) + 1;
  refreshCard(id);
  updateCartBar();
  toast(`+1 ${namaById(id)}`);
}

function changeQty(id, delta) {
  const next = (state.cart[id] || 0) + delta;
  if (next <= 0) delete state.cart[id];
  else state.cart[id] = Math.min(next, 99);
  refreshCard(id);
  updateCartBar();
  if ($('#cartModal').classList.contains('open')) renderCartItems();
}

function cartCount() {
  return Object.values(state.cart).reduce((a, b) => a + b, 0);
}
function cartTotal() {
  return Object.entries(state.cart).reduce(
    (sum, [id, qty]) => sum + hargaById(id) * qty, 0
  );
}
function namaById(id) { return (MENU.find((m) => m.id === id) || {}).nama || id; }
function hargaById(id) { return (MENU.find((m) => m.id === id) || {}).harga || 0; }

function refreshCard(id) {
  const card = $(`.card[data-id="${id}"]`);
  if (!card) return;
  const m = MENU.find((x) => x.id === id);
  const qty = state.cart[id] || 0;

  // Rerender bagian stepper saja
  const old = card.querySelector('.qty-in-card');
  if (old) old.remove();
  if (qty > 0) card.insertAdjacentHTML('beforeend', stepperHTML(qty));
}

function updateCartBar() {
  const n = cartCount();
  const bar = $('#cartBar');
  bar.classList.toggle('show', n > 0 && !$('#cartModal').classList.contains('open'));
  $('#cartBarTotal').textContent = Store.rupiah(cartTotal());
  $('#cartBarCount').textContent = `${n} item dipilih`;
  const badge = $('#cartBadge');
  if (badge) {
    badge.textContent = n;
    badge.classList.remove('pulse');
    void badge.offsetWidth; // trigger reflow
    if (n > 0) badge.classList.add('pulse');
  }
}

function refreshAll() {
  renderMenu();
  updateCartBar();
  if ($('#cartModal').classList.contains('open')) renderCartItems();
}

// ---------- MODAL KERANJANG ----------
function openCart() {
  renderCartItems();
  $('#cartModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  $('#cartBar').classList.remove('show');
}
function closeCart() {
  $('#cartModal').classList.remove('open');
  document.body.style.overflow = '';
  updateCartBar();
}

function renderCartItems() {
  const wrap = $('#cartItems');
  const entries = Object.entries(state.cart);

  if (!entries.length) {
    wrap.innerHTML = `
      <div class="cart-empty">
        <div class="big">🛒</div>
        Keranjang masih kosong.<br />Pilih menu dulu yuk!
      </div>`;
  } else {
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

    wrap.querySelectorAll('[data-inc]').forEach((b) =>
      b.addEventListener('click', () => changeQty(b.dataset.inc, +1)));
    wrap.querySelectorAll('[data-dec]').forEach((b) =>
      b.addEventListener('click', () => changeQty(b.dataset.dec, -1)));
  }

  $('#sumSubtotal').textContent = Store.rupiah(cartTotal());
  $('#sumTotal').textContent = Store.rupiah(cartTotal());
}

// ---------- CHECKOUT → KASIR ----------
async function submitOrder(e) {
  e.preventDefault();

  const entries = Object.entries(state.cart);
  if (!entries.length) {
    toast('Keranjang masih kosong 😅');
    return;
  }

  const submitBtn = $('#btnWa');
  if (submitBtn) submitBtn.disabled = true;

  try {
    const catatan = $('#custNote').value.trim();
    const items = entries.map(([id, qty]) => ({
      id, nama: namaById(id), harga: hargaById(id), qty,
    }));
    const total = cartTotal();

    // Mode EDIT: update order yang sama (ubah/tambah item ke #N)
    if (state.editId) {
      await DB.updateOrder(state.editId, {
        items,
        total,
        subtotal: total,
        catatan,
        order_type: state.orderType,
        updated_at: new Date().toISOString(),
        diubah: true,
      });
      const no = state.editNo;
      state.cart = {};
      state.editNo = null;
      state.editId = null;
      setTimeout(() => {
        closeCart();
        refreshAll();
        $('#successTitle').textContent = `Pesanan #${no} Diperbarui!`;
        $('#successBody').textContent = 'Perubahan sudah masuk ke layar kasir. Mau ubah lagi?';
        $('#successModal').classList.add('open');
        document.body.style.overflow = 'hidden';
      }, 400);
      toast(`Pesanan #${no} diperbarui ✏️`);
      return;
    }

    // Mode BARU: ambil nomor global berikutnya
    let no = await DB.nextOrderNo();
    if (!no) {
      // Fallback lokal jika RPC Supabase offline/gagal
      no = Math.floor(Date.now() / 1000) % 100000;
    }

    const order = {
      id: String(no),
      no,
      ts: new Date().toISOString(),
      items,
      subtotal: total,
      diskon: 0,
      total,
      bayar: 0,
      kembalian: 0,
      nama: '',
      meja: state.meja || '',
      catatan,
      order_type: state.orderType,
      metode: '',
      status: 'baru',
      origin: 'app',
    };
    Store.saveOrder(order);

    toast(`Pesanan #${no} masuk ke kasir ✅`);
    state.cart = {};
    setTimeout(() => {
      closeCart();
      refreshAll();
      // Tampilkan layar terkirim + opsi nambah lagi
      $('#successTitle').textContent = `Pesanan #${no} Terkirim!`;
      $('#successBody').textContent = 'Sudah masuk ke layar kasir. Mau nambah pesanan lagi?';
      $('#successModal').classList.add('open');
      document.body.style.overflow = 'hidden';
    }, 500);
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
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
