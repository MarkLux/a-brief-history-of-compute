import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const SOURCE_DIRS = ['ch1', 'ch2', 'ch3', 'ch4'];
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']);
const OUTPUT_ROOT = path.join(ROOT, 'public', 'chapter-assets');

function copyImages(sourceRoot) {
  const fullSourceRoot = path.join(ROOT, sourceRoot);
  if (!fs.existsSync(fullSourceRoot)) return 0;
  let copied = 0;

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const sourcePath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(sourcePath);
        continue;
      }
      if (!entry.isFile()) continue;
      if (!IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) continue;

      const relativePath = path.relative(fullSourceRoot, sourcePath);
      const targetPath = path.join(OUTPUT_ROOT, sourceRoot, relativePath);
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.copyFileSync(sourcePath, targetPath);
      copied += 1;
    }
  }

  walk(fullSourceRoot);
  return copied;
}

fs.rmSync(OUTPUT_ROOT, { recursive: true, force: true });
let total = 0;
for (const sourceDir of SOURCE_DIRS) {
  total += copyImages(sourceDir);
}

console.log(`Copied ${total} chapter image asset(s) to public/chapter-assets.`);
