/**
 * Bank Vitrina — Автозаполнение данными из API
 * 
 * Запуск: открой консоль браузера на странице и выполни loadAllOffers()
 * Результат: данные сохраняются в localStorage и отображаются на странице
 */

// === Загрузка всех офферов из API ===
async function loadAllOffers() {
  console.log('Загрузка оферов из API...');

  try {
    // Категории для загрузки
    const categories = ['credits', 'cards', 'deposits', 'investments', 'loans', 'insurance'];
    const allOffers = [];

    for (const cat of categories) {
      console.log(`Загрузка: ${cat}...`);
      const data = await fetchMyOffers({ category: cat, limit: 100 });
      if (data.results) {
        for (const offer of data.results) {
          allOffers.push({
            id: offer.uuid,
            name: offer.name,
            brand: offer.brand.name,
            brandUuid: offer.brand.uuid,
            category: cat,
            description: offer.description || '',
            siteUrl: offer.site_url || '',
            image: offer.image || '',
            rates: (offer.actual_rates || []).map(r => ({
              name: r.name,
              description: r.description,
              type: r.type,
              payoutSize: r.payout_size
            })),
            tags: (offer.tags || []).map(t => t.name),
            countries: (offer.countries || []).map(c => c.country.name)
          });
        }
      }
    }

    // Сохранить в localStorage
    localStorage.setItem('bankVitrina_offers', JSON.stringify(allOffers));
    console.log(`Загружено ${allOffers.length} офертов`);

    // Обновить страницу если есть контейнер
    renderOffers(allOffers);
    return allOffers;
  } catch (err) {
    console.error('Ошибка:', err);
    return [];
  }
}

// === Рендер оферов на странице ===
function renderOffers(offers) {
  const grid = document.getElementById('catalogGrid');
  if (!grid) return;

  grid.innerHTML = '';

  for (const offer of offers) {
    const rate = offer.rates[0] || {};
    const card = document.createElement('div');
    card.className = 'offer-card';
    card.dataset.category = offer.category;
    card.dataset.name = offer.name + ' ' + offer.brand;

    card.innerHTML = `
      <div class="offer-card-header">
        <div class="offer-bank-logo">${offer.brand.substring(0, 2).toUpperCase()}</div>
        <span style="font-size:0.8125rem;font-weight:600;color:var(--text-primary)">${offer.brand}</span>
      </div>
      <div class="offer-card-body">
        <div class="offer-card-title">${offer.name}</div>
        <div class="offer-card-description">${offer.description || 'Описание отсутствует'}</div>
        ${rate.name ? `<div class="offer-card-rate"><span class="offer-rate-value">${rate.name}</span></div>` : ''}
        <div class="offer-card-tags">
          ${offer.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>
      <div class="offer-card-footer">
        <a href="${offer.siteUrl || '#'}" class="btn-primary" target="_blank">Подробнее</a>
        <button class="btn-ghost">Сравнить</button>
      </div>
    `;

    grid.appendChild(card);
  }

  console.log(`Отрендерено ${offers.length} карточек`);
}

// === Загрузка из localStorage (офлайн) ===
function loadFromCache() {
  const cached = localStorage.getItem('bankVitrina_offers');
  if (cached) {
    const offers = JSON.parse(cached);
    renderOffers(offers);
    console.log(`Загружено из кеша: ${offers.length} офертов`);
    return offers;
  }
  return [];
}

// === Сброс кеша ===
function clearCache() {
  localStorage.removeItem('bankVitrina_offers');
  console.log('Кеш очищен');
}
