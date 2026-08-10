/* Bank Vitrina — Catalog Filter (отдельный от main.js) */

document.addEventListener('DOMContentLoaded', () => {

  const filterToggle = document.getElementById('filterToggle');
  const filterContent = document.getElementById('filterContent');
  if (filterToggle && filterContent) {
  }

  const pills = document.querySelectorAll('#filterPills .filter-pill');
  const searchInput = document.getElementById('searchInput');
  if (!pills.length) return;

  let activeCategory = 'all';

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      activeCategory = pill.dataset.category;
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      filterCatalog();
    });
  });

  if (searchInput) searchInput.addEventListener('input', filterCatalog);

  function filterCatalog() {
    const search = searchInput ? searchInput.value.toLowerCase() : '';
    const sections = document.querySelectorAll('.section[data-section]');

    sections.forEach(section => {
      const sectionCat = section.dataset.section;
      const sectionMatch = activeCategory === 'all' || sectionCat === activeCategory;
      const cards = section.querySelectorAll('.credit-card, .offer-card');
      let hasVisible = false;

      cards.forEach(card => {
        const name = (card.dataset.name || '').toLowerCase();
        const matchSearch = !search || name.includes(search);
        const show = sectionMatch && matchSearch;
        card.style.display = show ? '' : 'none';
        if (show) hasVisible = true;
      });

      section.style.display = (sectionMatch && hasVisible) ? '' : 'none';
    });
  }

});
