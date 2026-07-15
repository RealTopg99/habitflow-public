const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const output = path.resolve('test-results/mobile-habits-redesign');
fs.mkdirSync(output, { recursive: true });
const url = 'http://127.0.0.1:8080/index.html?dev-preview=1&view=habits';
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const version = '2026-07-15-mobile-habits-redesign-v8';

async function open(page, errors, name) {
  page.on('pageerror', error => errors.push(`${name}: ${error.message}`));
  page.on('console', message => { if (message.type() === 'error' && !message.text().includes('[BABEL] Note:')) errors.push(`${name}: ${message.text()}`); });
  await page.addInitScript(value => localStorage.setItem('habitflow_seen_update_version', value), version);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.locator('.mobile-v2-habits').waitFor({ timeout: 30000 });
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: chrome });
  const errors = [];
  for (const [name, width, height] of [['habits-320.png',320,568],['habits-390.png',390,844],['habits-tablet-768.png',768,1024],['habits-tablet-820.png',820,1180]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await open(page, errors, name);
    const audit = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      legacyTable: !!document.querySelector('.m2-habit-table'),
      cards: document.querySelectorAll('.m2-premium-habit').length,
      matrices: document.querySelectorAll('.m2-habit-matrix').length,
      fab: !!document.querySelector('.m2-habits-fab'),
      summary: !!document.querySelector('.m2-habits-summary'),
      widgets: !!document.querySelector('.m2-habits-widget')
    }));
    if (audit.overflow > 1 || audit.legacyTable || !audit.cards || audit.matrices !== audit.cards || !audit.fab || !audit.summary || !audit.widgets) throw new Error(`${name}: ${JSON.stringify(audit)}`);
    await page.screenshot({ path: path.join(output, name), fullPage: true });
    await page.close();
  }

  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await open(page, errors, 'interactions');
  const first = page.locator('.m2-premium-habit').first();
  const complete = first.locator('footer>button');
  await complete.click();
  await first.locator('.m2-habit-xp').waitFor();
  await page.screenshot({ path: path.join(output, 'habit-complete-animation.png') });
  await page.getByRole('tab', { name: 'Meses' }).click();
  if (!(await page.locator('.m2-habit-month-note').count())) throw new Error('La vista mensual no activó la matriz mensual');
  await page.screenshot({ path: path.join(output, 'habits-month-matrix.png'), fullPage: true });
  const switcher = page.locator('.m2-habits-widget [role="switch"]');
  const before = await switcher.getAttribute('aria-checked'); await switcher.click();
  if (await switcher.getAttribute('aria-checked') === before) throw new Error('El widget de hidratación no cambió de estado');
  await page.locator('.m2-habits-fab').click();
  await page.locator('.habit-form-premium').waitFor();
  await page.getByRole('button', { name: 'Cerrar', exact: true }).click();
  await page.close();

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktop.addInitScript(value => localStorage.setItem('habitflow_seen_update_version', value), version);
  await desktop.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  if (await desktop.locator('.mobile-v2').count()) throw new Error('El rediseño de Hábitos se montó en desktop');
  await desktop.locator('.app-main').waitFor();
  await desktop.screenshot({ path: path.join(output, 'desktop-regression.png'), fullPage: true });
  await desktop.close();
  await browser.close();
  if (errors.length) throw new Error(errors.join('\n'));
  console.log('Rediseño de Hábitos Mobile/Tablet: OK');
})().catch(error => { console.error(error); process.exit(1); });
