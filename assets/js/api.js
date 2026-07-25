/**
 * Bank Vitrina — API интеграция с Affilead
 * 
 * Настройка:
 * 1. Получите client_id и client_secret у менеджера Affilead
 * 2. Вставьте их в конфиг ниже
 * 3. Токен обновляется автоматически
 */

const API_CONFIG = {
  baseUrl: 'https://api.affilead.ru',
  clientId: 'YOUR_CLIENT_ID',       // ← вставьте
  clientSecret: 'YOUR_CLIENT_SECRET', // ← вставьте
};

let accessToken = null;
let tokenExpires = 0;

// === Авторизация ===
async function getToken() {
  if (accessToken && Date.now() < tokenExpires) return accessToken;

  const res = await fetch(`${API_CONFIG.baseUrl}/auth/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: API_CONFIG.clientId,
      client_secret: API_CONFIG.clientSecret,
      scope: 'offers sources statistics'
    })
  });

  if (!res.ok) throw new Error(`Auth failed: ${res.status}`);
  const data = await res.json();
  accessToken = data.access_token;
  tokenExpires = Date.now() + (data.expires_in - 60) * 1000;
  return accessToken;
}

// === API запросы ===
async function apiGet(path) {
  const token = await getToken();
  const res = await fetch(`${API_CONFIG.baseUrl}${path}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return (await res.json());
}

// === Получение брендов с офферами ===
async function fetchBrands(options = {}) {
  const params = new URLSearchParams();
  if (options.category) params.set('category', options.category);
  if (options.limit) params.set('limit', options.limit);
  const qs = params.toString();
  return apiGet(`/v1/brands/${qs ? '?' + qs : ''}`);
}

// === Получение моих офферов ===
async function fetchMyOffers(options = {}) {
  const params = new URLSearchParams();
  if (options.category) params.set('category', options.category);
  if (options.brand_uuid) params.set('brand_uuid', options.brand_uuid);
  if (options.limit) params.set('limit', options.limit);
  const qs = params.toString();
  return apiGet(`/v1/offers/my/${qs ? '?' + qs : ''}`);
}

// === Получение деталей оффера ===
async function fetchOffer(uuid) {
  return apiGet(`/v1/offers/${uuid}/`);
}

// === Категории (из schema) ===
const CATEGORIES = {
  credits: 'Кредиты',
  cards: 'Карты',
  deposits: 'Вклады',
  investments: 'Инвестиции',
  loans: 'Займы',
  insurance: 'Страхование',
};

// === Пример использования ===
async function loadOffersToPage() {
  try {
    // Получить все бренды
    const brandsData = await fetchBrands({ limit: 100 });
    const brands = brandsData.results;

    // Для каждого бренда получить оферы
    for (const brand of brands) {
      console.log(`Бренд: ${brand.name}`);
      console.log(`Категории: ${brand.categories.map(c => c.slug).join(', ')}`);
      console.log(`Оферов: ${brand.offers.length}`);

      for (const offer of brand.offers) {
        console.log(`  - ${offer.name} (${offer.slug})`);
        console.log(`    Описание: ${offer.description}`);
        console.log(`    Тарифы: ${offer.actual_rates.length}`);
        for (const rate of offer.actual_rates) {
          console.log(`      ${rate.name}: ${rate.payout_size} (${rate.type})`);
        }
      }
    }
  } catch (err) {
    console.error('Ошибка загрузки оферов:', err);
  }
}
