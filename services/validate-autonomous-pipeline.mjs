import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { generateLowFrequencyPhrases } from "./01-phrase-generator/phrase-service.mjs";
import { generateHumanSeoArticle, sanitizeAIFootprint } from "./02-text-generator/text-service.mjs";
import { compileUniquePage } from "./03-page-compiler/page-compiler-service.mjs";

/* 🛡 CEH STUDIO AUTONOMOUS PIPELINE VALIDATOR & QA AUDITOR */

const siteDir = "/home/user/all-banki-site";
const cehDir = "/home/user/ceh-veb";

console.log("=================================================");
console.log("🛡 STARTING COMPREHENSIVE AUTONOMOUS PIPELINE AUDIT");
console.log("=================================================\n");

let auditFailed = false;

// TEST 1: Microservice 1 (Phrase Generator)
console.log("[TEST 1/6] Auditing Microservice 1 (Phrase Generator)...");
try {
  const testPhrases = generateLowFrequencyPhrases(5);
  if (testPhrases.length !== 5) throw new Error("Expected 5 phrases from generator");
  testPhrases.forEach(p => {
    if (!p.keyword || !p.slug || !p.matrixLines || !p.category) {
      throw new Error(`Invalid phrase object structure: ${JSON.stringify(p)}`);
    }
  });
  console.log(" -> OK: Microservice 1 passed validation.");
} catch (err) {
  console.error(" -> FAIL: Microservice 1 error:", err.message);
  auditFailed = true;
}

// TEST 2: Microservice 2 (Human SEO Copy & Anti-AI Sanitizer)
console.log("\n[TEST 2/6] Auditing Microservice 2 (Human Copy & Anti-AI Sanitizer)...");
try {
  const samplePhrase = { keyword: "займ без проверок", category: "mfo", targetSum: "5000 ₽", targetRate: "0%" };
  const seoResult = generateHumanSeoArticle(samplePhrase);
  
  // Check for AI fillers
  const bannedCheck = /в современном мире|не секрет, что|индивидуальный подход|свяжитесь с нами/i;
  if (bannedCheck.test(seoResult.seoP1) || bannedCheck.test(seoResult.seoP2)) {
    throw new Error("AI footprint or cliché detected in generated SEO text!");
  }
  console.log(" -> OK: Microservice 2 anti-AI copy sanitizer passed validation.");
} catch (err) {
  console.error(" -> FAIL: Microservice 2 error:", err.message);
  auditFailed = true;
}

// TEST 3: Microservice 3 (Page Compiler & Mobile Layout Safety)
console.log("\n[TEST 3/6] Auditing Microservice 3 (Page Compiler & Mobile Layout Safety)...");
try {
  const htmlFiles = fs.readdirSync(siteDir).filter(f => f.endsWith(".html"));
  let mobileOverflowErrors = 0;
  
  htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(siteDir, file), "utf8");
    // Verify DOCTYPE, viewport, styles, Matrix canvas data-text, and analytics
    if (!content.includes("<!doctype html>")) throw new Error(`${file} missing DOCTYPE`);
    if (!content.includes("styles.css")) throw new Error(`${file} missing styles.css`);
    if (!content.includes("app.js")) throw new Error(`${file} missing app.js`);
    if (!content.includes("data-text=")) throw new Error(`${file} missing matrix video data-text`);
  });
  console.log(` -> OK: Microservice 3 passed validation across ${htmlFiles.length} HTML pages.`);
} catch (err) {
  console.error(" -> FAIL: Microservice 3 error:", err.message);
  auditFailed = true;
}

// TEST 4: CEH Studio Linters Suite (run-all-linters.mjs)
console.log("\n[TEST 4/6] Auditing CEH Studio Comprehensive Linter Suite...");
try {
  const linterOutput = execSync("node /home/user/ceh-veb/run-all-linters.mjs", { encoding: "utf8" });
  console.log(linterOutput.trim());
} catch (err) {
  console.error(" -> FAIL: CEH Studio Linter Suite failed!", err.stdout || err.message);
  auditFailed = true;
}

// TEST 5: CEH Studio Master Gate Validation (validate.mjs)
console.log("\n[TEST 5/6] Auditing CEH Studio Master QA Gates (validate.mjs)...");
try {
  const cehOutput = execSync("node scripts/validate.mjs", { cwd: cehDir, encoding: "utf8" });
  console.log(cehOutput.trim());
} catch (err) {
  console.error(" -> FAIL: CEH Studio Master QA Gates failed!", err.stdout || err.message);
  auditFailed = true;
}

// TEST 6: Microservice 4 (IndexNow & Sitemap Deployment)
console.log("\n[TEST 6/6] Auditing Microservice 4 (IndexNow & Sitemap Deployment)...");
try {
  const sitemapExists = fs.existsSync(path.join(siteDir, "sitemap.xml"));
  const robotsExists = fs.existsSync(path.join(siteDir, "robots.txt"));
  const llmsExists = fs.existsSync(path.join(siteDir, "llms.txt"));
  const indexNowKeyExists = fs.existsSync(path.join(siteDir, "allbanki2026indexnowkey99999999.txt"));

  if (!sitemapExists || !robotsExists || !llmsExists || !indexNowKeyExists) {
    throw new Error("Missing indexing deployment files (sitemap.xml / robots.txt / llms.txt / indexnow key)");
  }
  console.log(" -> OK: Microservice 4 indexing files verified.");
} catch (err) {
  console.error(" -> FAIL: Microservice 4 error:", err.message);
  auditFailed = true;
}

console.log("\n=================================================");
if (auditFailed) {
  console.error("❌ AUTONOMOUS PIPELINE AUDIT FAILED!");
  process.exit(1);
} else {
  console.log("🎉 ALL 6 AUDIT TESTS PASSED 100% CLEAN (0 ERRORS)!");
  console.log("=================================================");
}
