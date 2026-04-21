import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const messages = [];
  page.on('console', msg => messages.push({ type: msg.type(), text: msg.text() }));
  page.on('pageerror', err => messages.push({ type: 'pageerror', text: err.message }));
  await page.goto('http://127.0.0.1:5173/front/input', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  const errors = messages.filter(m => m.type === 'error' || m.type === 'pageerror');
  console.log('Errors:');
  errors.forEach(e => console.log(' -', e.type + ':', e.text));
  console.log('\nWarnings:');
  messages.filter(m => m.type === 'warning').forEach(w => console.log(' - warn:', w.text));
  await browser.close();
})();
