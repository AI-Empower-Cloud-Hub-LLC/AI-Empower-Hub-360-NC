const fs = require('fs');
const path = require('path');

const SRC = __dirname;
const DIST = path.join(__dirname, 'dist');

const COPY_EXTENSIONS = ['.html', '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp', '.woff', '.woff2', '.ttf'];
const COPY_EXACT_NAMES = ['CNAME', '.nojekyll', 'robots.txt', 'sitemap.xml', 'favicon.ico'];
const EXCLUDE_DIRS = ['dist', 'node_modules', '.git'];

function shouldCopy(name) {
  return COPY_EXACT_NAMES.includes(name) || COPY_EXTENSIONS.includes(path.extname(name).toLowerCase());
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (EXCLUDE_DIRS.includes(entry.name)) continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (shouldCopy(entry.name)) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true });
copyDir(SRC, DIST);
console.log('Build complete → dist/');
