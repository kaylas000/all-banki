import { generateLowFrequencyPhrases } from "./01-phrase-generator/phrase-service.mjs";
import { generateHumanSeoArticle } from "./02-text-generator/text-service.mjs";
import { compileUniquePage } from "./03-page-compiler/page-compiler-service.mjs";
import { publishAllGeneratedPages } from "./04-publisher/publisher-service.mjs";

/* 🚀 SOTA 2026 PROGRAMMATIC MICROSERVICES ORCHESTRATOR FOR все-банки.site */

async function runProgrammaticPipeline() {
  const batchSize = parseInt(process.env.BATCH_SIZE || "30", 10);

  console.log("=================================================");
  console.log("🚀 STARTING CEH STUDIO PIPELINE FOR ВСЕ-БАНКИ.SITE");
  console.log(`Recommended Pacing: ${batchSize} pages/run (~100-160 pages/day)`);
  console.log("=================================================");

  // Step 1: Generate Low-Frequency Keywords
  console.log("\n[STEP 1/4] Generating Low-Frequency Long-Tail Keywords...");
  const phrases = generateLowFrequencyPhrases(batchSize);
  console.log(`Generated ${phrases.length} target keywords.`);

  // Step 2 & 3: Generate Human SEO Copy & Compile Unique Pages
  console.log("\n[STEP 2 & 3/4] Generating Human SEO Copy & Compiling CEH Unique Pages...");
  const compiledFiles = [];

  for (const p of phrases) {
    console.log(` -> Processing: "${p.keyword}" (${p.slug}.html)...`);
    const seoText = generateHumanSeoArticle(p);
    const pagePath = compileUniquePage(p, seoText);
    compiledFiles.push(pagePath);
  }

  // Step 4: Validate Linters & Publish
  console.log("\n[STEP 4/4] Validating Linters & Publishing to все-банки.site + IndexNow...");
  const publishResult = publishAllGeneratedPages();

  console.log("\n=================================================");
  console.log("🎉 PIPELINE COMPLETED SUCCESSFULLY FOR ВСЕ-БАНКИ.SITE!");
  console.log(`Total Published URLs: ${publishResult.count}`);
  console.log("=================================================");
}

runProgrammaticPipeline().catch(err => {
  console.error("Pipeline failed:", err);
  process.exit(1);
});
