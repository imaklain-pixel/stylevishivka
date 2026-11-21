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

function sourceName(url) {
  const pathname = new URL(url).pathname;
  return decodeURIComponent(pathname.split("/").pop());
}

const results = [];
const missing = [];
let cursor = 0;
const workers = Array.from({ length: Math.min(4, urls.length) }, async () => {
  while (cursor < urls.length) {
    const url = urls[cursor++];
    const response = await fetch(url, { redirect: "follow" });

    if (response.status === 404) {
      missing.push(url);
      console.log(`Missing source image (404), removing broken gallery entry: ${url}`);
      continue;
    }
    if (!response.ok) throw new Error(`Download failed (${response.status}): ${url}`);

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) throw new Error(`Not an image (${contentType}): ${url}`);

    const input = Buffer.from(await response.arrayBuffer());
    const originalName = sourceName(url);
    const baseName = originalName.replace(/\.[^.]+$/, "");
    const webpName = baseName + ".webp";
    const webpPath = path.join(imageDir, webpName);
    const tempPath = webpPath + ".tmp";

    const info = await sharp(input, { failOn: "error" })
      .rotate()
      .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80, effort: 5, smartSubsample: true })
      .toFile(tempPath);

    let finalName;
    let outputBytes;
    if (info.size < input.length) {
      await fs.rename(tempPath, webpPath);
      finalName = webpName;
      outputBytes = info.size;
    } else {
      await fs.rm(tempPath, { force: true });
      finalName = originalName;
      await fs.writeFile(path.join(imageDir, finalName), input);
      outputBytes = input.length;
    }

    results.push({ url, name: finalName, inputBytes: input.length, outputBytes });
    console.log(`Prepared ${finalName}: ${input.length} -> ${outputBytes} bytes`);
  }
});

await Promise.all(workers);

let updated = source;
for (const item of results) {
  updated = updated.split(item.url).join(`${imageDir}/${item.name}`);
}
for (const url of missing) {
  updated = updated.split(url).join("");
}
updated = updated.replace(
  "images.forEach(function(src, index) {",
  "images.forEach(function(src, index) {\n            if (!src) return;"
);
if (/https:\/\/imaklain\.github\.io\/my-vishivka-sit\//.test(updated)) {
  throw new Error("Some external gallery image URLs remain after replacement.");
}
await fs.writeFile(jsPath, updated, "utf8");

const before = results.reduce((sum, item) => sum + item.inputBytes, 0);
const after = results.reduce((sum, item) => sum + item.outputBytes, 0);
const saved = before ? (1 - after / before) * 100 : 0;
console.log(`Completed ${results.length} images; removed ${missing.length} broken references. Total: ${before} -> ${after} bytes (${saved.toFixed(1)}% smaller).`);
