const fs = require('fs');
const path = require('path');
const authPath = path.join(__dirname, 'src/services/auth.service.ts');
let content = fs.readFileSync(authPath, 'utf8');
content = content.replace(/bcrypt\.compare\([^,]+,\s*user\.passwordHash\)/g, match => match.replace('user.passwordHash', 'user.passwordHash!'));
fs.writeFileSync(authPath, content);
console.log('Fixed auth');
