const fs = require('fs');
const glob = require('glob');

const dirs = [
  'src/controllers/*.ts',
  'src/routes/admin/*.ts'
];

dirs.forEach(pattern => {
  const files = glob.sync(pattern, { cwd: __dirname, absolute: true });
  files.forEach(fullPath => {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Fix `const  = req.params.id as string;`
    content = content.replace(/const\s+=\s*req\.params\.id\s+as\s+string;/g, 'const id = req.params.id as string;');
    
    // Fix `const  = req.params.orderId as string;`
    content = content.replace(/const\s+=\s*req\.params\.orderId\s+as\s+string;/g, 'const orderId = req.params.orderId as string;');

    // Fix `const  = req.params.key as string;`
    content = content.replace(/const\s+=\s*req\.params\.key\s+as\s+string;/g, 'const key = req.params.key as string;');

    // General fallback just in case
    content = content.replace(/const\s+=\s*req\.params\.([a-zA-Z0-9_]+)\s+as\s+string;/g, 'const $1 = req.params.$1 as string;');

    fs.writeFileSync(fullPath, content);
  });
});
console.log('Fixed destructurings properly');
