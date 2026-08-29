import fs from "node:fs";
import path from "node:path";

const siteDir = "/home/user/all-banki";
const htmlFiles = fs.readdirSync(siteDir).filter(f => f.endsWith(".html"));

console.log("Fixing relative paths and JS template strings in all-banki...");

let filesModified = 0;

htmlFiles.forEach(file => {
  const filePath = path.join(siteDir, file);
  let content = fs.readFileSync(filePath, "utf8");
  const orig = content;

  // Replace ../assets/ with assets/
  content = content.replace(/(?:href|src)="\.\.\/assets\//g, (m) => m.replace("../assets/", "assets/"));

  if (content !== orig) {
    fs.writeFileSync(filePath, content, "utf8");
    filesModified++;
  }
});

console.log(`Fixed relative asset paths in ${filesModified} files.`);
