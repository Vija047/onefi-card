const { spawnSync } = require('child_process');
const path = require('path');

function runPrisma(args, softFail = false) {
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

  const status = result.status ?? 1;
  if (status !== 0 && softFail) {
    console.warn(
      'prisma migrate deploy failed during build; migrations will run on startup instead.',
    );
    return 0;
  }

  return status;
}

if (runPrisma(['generate']) !== 0) {
  process.exit(1);
}

process.exit(runPrisma(['migrate', 'deploy'], true));
