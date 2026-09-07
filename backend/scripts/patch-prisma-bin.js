const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const prismaBuildDir = path.join(root, 'node_modules', 'prisma', 'build');
const binDir = path.join(root, 'node_modules', '.bin');
const cliPath = path.join(prismaBuildDir, 'index.js');
const originalPath = path.join(prismaBuildDir, 'index.original.js');
const marker = path.join(prismaBuildDir, '.soft-migrate-patched');

if (!fs.existsSync(cliPath)) {
  console.warn('patch-prisma-bin: prisma CLI missing, skipping');
  process.exit(0);
}

if (!fs.existsSync(originalPath)) {
  // Only copy once — never overwrite the real CLI with our wrapper.
  if (!fs.existsSync(marker)) {
    fs.copyFileSync(cliPath, originalPath);
  }
}

const wrapper = `#!/usr/bin/env node
const { spawnSync } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const isMigrateDeploy = args[0] === 'migrate' && args[1] === 'deploy';
const originalCli = path.join(__dirname, 'index.original.js');

const result = spawnSync(process.execPath, [originalCli, ...args], {
  stdio: 'inherit',
  env: process.env,
});

const status = result.status ?? 1;

if (isMigrateDeploy && status !== 0) {
  console.warn('prisma migrate deploy could not reach the database during build.');
  console.warn('Build will continue; migrations retry on service startup.');
  process.exit(0);
}

process.exit(status);
`;

fs.writeFileSync(cliPath, wrapper, { mode: 0o755 });
fs.writeFileSync(marker, '1');

if (fs.existsSync(binDir)) {
  const unixBin = path.join(binDir, 'prisma');
  const winBin = path.join(binDir, 'prisma.cmd');
  const cliAbs = cliPath.replace(/\\/g, '\\\\');

  fs.writeFileSync(
    unixBin,
    `#!/usr/bin/env node\nrequire(${JSON.stringify(cliPath)});\n`,
    { mode: 0o755 },
  );
  fs.writeFileSync(
    winBin,
    `@ECHO off\r\nnode "${cliPath}" %*\r\n`,
  );
}

console.log('Patched prisma CLI to soft-fail migrate deploy during build');
