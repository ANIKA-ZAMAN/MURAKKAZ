const { Client } = require('../Backend/node_modules/ssh2');
const fs = require('fs');

let cmd = process.argv.slice(2).join(' ');
if (process.argv[2] === '--file' && process.argv[3]) {
  const b64 = fs.readFileSync(process.argv[3]).toString('base64');
  cmd = `node -e "eval(Buffer.from('${b64}', 'base64').toString('utf8'))"`;
}

if (!cmd) {
  console.error('No command provided');
  process.exit(1);
}

const conn = new Client();
conn.on('ready', () => {
  conn.exec(cmd, (err, stream) => {
    if (err) {
      console.error(err);
      conn.end();
      process.exit(1);
    }
    stream.on('data', d => process.stdout.write(d));
    stream.stderr.on('data', d => process.stderr.write(d));
    stream.on('close', (code) => {
      conn.end();
      process.exit(code || 0);
    });
  });
}).connect({
  host: '103.174.51.34',
  username: 'root',
  password: 'jnq6KTVETq8o7KcopZ5y',
  readyTimeout: 20000
});
