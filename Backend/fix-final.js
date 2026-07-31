const fs = require('fs');
const path = require('path');

// 1. auth.service.ts
const authPath = path.join(__dirname, 'src/services/auth.service.ts');
let authContent = fs.readFileSync(authPath, 'utf8');
authContent = authContent.replace(/passwordHashHash/g, 'passwordHash');
// Fix missing argument in generateAccessToken inside refreshAccessToken
authContent = authContent.replace(/const\s+accessToken\s*=\s*generateAccessToken\s*\(\s*refreshTokenRecord\.userId\s*\);/g, 'const user = await prisma.user.findUnique({ where: { id: refreshTokenRecord.userId } });\n  const accessToken = generateAccessToken(refreshTokenRecord.userId, user!.role);');
fs.writeFileSync(authPath, authContent);

// 2. product.service.ts
const prodPath = path.join(__dirname, 'src/services/product.service.ts');
let prodContent = fs.readFileSync(prodPath, 'utf8');
// Fix getPaginationParams call to handle numbers
prodContent = prodContent.replace(/getPaginationParams\(\{\s*page,\s*limit\s*\}\)/, "getPaginationParams({ page: page?.toString(), limit: limit?.toString() })");
prodContent = prodContent.replace(/createPaginatedResult\(products,\s*total,\s*page,\s*limit\)/, "createPaginatedResult(products, total, page || 1, limit || 12)");
fs.writeFileSync(prodPath, prodContent);

// 3. review.service.ts
const revPath = path.join(__dirname, 'src/services/review.service.ts');
let revContent = fs.readFileSync(revPath, 'utf8');
// Fetch user name for the review
revContent = revContent.replace(/const\s+review\s*=\s*await\s+prisma\.review\.create\(\{\n\s*data:\s*\{/, "const user = await prisma.user.findUnique({ where: { id: userId } });\n  const name = user ? `${user.firstName} ${user.lastName}` : 'Anonymous';\n\n  const review = await prisma.review.create({\n    data: {\n      name,");
fs.writeFileSync(revPath, revContent);

// 4. store.service.ts
const storePath = path.join(__dirname, 'src/services/store.service.ts');
let storeContent = fs.readFileSync(storePath, 'utf8');
storeContent = storeContent.replace(/prisma\.store\./g, 'prisma.storeLocation.');
fs.writeFileSync(storePath, storeContent);

console.log('Fixed final TS errors');
