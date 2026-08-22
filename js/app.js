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
};

const $ = (sel) => document.querySelector(sel);

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
  // Isi data warung dari CONFIG
  $('#brandNama').textContent = CONFIG.namaWarung;
  $('#brandKota').textContent = CONFIG.kota;
  $('#jamBuka').textContent = CONFIG.jamBuka.replace('Setiap hari · ', '');
  $('#gmapsLink').href = CONFIG.gmapsUrl;
  $('#footNama').textContent = CONFIG.namaWarung;
  $('#footAlamat').textContent = CONFIG.alamat;
  $('#footJam').textContent = CONFIG.jamBuka;

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
  $('#cartBadge').textContent = n;
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

// ---------- CHECKOUT → WHATSAPP ----------
function submitOrder(e) {
  e.preventDefault();

  const entries = Object.entries(state.cart);
  if (!entries.length) {
    toast('Keranjang masih kosong 😅');
    return;
  }

  const nama = $('#custName').value.trim();
  const catatan = $('#custNote').value.trim();

  const lines = [];
  lines.push(`*PESANAN ${CONFIG.namaWarung.toUpperCase()}*`);
  lines.push('');
  entries.forEach(([id, qty], i) => {
    lines.push(`${i + 1}. ${namaById(id)} x${qty} — ${Store.rupiah(hargaById(id) * qty)}`);
  });
  lines.push('');
  lines.push(`Total: *${Store.rupiah(cartTotal())}*`);
  lines.push('');
  lines.push(`Nama: ${nama}`);
  lines.push(`Sajian: ${state.orderType}`);
  if (catatan) lines.push(`Catatan: ${catatan}`);

  const url = `https://wa.me/${CONFIG.waNomor}?text=${encodeURIComponent(lines.join('\n'))}`;
  window.open(url, '_blank');

  toast('Membuka WhatsApp… 🚀');
  state.cart = {};
  setTimeout(() => { closeCart(); refreshAll(); }, 600);
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
