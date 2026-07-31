const fs = require('fs');
const glob = require('glob');
const path = require('path');

const files = [
  'src/controllers/cart.controller.ts',
  'src/controllers/order.controller.ts',
  'src/controllers/wishlist.controller.ts',
  'src/controllers/user.controller.ts',
  'src/controllers/auth.controller.ts'
];

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Fix the leftover bracket
  content = content.replace(/;\s*\}\s*\n/g, '\n');
  content = content.replace(/;\n\}\n/g, '\n');
  content = content.replace(/\n;\n\}\n/g, '\n');
  content = content.replace(/\n\}\n/g, '\n');
  
  fs.writeFileSync(fullPath, content);
});

console.log('Fixed leftover brackets');
