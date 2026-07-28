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
    if (page === 'home') active = (path === '/' || path === '/index.html');
    else if (page === 'catalog') active = path.includes('catalog');
    else if (page === 'credits') active = path.includes('credits');
    else if (page === 'cards') active = path.includes('cards');
    else if (page === 'deposits') active = path.includes('deposits');
    else if (page === 'investments') active = path.includes('investments');
    else if (page === 'loans') active = path.includes('loans');
    else if (page === 'insurance') active = path.includes('insurance');
    else if (page === 'faq') active = path.includes('faq');
    else if (page === 'blog') active = path.includes('article');
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
