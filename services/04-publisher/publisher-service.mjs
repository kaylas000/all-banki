import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { pingIndexNowEndpoints } from "./indexnow-service.mjs";

/* Microservice 4: Publisher & Instant IndexNow Pipeline for все-банки.site */

const siteDir = "/home/user/all-banki";
const DOMAIN_PUNYCODE = "xn----8sbccpvnx5a.site";

export function publishAllGeneratedPages() {
  console.log("Microservice 4 [Publisher] starting deployment pipeline for все-банки.site...");

  // 1. Update Sitemap
  const files = fs.readdirSync(siteDir).filter(f => f.endsWith(".html")).sort();
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${files.map(f => `  <url>
    <loc>https://${DOMAIN_PUNYCODE}/${f}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${f === "index.html" ? "1.0" : f.match(/^(kredity|mfo|zaymy|karty)\.html$/) ? "0.9" : "0.7"}</priority>
  </url>`).join("\n")}
</urlset>`;

  fs.writeFileSync(path.join(siteDir, "sitemap.xml"), sitemap, "utf8");
  console.log(`Updated sitemap.xml with ${files.length} URLs for ${DOMAIN_PUNYCODE}.`);

  // 2. Instant IndexNow Ping
  pingIndexNowEndpoints(files);

  // 3. Run Linters
  try {
    const linterOutput = execSync("node /home/user/ceh-veb/run-all-linters.mjs", { encoding: "utf8" });
    console.log(linterOutput);
  } catch (err) {
    console.error("Linter check failed!", err.stdout || err.message);
    throw new Error("Linter check failed. Publishing aborted.");
  }

  // 4. Git Commit and Push
  execSync("git config user.email 'agent@ceh-studio.local'", { cwd: siteDir });
  execSync("git config user.name 'CEH Studio Agent'", { cwd: siteDir });

  execSync("git add .", { cwd: siteDir });
  
  try {
    execSync("git commit -m '🤖 Microservices Pipeline: Auto-compiled & Published Programmatic Pages for все-банки.site'", { cwd: siteDir });
  } catch {
    console.log("No new git changes to commit.");
  }

  execSync("git push origin publish:publish --force", { cwd: siteDir });
  try {
    execSync("git push origin publish:master --force", { cwd: siteDir });
  } catch {
    console.log("Pushed to publish branch.");
  }

  console.log("GitHub deployment complete for все-банки.site (publish branch).");
  return { success: true, count: files.length };
}

if (process.argv[1].endsWith("publisher-service.mjs")) {
  publishAllGeneratedPages();
}
