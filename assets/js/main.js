/* Bank Vitrina — JS (только интерактив, без async загрузки) */

document.addEventListener('DOMContentLoaded', () => {

  // === MOBILE MENU ===
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  if (mobileBtn && mobileNav) {
    mobileBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('show');
      document.body.classList.toggle('menu-open');
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('show');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // === ACTIVE PAGE ===
  const path = location.pathname;
  document.querySelectorAll('[data-page]').forEach(link => {
    const page = link.dataset.page;
    let active = false;
    if (page === 'home') active = path.endsWith('/') || path.endsWith('/index') || path.endsWith('/index.html');
    else if (page === 'catalog') active = path.includes('catalog');
    else if (page === 'credits') active = path.includes('credit') || path.includes('offer');
    else if (page === 'cards') active = path.includes('card');
    else if (page === 'deposits') active = path.includes('deposit');
    else if (page === 'investments') active = path.includes('invest');
    else if (page === 'loans') active = path.includes('loan') || path.includes('mfo');
    else if (page === 'mortgage') active = path.includes('mortgage');
    else if (page === 'insurance') active = path.includes('insurance') || path.includes('ins-');
    else if (page === 'rko') active = path.includes('rko');
    else if (page === 'faq') active = path.includes('faq');
    else if (page === 'blog') active = path.includes('blog');
    link.classList.toggle('active', active);
  });

  // === FAQ ACCORDION ===
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = btn.classList.contains('active');
      btn.classList.toggle('active', !isOpen);
      answer.style.maxHeight = isOpen ? '0' : answer.scrollHeight + 'px';
    });
  });

  // === OFFER CALCULATOR ===
  const calcGrid = document.querySelector('.calc-grid-2');
  const calcResults = document.querySelector('.calc-grid-3');
  if (calcGrid && calcResults) {
    const isCardCalc = calcGrid.dataset.calc === 'card';
    const rateEl = document.querySelector('.offer-detail-rate-value');
    const rateText = String(rateEl?.textContent || '').replace(/[^\d.,]/g, '').replace(',', '.');
    const rate = parseFloat(rateText) || 0;
    if (rate > 0 && !isCardCalc) {
      const inputs = calcGrid.querySelectorAll('input');
      const sumEl = inputs[0];
      const termEl = inputs[1];
      const vals = calcResults.querySelectorAll('div[style*="font-size:1.5rem"]');
      const payEl = vals[0];
      const totalEl = vals[1];
      const overEl = vals[2];
      if (sumEl && termEl && payEl && totalEl && overEl) {
        const fmt = n => Math.round(n).toLocaleString('ru-RU') + ' ₽';
        const calc = () => {
          const sum = parseFloat(String(sumEl.value).replace(/[^\d.]/g, '')) || 0;
          const months = parseInt(String(termEl.value).replace(/\D/g, ''), 10) || 0;
          if (!sum || !months) {
            payEl.textContent = '—';
            totalEl.textContent = '—';
            overEl.textContent = '—';
            return;
          }
          const i = rate / 100 / 12;
          const pay = i === 0 ? sum / months : sum * i * Math.pow(1 + i, months) / (Math.pow(1 + i, months) - 1);
          const total = pay * months;
          payEl.textContent = fmt(pay);
          totalEl.textContent = fmt(total);
          overEl.textContent = fmt(total - sum);
        };
        sumEl.addEventListener('input', calc);
        termEl.addEventListener('input', calc);
        calc();
      }
    }
  }

  // === CARD CALCULATOR (кэшбэк) ===
  const cardCalc = document.querySelector('.calc-grid-2[data-calc="card"]');
  const cardResults = document.querySelector('.calc-grid-3');
  if (cardCalc && cardResults) {
    const cashbackRate = parseFloat(cardCalc.dataset.cashback || '0');
    const inputs = cardCalc.querySelectorAll('input');
    const spendEl = inputs[0];
    const limitEl = inputs[1];
    const vals = cardResults.querySelectorAll('div[style*="font-size:1.5rem"]');
    const cbEl = vals[0];
    const totalEl = vals[1];
    const restEl = vals[2];
    if (spendEl && limitEl && cbEl && totalEl && restEl) {
      const fmt = n => Math.round(n).toLocaleString('ru-RU') + ' ₽';
      const calc = () => {
        const spend = parseFloat(String(spendEl.value).replace(/[^\d.]/g, '')) || 0;
        const limit = parseFloat(String(limitEl.value).replace(/[^\d.]/g, '')) || 0;
        const cb = spend * cashbackRate / 100;
        cbEl.textContent = fmt(cb);
        totalEl.textContent = fmt(spend - cb);
        restEl.textContent = limit ? fmt(Math.max(0, limit - spend)) : '—';
      };
      spendEl.addEventListener('input', calc);
      limitEl.addEventListener('input', calc);
      calc();
    }
  }

  // === FILTER TOGGLE (Mobile) ===
  const filterToggle = document.getElementById('filterToggle');
  const filterContent = document.getElementById('filterContent');
  if (filterToggle && filterContent) {
    filterToggle.addEventListener('click', () => {
      filterToggle.classList.toggle('active');
      filterContent.classList.toggle('show');
    });
  }

  // === FILTERS (Catalog Page) ===
  const pills = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.offer-card, .credit-card');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const emptyState = document.getElementById('emptyState');
  if (!pills.length || !cards.length) return;

  let activeCategory = 'all';

  const params = new URLSearchParams(location.search);
  const urlCategory = params.get('category');
  if (urlCategory) {
    activeCategory = urlCategory;
    pills.forEach(p => p.classList.toggle('active', p.dataset.category === urlCategory));
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      activeCategory = pill.dataset.category;
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      filterCards();
    });
  });

  if (searchInput) searchInput.addEventListener('input', filterCards);
  if (sortSelect) sortSelect.addEventListener('change', sortCards);

  function filterCards() {
    const search = searchInput?.value.toLowerCase() || '';
    let visible = 0;
    cards.forEach(card => {
      const cat = card.dataset.category;
      const name = (card.dataset.name || '').toLowerCase();
      const matchCat = activeCategory === 'all' || cat === activeCategory;
      const matchSearch = !search || name.includes(search);
      card.style.display = (matchCat && matchSearch) ? '' : 'none';
      if (matchCat && matchSearch) visible++;
    });
    if (emptyState) emptyState.style.display = visible === 0 ? 'block' : 'none';
  }

  function sortCards() {
    const grid = document.getElementById('catalogGrid');
    if (!grid) return;
    const arr = Array.from(cards);
    const sort = sortSelect.value;
    arr.sort((a, b) => {
      if (sort === 'rate-asc') return parseFloat(a.dataset.rate || 0) - parseFloat(b.dataset.rate || 0);
      if (sort === 'rate-desc') return parseFloat(b.dataset.rate || 0) - parseFloat(a.dataset.rate || 0);
      if (sort === 'name') return (a.dataset.name || '').localeCompare(b.dataset.name || '');
      return 0;
    });
    arr.forEach(card => grid.appendChild(card));
  }

});
