const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function resolvePrismaCli() {
  const original = path.join(
    __dirname,
    '..',
    'node_modules',
    'prisma',
    'build',
    'index.original.js',
  );
  if (fs.existsSync(original)) return original;

  return path.join(
    __dirname,
    '..',
    'node_modules',
    'prisma',
    'build',
    'index.js',
  );
}

function runPrisma(args) {
  const prismaCli = resolvePrismaCli();
  console.log(`> prisma ${args.join(' ')}`);
  const result = spawnSync(process.execPath, [prismaCli, ...args], {
    stdio: 'inherit',
    env: process.env,
  });
  return result.status ?? 1;
}

if (runPrisma(['generate']) !== 0) {
  console.error('prisma generate failed on startup');
  process.exit(1);
}

if (runPrisma(['migrate', 'deploy']) !== 0) {
  console.error('Startup migration failed');
  process.exit(1);
}

require('../index.js');
