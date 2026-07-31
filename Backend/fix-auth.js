const fs = require('fs');
const glob = require('glob');
const path = require('path');

// 1. Fix src/types/index.ts
const typesIndex = path.join(__dirname, 'src/types/index.ts');
if (fs.existsSync(typesIndex)) {
  fs.writeFileSync(typesIndex, `export interface ProductFilterParams {
  q?: string;
  family?: string;
  gender?: string;
  occasion?: string;
  meter?: string;
  notes?: string;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}
`);
}

// 2. Fix all controllers
const controllers = glob.sync('src/controllers/*.ts', { cwd: __dirname, absolute: true });
controllers.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Remove import
  content = content.replace(/import\s*\{\s*AuthenticatedRequest\s*\}\s*from\s*['"]\.\.\/types['"];?\n?/g, '');
  content = content.replace(/import\s*\{\s*AuthenticatedRequest(?:,\s*[^}]+)?\s*\}\s*from\s*['"]\.\.\/types['"];?\n?/g, match => {
    // If it imports other things, remove only AuthenticatedRequest
    let updated = match.replace(/AuthenticatedRequest\s*,?\s*/, '');
    if (updated.includes('{ }') || updated.includes('{}')) return '';
    return updated;
  });
  
  // Remove local interface definition if it exists
  content = content.replace(/interface\s+AuthenticatedRequest\s+extends\s+Request\s*\{[^}]+\}\n?/g, '');
  
  // Replace `req: AuthenticatedRequest` with `req: Request`
  content = content.replace(/req:\s*AuthenticatedRequest/g, 'req: Request');
  
  fs.writeFileSync(file, content);
});

// 3. Fix all admin routes
const adminRoutes = glob.sync('src/routes/admin/*.ts', { cwd: __dirname, absolute: true });
adminRoutes.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(/import\s*\{\s*AuthenticatedRequest\s*\}\s*from\s*['"]\.\.\/\.\.\/types['"];?\n?/g, '');
  content = content.replace(/req:\s*AuthenticatedRequest/g, 'req: Request');
  
  fs.writeFileSync(file, content);
});

console.log('Fixed AuthenticatedRequest');
