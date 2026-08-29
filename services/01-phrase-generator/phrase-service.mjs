import fs from "node:fs";

/* Microservice 1: Dynamic Low-Frequency Long-Tail Phrase Generator (Endless Unique Keywords) */

export function generateLowFrequencyPhrases(count = 30) {
  const baseSums = [1000, 2000, 3000, 5000, 7000, 10000, 15000, 20000, 25000, 30000, 50000, 100000, 200000, 300000, 500000, 1000000];
  const cities = ["moskva", "sankt-peterburg", "novosibirsk", "ekaterinburg", "kazan", "nizhnij-novgorod", "samara", "chelyabinsk", "omsk", "rostop-na-donu", "ufa", "krasnoyarsk"];
  const mfoModifiers = ["bez-zvonkov", "bez-otkaza", "mgnovenno-24-7", "po-sbp", "bez-raboty", "bez-strahovok", "pensioneram", "studentam", "bez-proverok"];
  const creditModifiers = ["bez-2-ndfl", "po-pasportu", "na-remont", "pod-zalog-avto", "pod-zalog-nedvizhimosti", "refinansirovanie", "ehkspress"];

  const generated = [];
  const timestamp = Date.now().toString().slice(-4);

  // 1. Generate MFO Loans
  for (let i = 0; i < count; i++) {
    const sum = baseSums[i % baseSums.length];
    const city = cities[i % cities.length];
    const mod = mfoModifiers[i % mfoModifiers.length];
    const cat = i % 2 === 0 ? "mfo" : i % 3 === 0 ? "kredity" : "karty";

    if (cat === "mfo") {
      generated.push({
        keyword: `займ ${sum} рублей на карту ${mod.replace(/-/g, " ")} в г. ${city.replace(/-/g, " ")}`,
        category: "mfo",
        slug: `zaym-${sum}-rublej-${mod}-${city}`,
        matrixLines: [`ЗАЙМ ${sum} ₽`, "НА КАРТУ МИР", mod.toUpperCase().replace(/-/g, " "), "ОДОБРЕНИЕ 98%"],
        targetSum: `${sum.toLocaleString("ru-RU")} ₽`,
        targetRate: "0%"
      });
    } else if (cat === "kredity") {
      generated.push({
        keyword: `потребительский кредит ${sum} рублей ${mod.replace(/-/g, " ")} в г. ${city.replace(/-/g, " ")}`,
        category: "kredity",
        slug: `kredit-${sum}-rublej-${mod}-${city}`,
        matrixLines: [`КРЕДИТ ${sum} ₽`, "ПО ПАСПОРТУ", mod.toUpperCase().replace(/-/g, " "), "СТАВКА 4.9%"],
        targetSum: `${sum.toLocaleString("ru-RU")} ₽`,
        targetRate: "от 4.9%"
      });
    } else {
      generated.push({
        keyword: `дебетовая карта с кэшбэком и бесплатным обслуживанием ${sum} рублей лимит`,
        category: "karty",
        slug: `karta-s-kashbekom-limit-${sum}-${city}`,
        matrixLines: ["БАНКОВСКАЯ КАРТА", "КЭШБЭК ДО 15%", "0 ₽ ОБСЛУЖИВАНИЕ", "ДОСТАВКА 1 ДЕНЬ"],
        targetSum: `${sum.toLocaleString("ru-RU")} ₽`,
        targetRate: "до 15%"
      });
    }
  }

  return generated.slice(0, count);
}

if (process.argv[1].endsWith("phrase-service.mjs")) {
  const testPhrases = generateLowFrequencyPhrases(30);
  console.log("Generated phrases count:", testPhrases.length);
  console.log("Sample 0:", testPhrases[0].slug);
  console.log("Sample 10:", testPhrases[10].slug);
}
