const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const output = path.resolve('test-results/mobile-home-fixes');
fs.mkdirSync(output, { recursive: true });
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const url = 'http://127.0.0.1:8080/index.html?dev-preview=1&view=dashboard';

const run = async () => {
  const browser = await chromium.launch({ headless: true, executablePath: chrome });
  const errors = [];
  const resolutions = [
    ['home-phone-360.png', 360, 800],
    ['home-phone-390.png', 390, 844],
    ['home-phone-430.png', 430, 932],
    ['home-tablet-768.png', 768, 1024],
    ['home-tablet-820.png', 820, 1180]
  ];
  for (const [name, width, height] of resolutions) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    page.on('console', message => { if (message.type() === 'error' && !message.text().includes('[BABEL] Note:')) errors.push(`${name}: ${message.text()}`); });
    page.on('pageerror', error => errors.push(`${name}: ${error.message}`));
    await page.addInitScript(() => localStorage.setItem('habitflow_seen_update_version', '2026-07-14-mobile-home-professional-v2'));
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.locator('.mobile-v2-dashboard').waitFor({ timeout: 30000 });
    const audit = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      logo: !!document.querySelector('.m2-header .m2-brand'),
      bell: !!document.querySelector('.m2-header [aria-label="Notificaciones"]'),
      dateClipped: (() => { const el = document.querySelector('.m2-date span'); return el.scrollWidth > el.clientWidth + 1; })(),
      avatarImage: !!document.querySelector('.m2-avatar img'),
      ringOverlap: (() => { const ring = document.querySelector('.m2-hero-row .m2-ring')?.getBoundingClientRect(); const title = document.querySelector('.m2-hero-row h1')?.getBoundingClientRect(); return ring && title ? title.right > ring.left : false; })()
    }));
    if (audit.overflow > 0 || audit.logo || audit.bell || audit.dateClipped || !audit.avatarImage || audit.ringOverlap) throw new Error(`${name}: ${JSON.stringify(audit)}`);
    await page.screenshot({ path: path.join(output, name), fullPage: true });
    await page.close();
  }

  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  page.on('console', message => { if (message.type() === 'error' && !message.text().includes('[BABEL] Note:')) errors.push(`interaction: ${message.text()}`); });
  page.on('pageerror', error => errors.push(`interaction: ${error.message}`));
  await page.addInitScript(() => localStorage.setItem('habitflow_seen_update_version', '2026-07-14-mobile-home-professional-v2'));
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.locator('.m2-capture').click();
  await page.locator('.m2-shared-capture').waitFor();
  await page.locator('.m2-shared-capture textarea').fill('Crear hábito de beber agua todos los días');
  await page.screenshot({ path: path.join(output, 'quick-capture-phone.png') });
  await page.getByRole('button', { name: 'Interpretar', exact: true }).click();
  await page.getByRole('heading', { name: 'Entendí esto' }).waitFor();
  await page.locator('.voice-assistant').getByRole('button', { name: 'Guardar', exact: true }).click();
  await page.getByRole('heading', { name: 'Listo, actualicé HabitFlow.' }).waitFor();
  await page.locator('.voice-assistant').getByRole('button', { name: 'Cerrar', exact: true }).click();

  const createWithSharedParser = async command => {
    await page.locator('.m2-capture').click();
    await page.locator('.m2-shared-capture textarea').fill(command);
    await page.getByRole('button', { name: 'Interpretar', exact: true }).click();
    await page.getByRole('heading', { name: 'Entendí esto' }).waitFor();
    const save = page.locator('.voice-assistant').getByRole('button', { name: 'Guardar', exact: true });
    if (await save.isDisabled()) throw new Error(`El parser dejó campos incompletos: ${command}`);
    await save.click();
    await page.getByRole('heading', { name: 'Listo, actualicé HabitFlow.' }).waitFor();
    await page.locator('.voice-assistant').getByRole('button', { name: 'Cerrar', exact: true }).click();
  };
  await createWithSharedParser('Reunión con Juan mañana a las 3');
  await createWithSharedParser('Gasté 20000 pesos en comida con Cuenta principal');

  await page.locator('.m2-capture-mic').click();
  await page.locator('.voice-assistant').waitFor();
  await page.locator('.voice-assistant').getByRole('button', { name: 'Cancelar', exact: true }).click();

  await page.getByRole('button', { name: 'Añadir hábito' }).click();
  await page.locator('.habit-form-premium').waitFor();
  for (const expected of ['Nombre', 'Descripción', 'Categoría', 'Frecuencia', 'Meta de racha', 'Recordatorio']) {
    if (!(await page.getByText(expected, { exact: true }).count())) throw new Error(`Falta campo de hábito: ${expected}`);
  }
  await page.screenshot({ path: path.join(output, 'quick-habit-phone.png') });
  await page.getByRole('button', { name: 'Cerrar', exact: true }).click();

  const initialUrl = page.url();
  await page.locator('.m2-pomodoro-mini').scrollIntoViewIfNeeded();
  await page.locator('.m2-pomodoro-mini .m2-button').click();
  await page.waitForTimeout(1200);
  if (page.url() !== initialUrl) throw new Error('Pomodoro rápido navegó fuera del Panel');
  if (!(await page.locator('.m2-pomodoro-mini').getByText('Pausar', { exact: true }).count())) throw new Error('Pomodoro rápido no inició');
  await page.screenshot({ path: path.join(output, 'pomodoro-running-phone.png') });
  const beforePause = await page.locator('.m2-pomodoro-mini>strong').innerText();
  await page.locator('.m2-pomodoro-mini .m2-button').click();
  await page.waitForTimeout(1100);
  const afterPause = await page.locator('.m2-pomodoro-mini>strong').innerText();
  if (beforePause !== afterPause) throw new Error('Pomodoro rápido no quedó pausado');
  await page.locator('.m2-pomodoro-mini').getByRole('button', { name: 'Configurar Pomodoro rápido' }).click();
  await page.getByText('Descanso corto', { exact: true }).waitFor();
  await page.screenshot({ path: path.join(output, 'pomodoro-settings-phone.png') });
  await page.locator('.m2-pomo-quick-settings').getByRole('spinbutton', { name: 'Enfoque', exact: true }).fill('26');
  await page.getByRole('button', { name: 'Guardar configuración', exact: true }).click();
  await page.locator('.m2-functional-modal').waitFor({ state: 'detached' });
  await page.close();

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  desktop.on('pageerror', error => errors.push(`desktop: ${error.message}`));
  await desktop.addInitScript(() => localStorage.setItem('habitflow_seen_update_version', '2026-07-14-mobile-home-professional-v2'));
  await desktop.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  if (await desktop.locator('.mobile-v2').count()) throw new Error('El shell móvil se montó en desktop');
  await desktop.locator('.app-main').waitFor();
  await desktop.screenshot({ path: path.join(output, 'desktop-regression.png'), fullPage: true });
  await desktop.close();
  await browser.close();
  if (errors.length) throw new Error(`Errores de consola:\n${errors.join('\n')}`);
  console.log('Capturas y recorridos de Inicio Mobile/Tablet: OK');
};

run().catch(error => { console.error(error); process.exit(1); });
