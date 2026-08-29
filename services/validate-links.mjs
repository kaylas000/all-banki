import fs from "node:fs";
import path from "node:path";

/* 🔗 CEH STUDIO LINK & ASSET INTEGRITY VALIDATOR */

const siteDir = "/home/user/all-banki";
const htmlFiles = fs.readdirSync(siteDir).filter(f => f.endsWith(".html"));

console.log(`[Link & Asset Validator] Checking ${htmlFiles.length} HTML files...`);

let totalChecked = 0;
let brokenCount = 0;
const brokenReport = [];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(siteDir, file), "utf8");
  
  // Extract all href and src attributes
  const hrefs = [...content.matchAll(/(?:href|src)="([^"]+)"/g)].map(m => m[1]);

  hrefs.forEach(link => {
    // Ignore external links, anchors, data URIs, tel/mailto
    if (link.startsWith("http://") || link.startsWith("https://") || link.startsWith("#") || link.startsWith("data:") || link.startsWith("tel:") || link.startsWith("mailto:")) {
      return;
    }

    totalChecked++;

    let cleanLink = link.split("?")[0].split("#")[0];
    if (cleanLink === "" || cleanLink === "./") cleanLink = "index.html";

    // If cleanLink doesn't have an extension and isn't a directory, check if .html exists
    let targetPath = path.join(siteDir, cleanLink);
    if (!fs.existsSync(targetPath)) {
      if (fs.existsSync(targetPath + ".html")) {
        // Link is missing .html extension!
        brokenCount++;
        brokenReport.push({ source: file, link, issue: "Missing .html extension" });
      } else {
        brokenCount++;
        brokenReport.push({ source: file, link, issue: "Target file does not exist" });
      }
    }
  });
});

console.log(`\n==========================================`);
console.log(`Total Links & Assets Checked: ${totalChecked}`);
console.log(`Broken Links & Assets Count: ${brokenCount}`);
if (brokenCount > 0) {
  console.log("\nBroken Links & Assets Report:");
  brokenReport.slice(0, 20).forEach(b => console.log(` -> ${b.source}: link="${b.link}" (${b.issue})`));
} else {
  console.log("\n🎉 ALL INTERNAL LINKS AND ASSETS ARE 100% VALID AND ACCESSIBLE!");
}
console.log(`==========================================\n`);

process.exit(brokenCount === 0 ? 0 : 1);
