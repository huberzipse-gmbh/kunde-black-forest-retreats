/* A5-Pappaufsteller: QR generieren, HTML rendern, druckfertiges PDF (154×216 mm inkl. 3 mm Beschnitt). */
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const { chromium } = require('playwright-core');

const QR_URL = 'https://blackforest-retreats.de/aktion/BFR10';
const PHOTO = 'file:///Users/jasinhuber/Desktop/06_DEV/black-forest-retreats/public/hero/hero-desktop-v4.png';
const EXEC = '/Users/jasinhuber/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-x64/chrome-headless-shell';

(async () => {
  const qrSvg = await QRCode.toString(QR_URL, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 0,
    color: { dark: '#1b2a21', light: '#faf7f1' },
  });

  const html = fs
    .readFileSync(path.join(__dirname, 'template.html'), 'utf8')
    .replace('__QR__', qrSvg)
    .replace('__PHOTO__', PHOTO);
  fs.writeFileSync(path.join(__dirname, 'out.html'), html);

  const browser = await chromium.launch({ executablePath: EXEC });
  const page = await browser.newPage({ viewport: { width: 582, height: 816 } });
  await page.goto('file://' + path.join(__dirname, 'out.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  await page.pdf({
    path: path.join(__dirname, 'BFR_Aufsteller_A5_BFR10.pdf'),
    width: '154mm',
    height: '216mm',
    printBackground: true,
    pageRanges: '1',
  });

  // Vorschau-PNG in hoher Auflösung
  await page.setViewportSize({ width: 582, height: 816 });
  await page.screenshot({ path: path.join(__dirname, 'preview.png'), scale: 'device' });

  await browser.close();
  console.log('done');
})().catch((e) => { console.error(e); process.exit(1); });
