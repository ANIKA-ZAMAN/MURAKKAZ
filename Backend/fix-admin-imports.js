const fs = require('fs');
const glob = require('glob');
const path = require('path');

const files = glob.sync('src/routes/admin/*.ts', { cwd: __dirname, absolute: true });

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('req: Request') && !content.includes('import { Request')) {
    if (content.includes("import { Router, Response, NextFunction } from 'express';")) {
      content = content.replace("import { Router, Response, NextFunction } from 'express';", "import { Router, Request, Response, NextFunction } from 'express';");
    } else if (content.includes("import { Router, Response } from 'express';")) {
      content = content.replace("import { Router, Response } from 'express';", "import { Router, Request, Response } from 'express';");
    } else {
      content = "import { Request } from 'express';\n" + content;
    }
  }

  // Also check if Request is already imported but missing from a destructured import
  if (content.includes('req: Request') && !/import\s+\{[^}]*Request[^}]*\}\s+from\s+['"]express['"]/.test(content)) {
     if (/import\s+\{[^}]+\}\s+from\s+['"]express['"]/.test(content)) {
        content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]express['"]/, "import { Request, $1 } from 'express'");
     }
  }

  fs.writeFileSync(file, content);
});

console.log('Fixed Request imports in admin routes');
