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
    
    // Fix the broken destructurings: "const  = req.params. as string;"
    // It should be either 'id' or 'key' depending on the controller/route context, but usually 'id'.
    // In content.routes.ts it was `const { key } = req.params;` => `const key = req.params.key as string;`
    // In others it's mostly 'id'.
    content = content.replace(/const\s+=\s*req\.params\.\s+as\s+string;/g, () => {
      if (fullPath.includes('content.routes.ts')) {
        return 'const key = req.params.key as string;';
      }
      if (fullPath.includes('payment.controller.ts')) {
        return 'const orderId = req.params.orderId as string;';
      }
      return 'const id = req.params.id as string;';
    });

    fs.writeFileSync(fullPath, content);
  });
});
console.log('Fixed destructurings for real');
