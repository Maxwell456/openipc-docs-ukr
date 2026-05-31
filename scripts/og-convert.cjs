// One-off: convert docs/public/og-*.svg -> og-*.png (1200x630) for social sharing.
// Social platforms (Telegram, Facebook, X, LinkedIn) do not render SVG og:image.
// Run locally: npm install sharp --no-save && node scripts/og-convert.cjs
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const dir = path.resolve(__dirname, '..', 'docs', 'public');
const files = fs.readdirSync(dir).filter(f => /^og-.*\.svg$/.test(f));
(async () => {
  for (const f of files) {
    const svg = path.join(dir, f);
    const png = path.join(dir, f.replace(/\.svg$/, '.png'));
    const buf = fs.readFileSync(svg);
    await sharp(buf, { density: 144 })
      .resize(1200, 630, { fit: 'fill' })
      .png()
      .toFile(png);
    const { size } = fs.statSync(png);
    console.log(`${f} -> ${path.basename(png)} (${(size / 1024).toFixed(1)} KB)`);
  }
})().catch(e => { console.error(e); process.exit(1); });
