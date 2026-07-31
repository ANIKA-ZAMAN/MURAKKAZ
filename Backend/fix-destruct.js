const fs = require('fs');
const path = require('path');
const glob = require('glob');

const dirs = [
  'src/controllers/*.ts',
  'src/routes/admin/*.ts'
];

dirs.forEach(pattern => {
  const files = glob.sync(pattern, { cwd: __dirname, absolute: true });
  files.forEach(fullPath => {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Fix destructured req.params
    // const { id } = req.params; -> const id = req.params.id as string;
    // const { slug } = req.params; -> const slug = req.params.slug as string;
    // const { id, status } = req.params; -> wouldn't handle this properly but let's see.
    content = content.replace(/const\s+\{\s*([a-zA-Z0-9_]+)\s*\}\s*=\s*req\.params;/g, 'const  = req.params. as string;');
    
    // Check if there are multiple destructurings, this simple regex covers single var.
    
    fs.writeFileSync(fullPath, content);
  });
});
console.log('Fixed destructuring');
