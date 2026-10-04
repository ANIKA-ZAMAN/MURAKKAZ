#!/bin/bash
set -e
echo "=== Starting Murakkaz Storefront Deployment ==="
cd /var/www/murakkaz

# 1. Archive current static chunks for backwards compatibility
mkdir -p App/.static_archive/css App/.static_archive/chunks
if [ -d App/.next/static/css ]; then
  cp -rn App/.next/static/css/* App/.static_archive/css/ 2>/dev/null || true
fi
if [ -d App/.next/static/chunks ]; then
  cp -rn App/.next/static/chunks/* App/.static_archive/chunks/ 2>/dev/null || true
fi

# 2. Pull latest code
git pull origin main

# 3. Zero-downtime Build Storefront App into .next_build
cd /var/www/murakkaz/App
rm -rf .next_build
NEXT_DIST_DIR=.next_build NODE_OPTIONS="--max-old-space-size=1536" npm run build

# 4. Copy back archived static chunks so old browser sessions never 404
if [ -d .static_archive/css ]; then
  cp -rn .static_archive/css/* .next_build/static/css/ 2>/dev/null || true
fi
if [ -d .static_archive/chunks ]; then
  cp -rn .static_archive/chunks/* .next_build/static/chunks/ 2>/dev/null || true
fi

# 5. Ensure SELinux permissions on .next_build
restorecon -R .next_build 2>/dev/null || true

# 6. Atomic swap: .next -> .next_old, .next_build -> .next
rm -rf .next_old
if [ -d .next ]; then
  mv .next .next_old
fi
mv .next_build .next
restorecon -R .next 2>/dev/null || true

# 7. Restart PM2 storefront
pm2 restart murakkaz-storefront
rm -rf .next_old

echo "=== Deployment completed successfully with zero downtime! ==="
