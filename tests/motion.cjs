const { chromium } = require(process.env.HP_PLAYWRIGHT_PATH || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.HP_CHROMIUM_PATH });
  const results = [];
  const settleMotion = async page => page.evaluate(async () => {
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await Promise.all(document.getAnimations().map(animation => animation.finished.catch(() => {})));
  });
  await fs.mkdir('docs/motion-capturas', { recursive: true });
  for (const [width, height] of [[320,568],[360,800],[390,844],[430,932],[768,1024],[1440,900],[1920,1080]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'no-preference' });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(() => {
      window.motionShifts = [];
      new PerformanceObserver(list => list.getEntries().forEach(e => {
        if (!e.hadRecentInput) window.motionShifts.push(e.value);
      })).observe({ type: 'layout-shift', buffered: true });
    });
    await page.goto('http://127.0.0.1:8000', { waitUntil: 'domcontentloaded' });
    const heroAnimationCount = await page.locator('.hero').evaluate(el => el.getAnimations({ subtree: true }).length);
    assert.ok(heroAnimationCount > 0, `hero animation ${width}`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => document.querySelector('.hero').getAnimations({ subtree:true }).every(a => a.playState === 'finished'));
    await page.screenshot({ path: `docs/motion-capturas/${width}-inicial.png` });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    const heroDocumentTop = await page.locator('.hero').evaluate(el => el.getBoundingClientRect().top + scrollY);
    await page.evaluate(() => scrollTo({ top: 220, behavior: 'instant' }));
    if (width > 1000) {
      await page.waitForFunction(() => document.querySelector('.site-header').classList.contains('is-compact'));
      await page.waitForFunction(() => document.querySelector('.header-main').getAnimations().every(a => a.playState === 'finished'));
      const box = await page.locator('.header-main').boundingBox();
      assert.ok(box.y >= 8 && box.y < 30 && box.height < 90);
      assert.equal(await page.locator('.hero').evaluate(el => el.getBoundingClientRect().top + scrollY), heroDocumentTop);
      assert.ok(await page.locator('.header-cta').isVisible());
    } else {
      assert.equal(await page.locator('.site-header').evaluate(el => el.classList.contains('is-compact')), false);
      assert.ok(await page.locator('.topbar [data-contact] small').evaluateAll(els => els.every(el => getComputedStyle(el).display === 'none')));
    }
    await page.locator('#solucoes').evaluate(el => el.scrollIntoView({ behavior: 'instant' }));
    await settleMotion(page);
    await page.screenshot({ path: `docs/motion-capturas/${width}-servicos.png` });
    const firstCard = page.locator('.solution-card').first();
    await page.locator('#processo').evaluate(el => el.scrollIntoView({ behavior: 'instant' }));
    await settleMotion(page);
    await page.screenshot({ path: `docs/motion-capturas/${width}-processo.png` });
    await page.locator('#solucoes').evaluate(el => el.scrollIntoView({ behavior: 'instant' }));
    await settleMotion(page);
    assert.equal(await firstCard.evaluate(el => el.getAnimations().filter(a => a.playState === 'running').length), 0, 'reveal must not repeat');
    if (width > 1000) {
      await page.locator('.site-nav a[href="#sobre"]').click();
      await page.waitForFunction(() => location.hash === '#sobre' && Math.abs(document.querySelector('#sobre').getBoundingClientRect().top - 112) < 3);
      const nav = await page.locator('.header-main').boundingBox();
      const section = await page.locator('#sobre').boundingBox();
      assert.ok(section.y > nav.y + nav.height, 'anchor below navbar');
    }
    await page.locator('#atuacao').evaluate(el => el.scrollIntoView({ behavior: 'instant' }));
    if (width <= 1000) {
      const track = page.locator('#gallery-track');
      await track.focus();
      await page.keyboard.press('ArrowRight');
      await page.waitForFunction(() => document.querySelector('#gallery-track').scrollLeft > 20);
      await page.locator('#gallery-prev').click();
      await page.waitForFunction(() => document.querySelector('#gallery-track').scrollLeft < 2);
    }
    const links = await page.locator('[data-whatsapp-message]').evaluateAll(els => els.map(el => ({ href: el.href, message: el.dataset.whatsappMessage })));
    links.forEach(link => {
      const url = new URL(link.href);
      assert.equal(url.hostname, 'wa.me');
      assert.equal(url.pathname, '/5591991130303');
      assert.equal(url.searchParams.get('text'), link.message);
    });
    await page.locator('#contato').evaluate(el => el.scrollIntoView({ behavior: 'instant' }));
    await settleMotion(page);
    await page.screenshot({ path: `docs/motion-capturas/${width}-contato.png` });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    const cls = await page.evaluate(() => window.motionShifts.reduce((sum, value) => sum + value, 0));
    assert.ok(cls < 0.1, `CLS ${width}: ${cls}`);
    assert.deepEqual(errors, []);
    // Alterar a preferência durante a sessão também interrompe animações nativas.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length), 0);
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.evaluate(() => document.getAnimations().length), 0);
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
    results.push({ width, height, heroAnimationCount, cls, errors, reducedMotion: 'passed' });
    await page.close();

    const nojs = await browser.newPage({ viewport: { width, height }, javaScriptEnabled: false });
    await nojs.goto('http://127.0.0.1:8000', { waitUntil: 'networkidle' });
    assert.ok(await nojs.locator('.hero h1').isVisible());
    assert.ok(await nojs.locator('.site-nav a[href="#solucoes"]').isVisible());
    assert.equal(await nojs.locator('.hero-actions a').first().getAttribute('href').then(h => h.startsWith('https://wa.me/5591991130303?text=')), true);
    assert.equal(await nojs.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await nojs.screenshot({ path: `docs/motion-capturas/${width}-sem-js.png` });
    await nojs.close();
  }
  await fs.writeFile('docs/motion-capturas/resultados.json', JSON.stringify(results, null, 2));
  await browser.close();
  console.log(JSON.stringify(results, null, 2));
})().catch(error => { console.error(error); process.exit(1); });
