// Executar com servidor local na porta 8000 e Playwright do runtime do Codex.
const { chromium } = require(process.env.HP_PLAYWRIGHT_PATH || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.HP_CHROMIUM_PATH });
  await fs.mkdir('docs/topo-capturas', { recursive: true });
  const results = [];
  for (const [width, height] of [[320,568],[360,800],[390,844],[430,932],[768,1024],[1024,768],[1440,900],[1920,1080]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:8000', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const metrics = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      contacts: [...document.querySelectorAll('.topbar [data-contact]')].map(a => ({ href: a.href, numberVisible: getComputedStyle(a.querySelector('small')).display !== 'none', height: a.getBoundingClientRect().height })),
      imageLoaded: document.querySelector('.hero-photo').naturalWidth > 0,
      titleFits: document.querySelector('h1').getBoundingClientRect().right <= innerWidth,
      whatsappLinks: [...document.querySelectorAll('[data-whatsapp-message],[data-contact]')].every(a => /^https:\/\/wa.me\/559199113(0303|1368)(\?|$)/.test(a.href))
    }));
    assert.equal(metrics.overflow, false, `overflow ${width}`);
    assert.ok(metrics.imageLoaded && metrics.titleFits && metrics.whatsappLinks);
    assert.deepEqual(errors, []);
    if (width <= 1000) {
      assert.ok(metrics.contacts.every(c => !c.numberVisible && c.height >= 44));
      const toggle = page.locator('#menu-toggle');
      await toggle.click();
      await page.locator('#site-nav').waitFor({ state: 'visible' });
      assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
      assert.ok(await page.evaluate(() => document.activeElement === document.querySelector('#site-nav a')));
      await page.screenshot({ path: `docs/topo-capturas/${width}x${height}-menu.png` });
      await page.keyboard.press('Escape');
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      assert.ok(await toggle.evaluate(el => el === document.activeElement));
      await toggle.click();
      await page.locator('#site-nav a[href="#solucoes"]').click();
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      assert.equal(await page.locator('#conteudo').evaluate(el => el.inert), false);
      await page.evaluate(() => scrollTo(0,0));
    }
    await page.screenshot({ path: `docs/topo-capturas/${width}x${height}.png` });
    results.push({ width, height, ...metrics, errors });
    await page.close();
  }
  await fs.writeFile('docs/topo-capturas/verificacao.json', JSON.stringify(results, null, 2));
  await browser.close();
  console.log('8 resoluções: sem overflow; links, menu, Escape, foco e imagens verificados.');
})().catch(error => { console.error(error); process.exit(1); });
