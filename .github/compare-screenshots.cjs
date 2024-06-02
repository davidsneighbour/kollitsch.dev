const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

const screenshotDir = path.join(__dirname, 'screenshots');
const img1Path = path.join(screenshotDir, 'screenshot.png');
const img2Path = path.join(screenshotDir, 'new-screenshot.png');
const diffPath = path.join(screenshotDir, 'diff.png');

const now = new Date();
const timestamp = now.getFullYear().toString() +
  (now.getMonth() + 1).toString().padStart(2, '0') +
  now.getDate().toString().padStart(2, '0') +
  now.getHours().toString().padStart(2, '0') +
  now.getMinutes().toString().padStart(2, '0') +
  now.getSeconds().toString().padStart(2, '0');
const screenshotPathWithTimestamp = path.join(screenshotDir, `screenshot_${timestamp}.png`);

if (fs.existsSync(img1Path) && fs.existsSync(img2Path)) {
  const img1 = PNG.sync.read(fs.readFileSync(img1Path));
  const img2 = PNG.sync.read(fs.readFileSync(img2Path));
  const { width, height } = img1;
  const diff = new PNG({ width, height });

  const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });

  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  if (numDiffPixels > 0) {
    fs.copyFileSync(img2Path, img1Path);
    fs.copyFileSync(img2Path, screenshotPathWithTimestamp);
    process.stdout.write('::set-output name=changes::true');
  } else {
    process.stdout.write('::set-output name=changes::false');
  }
} else {
  fs.copyFileSync(img2Path, img1Path);
  fs.copyFileSync(img2Path, screenshotPathWithTimestamp);
  process.stdout.write('::set-output name=changes::true');
}
