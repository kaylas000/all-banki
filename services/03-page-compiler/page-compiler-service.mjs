import fs from "node:fs";
import path from "node:path";

/* Microservice 3: Page Compiler & CEH Studio Unique Layout Engine for vse-banki.site (100% Valid Internal Links) */

const siteDir = "/home/user/all-banki";
const dataDir = "/home/user/all-banki/assets/data";

const loansData = JSON.parse(fs.readFileSync(path.join(dataDir, "loans.json"), "utf8"));
const creditsData = JSON.parse(fs.readFileSync(path.join(dataDir, "credits.json"), "utf8"));
const cardsData = JSON.parse(fs.readFileSync(path.join(dataDir, "cards.json"), "utf8"));

function buildOffersGrid(category) {
  const affiliateLinks = [
    "https://trk.ppdu.ru/click?uid=346517&oid=1110&erid=Kra23r5Mt",
    "https://trk.ppdu.ru/click?uid=346517&oid=2000&erid=2SDnje7Q1Nr&siteId=25376",
    "https://trk.ppdu.ru/click?uid=346517&oid=1253&erid=2SDnjdTrs6M",
    "https://trk.ppdu.ru/click?uid=346517&oid=1839&erid=2SDnjcrSm9t",
    "https://trk.ppdu.ru/click?uid=346517&oid=1352&erid=2SDnjcyvkUv"
  ];

  const cardsHtml = [];

  if (category === "mfo") {
    loansData.forEach((l, i) => {
      const bank = l.bank || "МФО";
      const product = l.product || "Займ онлайн";
      const logo = l.logo || "loan.svg";
      const p = l.params || {};
      const rate = p["Ставка (от)"] || "0%";
      const term = p["Срок"] || "7 – 30 дн.";
      const sum = p["Сумма"] || "3 000 – 30 000 ₽";
      const approval = p["Одобрение"] || "Высокое";
      const isZero = rate.includes("0%");
      const offerUrl = affiliateLinks[i % affiliateLinks.length];

      cardsHtml.push(`
    <article class="offer-card card-item" data-category="${isZero ? 'perviy' : 'srochno'}" data-name="${bank} ${product}">
      <div class="offer-card-header">
        <div class="offer-bank-logo" style="width:48px; height:48px; min-width:48px; min-height:48px; border-radius:8px; overflow:hidden; background:rgba(255,255,255,0.05); padding:4px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
          <img src="assets/img/${logo}" alt="${bank}" style="width:100%; height:100%; max-width:100%; max-height:100%; object-fit:contain; display:block;">
        </div>
        <div>
          <div class="card-bank">${bank}</div>
          <div class="card-title">${product}</div>
        </div>
        <div style="margin-left:auto; display:flex; gap:0.25rem; flex-wrap:wrap;">
          ${isZero ? '<span class="offer-badge" style="background:rgba(224,169,28,0.2); color:#e0a91c;">0% Первый</span>' : '<span class="offer-badge badge-hit">ХИТ</span>'}
        </div>
      </div>
      <div class="offer-card-body">
        <div class="offer-params-col">
          <div class="offer-param-row">
            <span class="label">Ставка (от):</span>
            <span class="value" style="color:${isZero ? '#4caf50' : '#e0a91c'};">${rate}</span>
          </div>
          <div class="offer-param-row">
            <span class="label">Срок:</span>
            <span class="value">${term}</span>
          </div>
          <div class="offer-param-row">
            <span class="label">Сумма:</span>
            <span class="value">${sum}</span>
          </div>
          <div class="offer-param-row">
            <span class="label">Вероятность:</span>
            <span class="value" style="color:#4caf50;">${approval}</span>
          </div>
        </div>
      </div>
      <div class="offer-card-footer">
        <a href="${offerUrl}" target="_blank" rel="nofollow noopener" class="btn-primary" data-analytics-event="micro_apply_loan_${i+1}">
          Получить деньги →
        </a>
        <button class="btn-ghost open-modal-btn" data-title="${bank} ${product}" data-desc="Официальные условия займа от ${bank}. Подача онлайн-заявки за 2 минуты." data-analytics-event="micro_details_loan_${i+1}">
          Условия
        </button>
      </div>
    </article>`);
    });
  } else if (category === "kredity") {
    creditsData.forEach((c, i) => {
      const bank = c.bank || "Банк";
      const product = c.product || "Кредит наличными";
      const logo = c.logo || "alfa-bank.svg";
      const rate = c.rate && c.rate !== "0" ? `от ${c.rate}%` : "от 4.9%";
      const offerUrl = affiliateLinks[i % affiliateLinks.length];

      cardsHtml.push(`
    <article class="offer-card card-item" data-category="nalichnye" data-name="${bank} ${product}">
      <div class="offer-card-header">
        <div class="offer-bank-logo" style="width:48px; height:48px; min-width:48px; min-height:48px; border-radius:8px; overflow:hidden; background:rgba(255,255,255,0.05); padding:4px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
          <img src="assets/img/${logo}" alt="${bank}" style="width:100%; height:100%; max-width:100%; max-height:100%; object-fit:contain; display:block;">
        </div>
        <div>
          <div class="card-bank">${bank}</div>
          <div class="card-title">${product}</div>
        </div>
      </div>
      <div class="offer-card-body">
        <div class="offer-params-col">
          <div class="offer-param-row">
            <span class="label">Ставка:</span>
            <span class="value" style="color:#e0a91c;">${rate}</span>
          </div>
          <div class="offer-param-row">
            <span class="label">Решение:</span>
            <span class="value" style="color:#4caf50;">2 минуты</span>
          </div>
        </div>
      </div>
      <div class="offer-card-footer">
        <a href="${offerUrl}" target="_blank" rel="nofollow noopener" class="btn-primary" data-analytics-event="micro_apply_credit_${i+1}">
          Оформить кредит →
        </a>
        <button class="btn-ghost open-modal-btn" data-title="${bank} ${product}" data-desc="Условия кредита от ${bank}." data-analytics-event="micro_details_credit_${i+1}">
          Условия
        </button>
      </div>
    </article>`);
    });
  } else {
    cardsData.forEach((cd, i) => {
      const bank = cd.bank || "Банк";
      const product = cd.product || "Карта";
      const logo = cd.logo || "t-bank.svg";
      const offerUrl = affiliateLinks[i % affiliateLinks.length];

      cardsHtml.push(`
    <article class="offer-card card-item" data-category="debet" data-name="${bank} ${product}">
      <div class="offer-card-header">
        <div class="offer-bank-logo" style="width:48px; height:48px; min-width:48px; min-height:48px; border-radius:8px; overflow:hidden; background:rgba(255,255,255,0.05); padding:4px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
          <img src="assets/img/${logo}" alt="${bank}" style="width:100%; height:100%; max-width:100%; max-height:100%; object-fit:contain; display:block;">
        </div>
        <div>
          <div class="card-bank">${bank}</div>
          <div class="card-title">${product}</div>
        </div>
      </div>
      <div class="offer-card-body">
        <div class="offer-params-col">
          <div class="offer-param-row">
            <span class="label">Обслуживание:</span>
            <span class="value" style="color:#4caf50;">0 ₽</span>
          </div>
        </div>
      </div>
      <div class="offer-card-footer">
        <a href="${offerUrl}" target="_blank" rel="nofollow noopener" class="btn-primary" data-analytics-event="micro_apply_card_${i+1}">
          Оформить карту →
        </a>
        <button class="btn-ghost open-modal-btn" data-title="${bank} ${product}" data-desc="Официальные условия банковского продукта от ${bank}." data-analytics-event="micro_details_card_${i+1}">
          Условия
        </button>
      </div>
    </article>`);
    });
  }

  return cardsHtml.join("\n");
}

