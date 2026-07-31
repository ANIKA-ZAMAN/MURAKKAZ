const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/controllers/blog.controller.ts',
  'src/controllers/cart.controller.ts',
  'src/controllers/collection.controller.ts',
  'src/controllers/content.controller.ts',
  'src/controllers/event.controller.ts',
  'src/controllers/order.controller.ts',
  'src/controllers/payment.controller.ts',
  'src/controllers/product.controller.ts',
  'src/controllers/review.controller.ts',
  'src/controllers/user.controller.ts',
  'src/controllers/wishlist.controller.ts',
  'src/routes/admin/product.routes.ts',
  'src/routes/admin/order.routes.ts',
  'src/routes/admin/blog.routes.ts',
  'src/routes/admin/event.routes.ts',
  'src/routes/admin/review.routes.ts',
  'src/routes/admin/content.routes.ts',
  'src/routes/admin/store.routes.ts'
];

filesToFix.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Fix req.params.xxx
  content = content.replace(/req\.params\.([a-zA-Z0-9_]+)(?!\s*as\s+string)/g, 'req.params. as string');
  
  // Fix req.query.xxx (excluding complex cases if any, but let's just do it broadly or specific)
  content = content.replace(/req\.query\.([a-zA-Z0-9_]+)(?!\s*as\s+(?:string|OrderStatus))/g, 'req.query. as string');
  
  fs.writeFileSync(fullPath, content);
  console.log('Fixed', file);
});
