import fs from "node:fs";
import path from "node:path";

const siteDir = "/home/user/all-banki";
const htmlFiles = fs.readdirSync(siteDir).filter(f => f.endsWith(".html"));

console.log(`Fixing links across ${htmlFiles.length} HTML files in all-banki...`);

let filesModified = 0;

htmlFiles.forEach(file => {
  const filePath = path.join(siteDir, file);
  let content = fs.readFileSync(filePath, "utf8");
  const orig = content;

  // Replace links missing .html extension
  content = content.replace(/href="([^"#/]+)"/g, (match, link) => {
    // Ignore external, asset files, anchors
    if (link.startsWith("http") || link.includes(".") || link.startsWith("#") || link.startsWith("data:") || link.startsWith("tel:") || link.startsWith("mailto:")) {
      return match;
    }
    const htmlTarget = link + ".html";
    if (fs.existsSync(path.join(siteDir, htmlTarget))) {
      return `href="${htmlTarget}"`;
    }
    return match;
  });

  // Also fix href="./" to href="index.html"
  content = content.replace(/href="\.\/"/g, 'href="index.html"');

  if (content !== orig) {
    fs.writeFileSync(filePath, content, "utf8");
    filesModified++;
  }
});

console.log(`Fixed internal links in ${filesModified} files.`);
