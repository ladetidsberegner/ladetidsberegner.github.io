// build-live.js
import fs from "fs";

const input = "index.html";
const output = "index-live.html";

let html = fs.readFileSync(input, "utf8");

// Fjern dev-scripts og SW/manifest
html = html
  .replace(/<script[^>]*live[^>]*><\/script>/gi, "")
  .replace(/<script[^>]*sw-cleanup[^>]*><\/script>/gi, "")
  .replace(/<link[^>]*(manifest|webmanifest)[^>]*>/gi, "")
  .replace(/<!--\s*dev-only[\s\S]*?-->/gi, "")
  .replace(/<!--\s*LIVE-REMOVE-START[\s\S]*LIVE-REMOVE-END\s*-->/gi, "");

// Fjern eventuelle inline SW-registreringer
html = html.replace(/navigator\.serviceWorker\.register\([^)]*\);?/gi, "");

// Valgfrit: Fjern alle console.logs i dine scripts (du kan slå dette fra)
html = html.replace(/console\.(log|warn|error)\([^)]*\);?/g, "");

// Gem produktionklar version
fs.writeFileSync(output, html);
console.log(`✅ Live-version gemt som ${output}`);
