import { chromium } from 'playwright';
import fs from 'node:fs';

fs.mkdirSync('artifacts', { recursive: true });
const browser = await chromium.launch({ headless: true });
const failures = [];
const pageErrors = [];

async function checkViewport(name, viewport) {
  const context = await browser.newContext({ viewport, userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' });
  const page = await context.newPage();
  page.on('pageerror', error => pageErrors.push(`${name}: ${error.message}`));
  const response = await page.goto('http://127.0.0.1:4173/portfolio.html', { waitUntil: 'networkidle' });
  console.log(`DEBUG ${name}: status=${response?.status()} url=${page.url()} title=${await page.title()} body=${(await page.locator('body').innerText()).slice(0, 700)}`);

  const categories = [
    { id: 'hats', title: 'Кепки' },
    { id: 'patches', title: 'Нашивки' },
    { id: 'clothing', title: 'Одежда' }
  ];

  for (const category of categories) {
    await page.locator(`.category-card`).nth(categories.findIndex(item => item.id === category.id)).click();
    const gallery = page.locator(`#gallery-${category.id}`);
    await gallery.waitFor({ state: 'visible' });
    const images = gallery.locator('img');
    const count = await images.count();
    if (!count) failures.push(`${name}: ${category.title} — галерея пустая`);

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      await img.scrollIntoViewIfNeeded();
      try {
        await img.evaluate(element => element.decode());
        const width = await img.evaluate(element => element.naturalWidth);
        if (!width) failures.push(`${name}: ${category.title} — изображение ${i + 1} не загрузилось`);
      } catch (error) {
        failures.push(`${name}: ${category.title} — изображение ${i + 1}: ${error.message}`);
      }
    }

    const dimensions = await page.evaluate(() => ({
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth
    }));
    if (dimensions.document > dimensions.viewport + 1) {
      failures.push(`${name}: ${category.title} — горизонтальная прокрутка (${dimensions.document}px при ширине ${dimensions.viewport}px)`);
    }

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `artifacts/${name}-${category.id}.png`, fullPage: true });
    console.log(`PASS ${name} / ${category.title}: ${count} изображений`);
  }

  await page.locator('.category-card').first().click();
  const firstImage = page.locator('#gallery-hats img').first();
  await firstImage.scrollIntoViewIfNeeded();
  await firstImage.click();
  const lightbox = page.locator('#lightbox');
  await lightbox.waitFor({ state: 'visible' });
  const lightboxWidth = await page.locator('#lightboxImage').evaluate(element => element.naturalWidth);
  if (!lightboxWidth) failures.push(`${name}: изображение в лайтбоксе не загрузилось`);
  await page.keyboard.press('Escape');
  if (await lightbox.evaluate(element => element.classList.contains('active'))) {
    failures.push(`${name}: лайтбокс не закрылся по Escape`);
  }
  await context.close();
}

await checkViewport('desktop', { width: 1440, height: 1000 });
await checkViewport('mobile', { width: 390, height: 844 });

await browser.close();
if (pageErrors.length) failures.push(...pageErrors);
if (failures.length) {
  console.error('QA FAILED\\n' + failures.join('\\n'));
  process.exit(1);
}
console.log('QA PASSED: desktop + mobile, all gallery images, lightbox, no horizontal overflow, no page errors.');
