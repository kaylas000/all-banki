import fs from "node:fs";

/* Microservice 2: Human-Like Professional SEO Text Generator (No AI Footprint) */

export function sanitizeAIFootprint(text) {
  let cleaned = text;

  // Remove AI filler introductory phrases
  const aiFillers = [
    /в современном мире,?\s*/gi,
    /как известно,?\s*/gi,
    /не секрет, что\s*/gi,
    /важно отметить, что\s*/gi,
    /следует подчеркнуть, что\s*/gi,
    /нельзя не упомянуть, что\s*/gi,
    /подводя итоги,?\s*/gi,
    /в конечном итоге,?\s*/gi,
    /стоит обратить внимание на то, что\s*/gi
  ];

  aiFillers.forEach(re => {
    cleaned = cleaned.replace(re, "");
  });

  // Capitalize first letter of sentence if needed
  cleaned = cleaned.replace(/(^\s*|[.!?]\s+)([a-zа-я])/g, (m, p1, p2) => p1 + p2.toUpperCase());

  // Banned cliché replacements
  cleaned = cleaned.replace(/индивидуальный подход/gi, "персональный расчёт");
  cleaned = cleaned.replace(/высокое качество/gi, "надежность и соответствие стандартам ЦБ РФ");
  cleaned = cleaned.replace(/динамично развивающаяся/gi, "лидирующая");
  cleaned = cleaned.replace(/команда профессионалов/gi, "финансовые эксперты");
  cleaned = cleaned.replace(/свяжитесь с нами/gi, "обратитесь в службу поддержки");
  cleaned = cleaned.replace(/узнать больше/gi, "изучить подробности");

  return cleaned;
}

export function generateHumanSeoArticle(phraseObj) {
  const { keyword, category, targetSum, targetRate } = phraseObj;

  const titleCap = keyword.charAt(0).toUpperCase() + keyword.slice(1);

  let h2 = `Практическое руководство: ${titleCap}`;
  let p1 = `При выборе финансового продукта по запросу «${keyword}» ключевое значение имеют действующая процентная ставка, лимит финансирования и скорость принятия решения. По регламенту Банка России все аккредитованные организации обязаны раскрывать полную стоимость кредита (ПСК) до подписания договора.`;
  let p2 = `Для получения суммы ${targetSum} по ставке ${targetRate} заемщику требуется иметь постоянную регистрацию на территории РФ, возраст от 18 лет и действенный мобильный номер для подтверждения операций по СБП. Заявка заполняется онлайн за 2–5 минут.`;

  if (category === "mfo") {
    h2 = `Порядок мгновенного получения займа без проверок и отказов`;
    p1 = `Оформление микрозайма на карту по запросу «${keyword}» осуществляется через автоматический скоринг МФО. Программа проверяет базовые параметры заёмщика в режиме 24/7 без звонков родственникам и визитов в офис.`;
    p2 = `При первом обращении большинство микрофинансовых компаний предлагают льготную ставку 0% на первые 7–30 дней. Средства мгновенно зачисляются на именную банковскую карту сразу после СМС-подтверждения.`;
  } else if (category === "kredity") {
    h2 = `Правила оформления потребительского кредита наличными`;
    p1 = `Потребительское кредитование по условиям «${keyword}» позволяет получить финансирование до 5 000 000 рублей по паспорту гражданина РФ. Запрос обрабатывается скоринг-системой банка за 5 минут.`;
    p2 = `При онлайн-заявке заемщик получает предварительное решение в смс, после чего курьер бесплатно доставляет карту с деньгами или средства зачисляются на счет в мобильном приложении.`;
  }

  p1 = sanitizeAIFootprint(p1);
  p2 = sanitizeAIFootprint(p2);

  const checklist = [
    "Подготовьте оригинал паспорта гражданина РФ и дежурный телефон.",
    "Проверьте реквизиты вашей банковской карты для перевода денег по СБП.",
    "Сравните полную стоимость кредита (ПСК) и условия беспроцентного периода.",
    "Своевременно погашайте задолженность через приложение без комиссий."
  ];

  return {
    seoH2: h2,
    seoP1: p1,
    seoP2: p2,
    checklist
  };
}

if (process.argv[1].endsWith("text-service.mjs")) {
  const sampleText = generateHumanSeoArticle({
    keyword: "займ 5000 рублей на карту без проверок и звонков",
    category: "mfo",
    targetSum: "5 000 ₽",
    targetRate: "0%"
  });
  console.log("Microservice 2 [Human SEO Text Generator] output:");
  console.log(JSON.stringify(sampleText, null, 2));
}
