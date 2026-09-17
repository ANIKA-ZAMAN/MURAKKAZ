const fs = require('fs');
const path = require('path');

const mode = process.argv[2]; // 'pre' or 'post'
const appDir = path.resolve(__dirname, '..');
const staticDir = path.join(appDir, '.next', 'static');
const archiveDir = path.join(appDir, '.static_archive');

function copyRecursive(src, dest, skipIfExists = false) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath, skipIfExists);
    } else if (entry.isFile()) {
      if (skipIfExists && fs.existsSync(destPath)) {
        continue;
      }
      try {
        fs.copyFileSync(srcPath, destPath);
      } catch (err) {
        // Ignore copy errors
      }
    }
  }
}

if (mode === 'pre') {
  // Archive existing static chunks before build wipes them
  if (fs.existsSync(staticDir)) {
    copyRecursive(path.join(staticDir, 'css'), path.join(archiveDir, 'css'), false);
    copyRecursive(path.join(staticDir, 'chunks'), path.join(archiveDir, 'chunks'), false);
    console.log('[preserve-static] Archived existing static chunks to .static_archive');
  }
} else if (mode === 'post') {
  // Merge archived static chunks back into .next/static
  if (fs.existsSync(archiveDir)) {
    copyRecursive(path.join(archiveDir, 'css'), path.join(staticDir, 'css'), true);
    copyRecursive(path.join(archiveDir, 'chunks'), path.join(staticDir, 'chunks'), true);
    console.log('[preserve-static] Merged past static chunks back into .next/static for backward compatibility');
  }
}
