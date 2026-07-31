const fs = require('fs');
const glob = require('glob');
const path = require('path');

// 1. Fix jwt.ts
const jwtPath = path.join(__dirname, 'src/utils/jwt.ts');
if (fs.existsSync(jwtPath)) {
  let content = fs.readFileSync(jwtPath, 'utf8');
  content = content.replace(/\}\s*as\s+jwt\.SignOptions\s*\);/g, '});');
  content = content.replace(/expiresIn:\s*env\.JWT_ACCESS_EXPIRY\s+as\s+string,\s*\}/g, 'expiresIn: env.JWT_ACCESS_EXPIRY as string,\n  } as jwt.SignOptions');
  content = content.replace(/expiresIn:\s*env\.JWT_REFRESH_EXPIRY\s+as\s+string,\s*\}/g, 'expiresIn: env.JWT_REFRESH_EXPIRY as string,\n  } as jwt.SignOptions');
  fs.writeFileSync(jwtPath, content);
}

// 2. Fix AppError and preference in all services
const services = glob.sync('src/services/*.ts', { cwd: __dirname, absolute: true });
services.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // AppError args
  content = content.replace(/new\s+AppError\(\s*(\d+)\s*,\s*(['"`][^'"`]+['"`])\s*\)/g, 'new AppError($2, $1)');
  
  // preference instead of preferences
  content = content.replace(/preferences:/g, 'preference:');
  
  // Fix product.service.ts import
  if (file.includes('product.service.ts')) {
    content = content.replace(/import\s*\{\s*prisma\s*\}\s*from\s*['"]\.\.\/lib\/prisma['"];?/, "import prisma from '../config/database';");
  }

  // Fix auth.service.ts generateAccessToken
  if (file.includes('auth.service.ts')) {
    content = content.replace(/generateAccessToken\(\s*user\.id\s*\)/g, 'generateAccessToken(user.id, user.role)');
    
    // Check if there are other password vs passwordHash
    content = content.replace(/await bcrypt\.compare\(password,\s*user\.password\)/g, 'await bcrypt.compare(password, user.passwordHash!)');
    content = content.replace(/user\.password/g, 'user.passwordHash');
  }
  
  fs.writeFileSync(file, content);
});

console.log('Fixed services and utils');