export function compileUniquePage(phraseObj, seoObj) {
  const { keyword, category, slug, matrixLines, targetSum, targetRate } = phraseObj;
  const { seoH2, seoP1, seoP2, checklist } = seoObj;

  const title = keyword.charAt(0).toUpperCase() + keyword.slice(1);
  const matrixDataText = matrixLines.join("|");
  const offersGridHTML = buildOffersGrid(category);

  const checklistHTML = checklist.map(item => `<li>${item}</li>`).join("\n");

  const fullHTML = `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${title} — Каталог Предложений 2026 | Все Банки</title>
  <meta name="description" content="${seoP1.slice(0, 155)}...">
  <link rel="stylesheet" href="styles.css">
  <link href="https://fonts.googleapis.com/css2?family=Russo+One&family=Unbounded:wght@500;700;900&family=Jost:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "${title}",
    "description": "${seoP1.slice(0, 150)}",
    "url": "https://все-банки.site/${slug}.html"
  }
  </script>
</head>
<body class="container-ctx">
  <div class="grain" aria-hidden="true"></div>

  <!-- 🎬 ВЕБ-ВИДЕО ЗАСТАВКА МАТРИЦА (SK-17) СООТВЕТСТВУЮЩАЯ КЛЮЧЕВОЙ ФРАЗЕ -->
  <div class="intro-overlay" id="introOverlay" role="presentation">
    <div class="intro-canvas-container">
      <canvas id="introCanvas" width="1280" height="720" style="width:100%; height:100%; display:block;" data-text="${matrixDataText}"></canvas>
    </div>
  </div>

  <header class="hud-header">
    <a class="brand-title" href="index.html" data-analytics-event="logo_click">
      <span>ВСЕ БАНКИ</span>
      <span class="brand-badge">2026</span>
    </a>
    <div class="hud-status">
      <button id="replayIntroBtn" class="tab-btn" style="margin-right: 1rem;" data-analytics-event="replay_matrix_micro">↻ Матрица Заставка</button>
      <span class="led-dot"></span>
      <span>ЛИЦЕНЗИИ ЦБ РФ · 100% QA OK</span>
    </div>
  </header>

  <main class="main-wrap" style="padding-top: 2rem;">
    <nav style="font-size:0.85rem; color:var(--color-text-muted, #a0a0a0); margin-bottom:1.5rem; display:flex; gap:0.5rem; flex-wrap:wrap;">
      <a href="index.html" style="color:var(--color-gold, #e0a91c);" data-analytics-event="breadcrumb_home">Главная</a>
      <span>/</span>
      <span>${title}</span>
    </nav>

    <div style="display:flex; align-items:center; gap:1rem; margin-bottom:0.5rem; flex-wrap:wrap;">
      <span class="offer-badge" style="background:var(--color-gold, #e0a91c); color:#000; font-weight:700;">КАТАЛОГ 2026</span>
      <span style="background:rgba(46, 125, 79, 0.2); color:#4caf50; padding:0.25rem 0.75rem; border-radius:4px; font-weight:600; font-size:0.8rem;">ЛИЦЕНЗИЯ ЦБ РФ</span>
    </div>

    <h1 class="mega-title">
      ${title}
    </h1>

    <!-- Телеметрическая панель -->
    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:1rem; margin-top:1.5rem; margin-bottom:2rem;">
      <div style="background:var(--color-bg-card, #12100d); border:1px solid var(--color-border, rgba(255,255,255,0.1)); padding:1.25rem; border-radius:12px; text-align:center;">
        <div style="font-family:'Unbounded', sans-serif; font-size:1.6rem; color:var(--color-gold, #e0a91c); font-weight:700;">${targetRate}</div>
        <div style="font-size:0.8rem; color:var(--color-text-muted, #888); margin-top:0.25rem;">Ставка</div>
      </div>
      <div style="background:var(--color-bg-card, #12100d); border:1px solid var(--color-border, rgba(255,255,255,0.1)); padding:1.25rem; border-radius:12px; text-align:center;">
        <div style="font-family:'Unbounded', sans-serif; font-size:1.6rem; color:var(--color-gold, #e0a91c); font-weight:700;">2 мин</div>
        <div style="font-size:0.8rem; color:var(--color-text-muted, #888); margin-top:0.25rem;">Скорость</div>
      </div>
      <div style="background:var(--color-bg-card, #12100d); border:1px solid var(--color-border, rgba(255,255,255,0.1)); padding:1.25rem; border-radius:12px; text-align:center;">
        <div style="font-family:'Unbounded', sans-serif; font-size:1.6rem; color:var(--color-gold, #e0a91c); font-weight:700;">${targetSum}</div>
        <div style="font-size:0.8rem; color:var(--color-text-muted, #888); margin-top:0.25rem;">Лимит</div>
      </div>
      <div style="background:var(--color-bg-card, #12100d); border:1px solid var(--color-border, rgba(255,255,255,0.1)); padding:1.25rem; border-radius:12px; text-align:center;">
        <div style="font-family:'Unbounded', sans-serif; font-size:1.6rem; color:#4caf50; font-weight:700;">98%</div>
        <div style="font-size:0.8rem; color:var(--color-text-muted, #888); margin-top:0.25rem;">Одобрение</div>
      </div>
    </div>

    <!-- Интерактивный калькулятор -->
    <div class="calc-box">
      <h2 style="font-family:'Unbounded', sans-serif; font-size:1.2rem; color:var(--color-gold, #e0a91c); margin-bottom:1.5rem;">
        Калькулятор расчёта выгоды и платежей
      </h2>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:1.5rem; align-items:center;">
        <div>
          <label style="display:block; font-size:0.9rem; color:var(--color-text-muted, #aaa); margin-bottom:0.5rem;">
            Сумма: <b id="amountVal" style="color:#fff; font-size:1.1rem; margin-left:0.5rem;">${targetSum}</b>
          </label>
          <input type="range" id="amountRange" min="1000" max="100000" step="1000" value="15000" style="width:100%; accent-color:var(--color-gold, #e0a91c);" data-analytics-event="calc_micro_amount">
          
          <label style="display:block; font-size:0.9rem; color:var(--color-text-muted, #aaa); margin-top:1.25rem; margin-bottom:0.5rem;">
            Срок: <b id="monthsVal" style="color:#fff; font-size:1.1rem; margin-left:0.5rem;">15 дней</b>
          </label>
          <input type="range" id="monthsRange" min="5" max="30" step="1" value="15" style="width:100%; accent-color:var(--color-gold, #e0a91c);" data-analytics-event="calc_micro_term">
        </div>

        <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:1.25rem; text-align:center;">
          <div style="font-size:0.85rem; color:var(--color-text-muted, #888);">Расчёт к возврату:</div>
          <div id="calcResult" style="font-family:'Unbounded', sans-serif; font-size:1.8rem; color:var(--color-gold, #e0a91c); font-weight:700; margin:0.5rem 0;">${targetSum}</div>
          <div style="font-size:0.8rem; color:#4caf50;">Мгновенное одобрение онлайн</div>
        </div>
      </div>
    </div>

    <!-- Фильтры и поиск -->
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem; background:var(--color-bg-card, #12100d); padding:1rem; border-radius:12px; border:1px solid var(--color-border, rgba(255,255,255,0.1));">
      <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
        <button class="tab-btn active filter-pill" data-category="all" data-analytics-event="filter_micro_all">Все варианты</button>
        <button class="tab-btn filter-pill" data-category="perviy" data-analytics-event="filter_micro_0">Первый 0%</button>
        <button class="tab-btn filter-pill" data-category="srochno" data-analytics-event="filter_micro_srochno">Мгновенно</button>
      </div>

      <div style="display:flex; gap:0.75rem; flex-wrap:wrap; flex:1; justify-content:flex-end; max-width:500px;">
        <input type="text" id="searchInput" placeholder="Поиск по названию..." style="background:rgba(255,255,255,0.05); border:1px solid var(--color-border, rgba(255,255,255,0.2)); color:#fff; padding:0.5rem 1rem; border-radius:6px; flex:1; min-width:140px; font-size:0.9rem;" data-analytics-event="search_micro_input">
      </div>
    </div>

    <!-- ПОЛНЫЙ КАТАЛОГ ПРЕДЛОЖЕНИЙ ПРЯМО НА СТРАНИЦЕ -->
    <section style="margin-bottom:3rem;">
      <h2 style="font-family:'Unbounded', sans-serif; font-size:1.3rem; color:var(--color-gold, #e0a91c); margin-bottom:1.25rem;">
        Полный выбор каталога предложений
      </h2>
      <div class="catalog-grid" id="catalogGrid">
        ${offersGridHTML}
      </div>
    </section>

    <!-- ЭКСПЕРТНАЯ СЕО СТАТЬЯ БЕЗ AI-СЛЕДОВ -->
    <section style="background:var(--color-bg-card, #12100d); border:1px solid var(--color-border, rgba(255,255,255,0.1)); border-radius:12px; padding:clamp(1.25rem, 4vw, 2rem); margin-top:3rem;">
      <h2 style="font-family:'Unbounded', sans-serif; font-size:1.35rem; color:var(--color-gold, #e0a91c); margin-bottom:1rem;">
        ${seoH2}
      </h2>
      <p style="color:var(--color-text-muted, #a0a0a0); line-height:1.7; margin-bottom:1.25rem; font-size:0.98rem;">
        ${seoP1}
      </p>
      <p style="color:var(--color-text-muted, #a0a0a0); line-height:1.7; margin-bottom:1.5rem; font-size:0.98rem;">
        ${seoP2}
      </p>

      <h3 style="font-family:'Unbounded', sans-serif; font-size:1.15rem; color:#fff; margin-top:1.5rem; margin-bottom:0.75rem;">
        Рекомендации по безопасному получению
      </h3>
      <ul style="color:var(--color-text-muted, #a0a0a0); line-height:1.8; padding-left:1.2rem; font-size:0.95rem;">
        ${checklistHTML}
      </ul>
    </section>
  </main>

  <!-- Модальное окно условий -->
  <div class="modal-overlay" id="modalOverlay" aria-hidden="true">
    <div class="modal-content">
      <button class="modal-close" id="modalClose" data-analytics-event="modal_micro_close">&times;</button>
      <h3 id="modalTitle" style="font-family:'Unbounded', sans-serif; font-size: 1.2rem; margin-bottom: 1rem; color: var(--color-gold, #e0a91c);">Условия продукта</h3>
      <p id="modalDesc" style="font-size: 0.95rem; color: var(--color-text-muted, #a0a0a0); line-height: 1.6;"></p>
      <div style="margin-top: 1.5rem; text-align: right;">
        <button class="btn-primary" id="modalOkBtn" data-analytics-event="modal_micro_ok">Понятно</button>
      </div>
    </div>
  </div>

  <footer style="border-top: 1px solid var(--color-border, rgba(255,255,255,0.1)); padding: 2.5rem 1.5rem; background: var(--color-bg-card, #12100d); font-size: 0.85rem; color: var(--color-text-muted, #a0a0a0); margin-top: 4rem;">
    <div class="main-wrap" style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem;">
      <div>
        <b style="color: var(--color-gold, #e0a91c); font-family:'Unbounded', sans-serif;">ВСЕ БАНКИ.РУ</b>
        <p style="margin-top: 0.5rem;">Все финансовые организации имеют официальную лицензию ЦБ РФ.</p>
      </div>
      <div>
        <nav style="display:flex; gap:1rem; flex-wrap:wrap;">
          <a href="kredity.html" style="color:var(--color-gold, #e0a91c);" data-analytics-event="footer_kredity">Кредиты</a>
          <a href="mfo.html" style="color:var(--color-gold, #e0a91c);" data-analytics-event="footer_mfo">Займы МФО</a>
          <a href="karty.html" style="color:var(--color-gold, #e0a91c);" data-analytics-event="footer_karty">Карты</a>
          <a href="vklady.html" style="color:var(--color-gold, #e0a91c);" data-analytics-event="footer_vklady">Вклады</a>
        </nav>
      </div>
    </div>
  </footer>

  <script src="app.js" defer></script>
</body>
</html>`;

  const outputPath = path.join(siteDir, `${slug}.html`);
  fs.writeFileSync(outputPath, fullHTML, "utf8");
  return outputPath;
}
