import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const jsPath = "js/portfolio.js";
const imageDir = "assets/images";
const source = await fs.readFile(jsPath, "utf8");
const urls = [...new Set(source.match(/https:\/\/imaklain-pixel\.github\.io\/my-vishivka-sit\/[^'"`\s]+/g) || [])];

if (urls.length === 0) {
  console.log("No external portfolio image URLs found; nothing to do.");
  process.exit(0);
}

await fs.mkdir(imageDir, { recursive: true });

function outputName(url) {
  const pathname = new URL(url).pathname;
  const original = decodeURIComponent(pathname.split("/").pop());
  return original.replace(/\.[^.]+$/, "") + ".webp";
}

const results = new Array(urls.length);
let cursor = 0;
const workers = Array.from({ length: Math.min(4, urls.length) }, async () => {
  while (cursor < urls.length) {
    const index = cursor++;
    const url = urls[index];
    const response = await fetch(url, { redirect: "follow" });
    if (!response.ok) throw new Error(`Download failed (${response.status}): ${url}`);
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) throw new Error(`Not an image (${contentType}): ${url}`);

    const input = Buffer.from(await response.arrayBuffer());
    const name = outputName(url);
    const destination = path.join(imageDir, name);
    const info = await sharp(input, { failOn: "error" })
      .rotate()
      .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82, effort: 5, smartSubsample: true })
      .toFile(destination);

    results[index] = { url, name, inputBytes: input.length, outputBytes: info.size };
    console.log(`Optimized ${name}: ${input.length} -> ${info.size} bytes`);
  }
});

await Promise.all(workers);

let updated = source;
for (const item of results) {
  updated = updated.split(item.url).join(`${imageDir}/${item.name}`);
}
if (/https:\/\/imaklain-pixel\.github\.io\/my-vishivka-sit\//.test(updated)) {
  throw new Error("Some external gallery image URLs remain after replacement.");
}
await fs.writeFile(jsPath, updated, "utf8");

const before = results.reduce((sum, item) => sum + item.inputBytes, 0);
const after = results.reduce((sum, item) => sum + item.outputBytes, 0);
const saved = before ? (1 - after / before) * 100 : 0;
console.log(`Completed ${results.length} images. Total: ${before} -> ${after} bytes (${saved.toFixed(1)}% smaller).`);
