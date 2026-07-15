const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const output = path.resolve('test-results/home-full-width-fixes');
fs.mkdirSync(output, { recursive: true });
const url = 'http://127.0.0.1:8080/index.html?dev-preview=1&view=dashboard';
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const version = '2026-07-14-mobile-home-full-width-v3';

const prepare = async page => {
  await page.addInitScript(value => localStorage.setItem('habitflow_seen_update_version', value), version);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.locator('.mobile-v2-dashboard').waitFor({ timeout: 30000 });
};

const auditLayout = async page => page.evaluate(() => {
  const root = document.querySelector('.m2-home-main-sections');
  const cards = [...root.children];
  const rootRect = root.getBoundingClientRect();
  return {
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    display: getComputedStyle(root).display,
    direction: getComputedStyle(root).flexDirection,
    cardCount: cards.length,
    widths: cards.map(card => Math.abs(card.getBoundingClientRect().width - rootRect.width)),
    internalScroll: cards.map(card => ({ overflowY: getComputedStyle(card).overflowY, clipped: card.scrollHeight > card.clientHeight + 1 }))
  };
});

const seedMany = async (page, taskCount, habitCount) => {
  await page.evaluate(({ taskCount, habitCount }) => {
    const data = JSON.parse(localStorage.getItem('habitTrackerData'));
    const local = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    data.agenda[local] = Array.from({ length: taskCount }, (_, index) => ({ id: `audit-task-${index}`, text: `Tarea de auditoría ${index + 1} con un título suficientemente descriptivo`, startTime: `${String(8 + index % 10).padStart(2, '0')}:00`, completed: false }));
    data.habits = Array.from({ length: habitCount }, (_, index) => ({ id: `audit-habit-${index}`, name: `Hábito pendiente ${index + 1} con nombre descriptivo`, active: true, category: 'salud', schedule: { type: 'daily' } }));
    data.records = [];
    localStorage.setItem('habitTrackerData', JSON.stringify(data));
  }, { taskCount, habitCount });
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('.mobile-v2-dashboard').waitFor();
};

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: chrome });
  const errors = [];
  const resolutions = [
    ['home-320.png', 320, 568], ['home-360.png', 360, 800], ['home-390.png', 390, 844],
    ['home-430.png', 430, 932], ['home-tablet-768.png', 768, 1024],
    ['home-tablet-820.png', 820, 1180], ['home-tablet-1024.png', 1024, 1366]
  ];
  for (const [name, width, height] of resolutions) {
    const page = await browser.newPage({ viewport: { width, height } });
    page.on('pageerror', error => errors.push(`${name}: ${error.message}`));
    await prepare(page);
    const audit = await auditLayout(page);
    if (audit.overflow > 1 || audit.display !== 'flex' || audit.direction !== 'column' || audit.cardCount !== 4 || audit.widths.some(delta => delta > 1) || audit.internalScroll.some(item => item.clipped || item.overflowY === 'auto' || item.overflowY === 'scroll')) throw new Error(`${name}: ${JSON.stringify(audit)}`);
    await page.screenshot({ path: path.join(output, name), fullPage: true });
    await page.close();
  }

  const capture = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await prepare(capture);
  await capture.locator('.m2-capture').click();
  const input = capture.locator('.m2-shared-capture textarea');
  await input.waitFor();
  for (const part of ['u', 'na tarea con ', 'tildes: acción ', 'y números 123']) {
    await input.pressSequentially(part, { delay: 15 });
    if (!(await input.evaluate(node => document.activeElement === node))) throw new Error(`Captura rápida perdió foco después de: ${part}`);
  }
  await input.press('Backspace');
  if (!(await input.evaluate(node => document.activeElement === node))) throw new Error('Captura rápida perdió foco al borrar');
  await capture.setViewportSize({ width: 844, height: 390 });
  if (!(await input.evaluate(node => document.activeElement === node))) throw new Error('Captura rápida perdió foco al cambiar orientación');
  await capture.setViewportSize({ width: 390, height: 844 });
  await capture.screenshot({ path: path.join(output, 'quick-capture-keyboard-open.png') });
  await capture.getByRole('button', { name: 'Cancelar', exact: true }).click();
  await capture.locator('.m2-capture').click();
  await input.fill('Reunión mañana a las 3');
  await input.press('Enter');
  await capture.getByRole('heading', { name: 'Entendí esto' }).waitFor();
  await capture.locator('.voice-assistant').getByRole('button', { name: 'Cancelar', exact: true }).click();
  await capture.close();

  const manyTasks = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await prepare(manyTasks); await seedMany(manyTasks, 15, 1);
  if (await manyTasks.locator('.m2-home-main-sections>.m2-list-card').first().locator('.m2-line').count() !== 15) throw new Error('Plan del día no muestra las 15 tareas');
  await manyTasks.screenshot({ path: path.join(output, 'plan-day-many-items.png'), fullPage: true });
  await manyTasks.close();

  const manyHabits = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await prepare(manyHabits); await seedMany(manyHabits, 1, 15);
  if (await manyHabits.locator('.m2-home-main-sections>.m2-list-card').nth(1).locator('.m2-line').count() !== 15) throw new Error('Hábitos pendientes no muestra los 15 hábitos');
  await manyHabits.screenshot({ path: path.join(output, 'pending-habits-many-items.png'), fullPage: true });
  await manyHabits.locator('.m2-pomodoro-mini').scrollIntoViewIfNeeded();
  await manyHabits.screenshot({ path: path.join(output, 'quick-pomodoro-full-width.png') });
  const originalUrl = manyHabits.url();
  await manyHabits.locator('.m2-pomodoro-mini .m2-button').click();
  if (manyHabits.url() !== originalUrl) throw new Error('El Pomodoro rápido navegó fuera del Panel');
  await manyHabits.locator('.m2-pomodoro-mini .m2-button').click();
  await manyHabits.locator('.m2-pomodoro-mini').getByRole('button', { name: 'Configurar Pomodoro rápido' }).click();
  await manyHabits.getByRole('button', { name: 'Cancelar', exact: true }).click();
  await manyHabits.locator('.m2-finance-mini').scrollIntoViewIfNeeded();
  await manyHabits.screenshot({ path: path.join(output, 'quick-finance-full-width.png') });
  await manyHabits.locator('.m2-finance-mini').getByRole('button', { name: 'Ver todo' }).click();
  await manyHabits.locator('.mobile-v2-finance').waitFor();
  await manyHabits.close();

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktop.addInitScript(value => localStorage.setItem('habitflow_seen_update_version', value), version);
  await desktop.goto(url, { waitUntil: 'networkidle' });
  if (await desktop.locator('.mobile-v2').count()) throw new Error('Desktop montó el shell Mobile/Tablet');
  await desktop.locator('.app-main').waitFor();
  await desktop.screenshot({ path: path.join(output, 'desktop-intact.png'), fullPage: true });
  await desktop.close();
  await browser.close();
  if (errors.length) throw new Error(errors.join('\n'));
  console.log('Auditoría visual y funcional Inicio full-width: OK');
})().catch(error => { console.error(error); process.exit(1); });
