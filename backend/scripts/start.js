const { spawnSync } = require('child_process');
const path = require('path');

function runPrisma(args) {
  const prismaCli = path.join(
    __dirname,
    '..',
    'node_modules',
    'prisma',
    'build',
    'index.js',
  );

  console.log(`> prisma ${args.join(' ')}`);
  const result = spawnSync(process.execPath, [prismaCli, ...args], {
    stdio: 'inherit',
    env: process.env,
  });

  return result.status ?? 1;
}

const status = runPrisma(['migrate', 'deploy']);
if (status !== 0) {
  console.error('Startup migration failed');
  process.exit(status);
}

require('../index.js');
