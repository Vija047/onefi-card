const fs = require('fs');
const path = require('path');

const binDir = path.join(__dirname, '..', 'node_modules', '.bin');
const wrapperSrc = path.join(__dirname, 'prisma-wrapper.js');
const unixBin = path.join(binDir, 'prisma');
const winBin = path.join(binDir, 'prisma.cmd');

if (!fs.existsSync(binDir)) {
  console.warn('patch-prisma-bin: node_modules/.bin missing, skipping');
  process.exit(0);
}

const unixScript = `#!/usr/bin/env node\nrequire(${JSON.stringify(wrapperSrc)});\n`;
fs.writeFileSync(unixBin, unixScript, { mode: 0o755 });

const winScript = `@ECHO off\r\nnode ${JSON.stringify(wrapperSrc)} %*\r\n`;
fs.writeFileSync(winBin, winScript);

console.log('Patched local prisma bin to soft-fail migrate deploy during build');
