const fs = require('fs');
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
  
  // Fix next(error) ending
  content = content.replace(/next\(error\)\s*\n\};\n/g, 'next(error);\n  }\n}\n');
  content = content.replace(/next\(error\)\s*\n\};$/g, 'next(error);\n  }\n};\n');
  content = content.replace(/next\(error\)\s*\n\};\n/g, 'next(error);\n  }\n};\n'); // in case it missed ;

  // Wait, I see "next(error)\n};" without a semicolon inside the file, I'll match that.
  content = content.replace(/next\(error\)\n\};\n/g, 'next(error);\n  }\n};\n');
  
  // Actually let's just do:
  content = content.replace(/next\(error\)\n\};\n/g, 'next(error);\n  }\n};\n');
  content = content.replace(/next\(error\)\n\};/g, 'next(error);\n  }\n};\n');
  
  // Fix auth.controller.ts unauthorized check
  content = content.replace(/return\s+res\.status\(401\)\.json\(\{ message: 'Unauthorized' \}\)\n\s+await/g, "return res.status(401).json({ message: 'Unauthorized' });\n    }\n    await");

  // Fix user.controller.ts file check
  content = content.replace(/throw\s+new\s+AppError\('No file uploaded', 400\)\n\s+const photoPath/g, "throw new AppError('No file uploaded', 400);\n    }\n    const photoPath");
  
  // In user.controller, Request needs to be imported from express
  if (file === 'src/controllers/user.controller.ts') {
    if (!content.includes('import { Request, Response, NextFunction }')) {
       content = content.replace(/import { Response, NextFunction } from 'express';/, "import { Request, Response, NextFunction } from 'express';");
    }
  }

  fs.writeFileSync(fullPath, content);
});

console.log('Restored broken code');
