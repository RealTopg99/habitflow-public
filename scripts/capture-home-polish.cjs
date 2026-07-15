const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const output = path.resolve('test-results/home-polish-fixes');
fs.mkdirSync(output, { recursive: true });
const url = 'http://127.0.0.1:8080/index.html?dev-preview=1&view=dashboard';
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const version = '2026-07-14-voice-review-layout-v6';

const prepare = async (page, errors, label) => {
  page.on('pageerror', error => errors.push(`${label}: ${error.message}`));
  page.on('console', message => { if (message.type() === 'error' && !message.text().includes('[BABEL] Note:')) errors.push(`${label}: ${message.text()}`); });
  await page.addInitScript(value => localStorage.setItem('habitflow_seen_update_version', value), version);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.locator('.mobile-v2-dashboard').waitFor({ timeout: 30000 });
};

const layoutAudit = page => page.evaluate(() => {
  const ring = document.querySelector('.m2-home-page .m2-ring');
  const ringRect = ring.getBoundingClientRect();
  const contents = [...ring.querySelectorAll('strong, span')].map(node => node.getBoundingClientRect());
  const greeting = document.querySelector('.m2-hero-row>div:first-child').getBoundingClientRect();
  const quick = [...document.querySelectorAll('.m2-quick-grid>button')].map(node => node.getBoundingClientRect());
  const finance = document.querySelector('.m2-finance-mini');
  return {
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ringContainsText: contents.every(rect => rect.left >= ringRect.left && rect.right <= ringRect.right && rect.top >= ringRect.top && rect.bottom <= ringRect.bottom),
    greetingCollision: greeting.right > ringRect.left,
    captureMic: !!document.querySelector('.m2-capture-mic'),
    quickCount: quick.length,
    quickSingleRow: quick.every(rect => Math.abs(rect.top - quick[0].top) <= 1),
    categorySummary: !!finance?.querySelector('.m2-category-summary') || finance?.textContent.includes('Categoría principal'),
    achievements: document.body.textContent.includes('Logros recientes'),
    streakAnimation: getComputedStyle(document.querySelector('.m2-streak svg')).animationName
  };
});

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: chrome });
  const errors = [];
  const sizes = [
    ['home-320.png', 320, 568], ['home-360.png', 360, 800], ['home-390.png', 390, 844],
    ['home-430.png', 430, 932], ['home-tablet-768.png', 768, 1024], ['home-tablet-820.png', 820, 1180]
  ];
  for (const [name, width, height] of sizes) {
    const page = await browser.newPage({ viewport: { width, height } });
    await prepare(page, errors, name);
    const audit = await layoutAudit(page);
    if (audit.overflow > 1 || !audit.ringContainsText || audit.greetingCollision || audit.captureMic || audit.quickCount !== 4 || !audit.quickSingleRow || audit.categorySummary || audit.achievements || audit.streakAnimation !== 'm2-streak-flame') throw new Error(`${name}: ${JSON.stringify(audit)}`);
    await page.screenshot({ path: path.join(output, name), fullPage: true });
    await page.close();
  }

  const fields = await browser.newPage({ viewport: { width: 320, height: 568 } });
  await prepare(fields, errors, 'date-time');
  await fields.locator('.m2-capture').click();
  await fields.locator('.m2-shared-capture textarea').fill('Reunión mañana a las 3');
  await fields.getByRole('button', { name: 'Interpretar', exact: true }).click();
  await fields.getByRole('heading', { name: 'Entendí esto' }).waitFor();
  const readFieldAudit = () => fields.evaluate(() => {
    const viewport = document.documentElement.clientWidth;
    const nodes = [...document.querySelectorAll('.voice-field input[type="date"],.voice-field input[type="time"]')];
    const card = document.querySelector('.voice-draft-card')?.getBoundingClientRect();
    const grid = document.querySelector('.voice-field-grid')?.getBoundingClientRect();
    return { viewport, count: nodes.length, overflow: document.documentElement.scrollWidth - viewport, card: card&&{left:card.left,right:card.right}, grid:grid&&{left:grid.left,right:grid.right}, rects: nodes.map(node => { const rect = node.getBoundingClientRect(); return { left: rect.left, right: rect.right, width: rect.width }; }) };
  });
  const validateFields = async source => {
    for (const [width,height] of [[320,568],[360,800],[390,844],[430,932],[768,1024],[820,1180]]) {
      await fields.setViewportSize({width,height});
      const fieldAudit = await readFieldAudit();
      if (fieldAudit.count < 2 || fieldAudit.overflow > 1 || fieldAudit.rects.some(rect => rect.left < 0 || rect.right > fieldAudit.viewport || rect.width <= 0 || rect.left < fieldAudit.grid.left - 1 || rect.right > fieldAudit.grid.right + 1 || rect.left < fieldAudit.card.left || rect.right > fieldAudit.card.right)) throw new Error(`Fecha/hora ${source} ${width}px: ${JSON.stringify(fieldAudit)}`);
    }
  };
  await validateFields('captura-rápida');
  await fields.setViewportSize({width:320,height:568});
  await fields.locator('.voice-assistant').screenshot({ path: path.join(output, 'quick-capture-date-time.png') });
  await fields.locator('.voice-assistant').getByRole('button', { name: 'Cancelar', exact: true }).click();
  await fields.locator('.voice-assistant-launcher').click();
  await fields.locator('.voice-transcript').fill('Reunión mañana a las 3');
  await fields.getByRole('button', { name: 'Interpretar comando', exact: true }).click();
  await fields.getByRole('heading', { name: 'Entendí esto' }).waitFor();
  await validateFields('micrófono-flotante');
  await fields.setViewportSize({width:320,height:568});
  await fields.locator('.voice-assistant').evaluate(node => { node.scrollTop = 0; });
  await fields.locator('.voice-assistant').screenshot({ path: path.join(output, 'quick-capture-date-time-audio.png') });
  await fields.locator('.voice-assistant').getByRole('button', { name: 'Cancelar', exact: true }).click();
  await fields.close();

  const actions = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await prepare(actions, errors, 'actions');
  await actions.screenshot({ path: path.join(output, 'quick-actions-reference-match.png') });
  const quick = actions.locator('.m2-quick-grid>button');
  await quick.nth(0).click(); await actions.getByRole('heading', { name: 'Nueva tarea' }).waitFor(); await actions.getByRole('button', { name: 'Cancelar', exact: true }).click();
  await quick.nth(1).click(); await actions.locator('.mobile-v2-pomodoro').waitFor();
  await actions.locator('.m2-bottom-nav').getByRole('button', { name: /Inicio/ }).click(); await actions.locator('.mobile-v2-dashboard').waitFor();
  await actions.locator('.m2-quick-grid>button').nth(2).click(); await actions.locator('.habit-form-premium').waitFor(); await actions.getByRole('button', { name: 'Cerrar', exact: true }).click();
  await actions.locator('.m2-quick-grid>button').nth(3).click(); await actions.locator('.mobile-v2-finance').waitFor();
  if (!(await actions.getByRole('tab', { name: 'Gasto' }).getAttribute('aria-selected') === 'true')) throw new Error('Nuevo gasto no abrió Wallet Agregar en modo Gasto');
  await actions.close();

  const flame = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await prepare(flame, errors, 'streak'); await flame.waitForTimeout(1150);
  await flame.screenshot({ path: path.join(output, 'streak-animation-frame.png') }); await flame.close();

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  desktop.on('pageerror', error => errors.push(`desktop: ${error.message}`));
  await desktop.addInitScript(value => localStorage.setItem('habitflow_seen_update_version', value), version);
  await desktop.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  if (await desktop.locator('.mobile-v2').count()) throw new Error('Desktop montó el shell Mobile/Tablet');
  await desktop.locator('.app-main').waitFor();
  await desktop.screenshot({ path: path.join(output, 'desktop-regression.png'), fullPage: true });
  await desktop.close();
  await browser.close();
  if (errors.length) throw new Error(errors.join('\n'));
  console.log('Pulido visual y funcional de Inicio Mobile/Tablet: OK');
})().catch(error => { console.error(error); process.exit(1); });
