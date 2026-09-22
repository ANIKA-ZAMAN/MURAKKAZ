#!/bin/bash
set -e
echo "=== Starting Full Murakkaz Deployment ==="
cd /var/www/murakkaz

# 1. Pull latest code
git pull origin main

# 2. Restart backend
pm2 restart murakkaz-backend

# 3. Archive current static chunks
mkdir -p App/.static_archive/css App/.static_archive/chunks
if [ -d App/.next/static/css ]; then
  cp -rn App/.next/static/css/* App/.static_archive/css/ 2>/dev/null || true
fi
if [ -d App/.next/static/chunks ]; then
  cp -rn App/.next/static/chunks/* App/.static_archive/chunks/ 2>/dev/null || true
fi

# 4. Build Storefront App
cd /var/www/murakkaz/App
NODE_OPTIONS="--max-old-space-size=1536" npm run build

# 5. Restore archived static chunks
if [ -d .static_archive/css ]; then
  cp -rn .static_archive/css/* .next/static/css/ 2>/dev/null || true
fi
if [ -d .static_archive/chunks ]; then
  cp -rn .static_archive/chunks/* .next/static/chunks/ 2>/dev/null || true
fi

# 6. SELinux permissions
restorecon -R .next 2>/dev/null || true

# 7. Restart PM2 storefront
pm2 restart murakkaz-storefront

echo "=== Deployment completed successfully! ==="
