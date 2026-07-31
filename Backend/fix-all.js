const fs = require('fs');
const glob = require('glob');
const path = require('path');

// 1. Fix import paths
const importFixes = {
  'src/services/blog.service.ts': [/{ prisma } from '\.\.\/index'/, "prisma from '../config/database'"],
  'src/services/cart.service.ts': [/{ AppError } from '\.\.\/utils\/AppError'/, "{ AppError } from '../middleware/errorHandler'"],
  'src/services/collection.service.ts': [/{ AppError } from '\.\.\/utils\/AppError'/, "{ AppError } from '../middleware/errorHandler'"],
  'src/services/content.service.ts': [/{ prisma } from '\.\.\/index'/, "prisma from '../config/database'"],
  'src/services/event.service.ts': [/{ prisma } from '\.\.\/index'/, "prisma from '../config/database'"],
  'src/services/product.service.ts': [/prisma from '\.\.\/lib\/prisma'/, "prisma from '../config/database'"],
  'src/services/review.service.ts': [/{ prisma } from '\.\.\/index'/, "prisma from '../config/database'"],
  'src/services/store.service.ts': [/{ prisma } from '\.\.\/index'/, "prisma from '../config/database'"],
  'src/services/user.service.ts': [/prisma from '\.\.\/config\/prisma'/, "prisma from '../config/database'"],
  'src/services/wishlist.service.ts': [/{ AppError } from '\.\.\/utils\/AppError'/, "{ AppError } from '../middleware/errorHandler'"]
};

for (const [file, [pattern, replacement]] of Object.entries(importFixes)) {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(pattern, replacement);
    fs.writeFileSync(fullPath, content);
  }
}

// 2. Fix src/services/wishlist.service.ts - prisma.wishlistItem
const wishlistPath = path.join(__dirname, 'src/services/wishlist.service.ts');
if (fs.existsSync(wishlistPath)) {
  let content = fs.readFileSync(wishlistPath, 'utf8');
  content = content.replace(/prisma\.wishlist\./g, 'prisma.wishlistItem.');
  fs.writeFileSync(wishlistPath, content);
}

// 3. Fix src/services/auth.service.ts
const authPath = path.join(__dirname, 'src/services/auth.service.ts');
if (fs.existsSync(authPath)) {
  let content = fs.readFileSync(authPath, 'utf8');
  
  // AppError args order
  content = content.replace(/new\s+AppError\(\s*(\d+)\s*,\s*(['"`][^'"`]+['"`])\s*\)/g, 'new AppError($2, $1)');
  
  // passwordHash
  content = content.replace(/password:\s*hashedPassword/g, 'passwordHash: hashedPassword');
  content = content.replace(/user\.password/g, 'user.passwordHash');
  
  // generateRefreshToken args
  content = content.replace(/generateRefreshToken\s*\(\s*user\.id\s*,\s*user\.role\s*\)/g, 'generateRefreshToken(user.id)');
  content = content.replace(/generateRefreshToken\s*\(\s*userId\s*,\s*user\.role\s*\)/g, 'generateRefreshToken(userId)');
  content = content.replace(/generateRefreshToken\s*\(\s*user\.id\s*,\s*[^)]+\s*\)/g, 'generateRefreshToken(user.id)');
  
  fs.writeFileSync(authPath, content);
}

// 4. Fix src/services/user.service.ts
const userPath = path.join(__dirname, 'src/services/user.service.ts');
if (fs.existsSync(userPath)) {
  let content = fs.readFileSync(userPath, 'utf8');
  content = content.replace(/new\s+AppError\(\s*(\d+)\s*,\s*(['"`][^'"`]+['"`])\s*\)/g, 'new AppError($2, $1)');
  fs.writeFileSync(userPath, content);
}

// 5. Fix src/services/product.service.ts
const productPath = path.join(__dirname, 'src/services/product.service.ts');
if (fs.existsSync(productPath)) {
  let content = fs.readFileSync(productPath, 'utf8');
  
  // AppError args
  content = content.replace(/new\s+AppError\(\s*(\d+)\s*,\s*(['"`][^'"`]+['"`])\s*\)/g, 'new AppError($2, $1)');
  
  // getPaginationParams
  content = content.replace(/getPaginationParams\s*\(\s*page\s*,\s*limit\s*\)/g, 'getPaginationParams({ page, limit })');
  
  // filters.page / limit
  content = content.replace(/take:\s*limit,/g, 'take: limit,'); // wait, let's fix it by regex
  content = content.replace(/skip:\s*\(\s*filters\.page\s*-\s*1\s*\)\s*\*\s*filters\.limit/, 'skip: ((filters.page || 1) - 1) * (filters.limit || 12)');
  content = content.replace(/take:\s*filters\.limit/, 'take: filters.limit || 12');
  
  fs.writeFileSync(productPath, content);
}

// 6. Fix src/utils/jwt.ts
const jwtPath = path.join(__dirname, 'src/utils/jwt.ts');
if (fs.existsSync(jwtPath)) {
  let content = fs.readFileSync(jwtPath, 'utf8');
  
  content = content.replace(/expiresIn:\s*env\.JWT_ACCESS_EXPIRY(?:[as string\s]*)?,/g, 'expiresIn: env.JWT_ACCESS_EXPIRY as string,');
  content = content.replace(/expiresIn:\s*env\.JWT_REFRESH_EXPIRY(?:[as string\s]*)?,/g, 'expiresIn: env.JWT_REFRESH_EXPIRY as string,');
  
  content = content.replace(/\}\s*\);/g, '} as jwt.SignOptions);');
  
  fs.writeFileSync(jwtPath, content);
}

console.log('Fixed services and utils');
