#!/usr/bin/env node
/**
 * Soft-fail wrapper for `prisma migrate deploy` during CI/build.
 * Render build hosts often cannot reach Supabase direct IPv6 endpoints.
 * Startup (`npm start`) still runs a hard-fail migrate before serving traffic.
 */
const { spawnSync } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const isMigrateDeploy = args[0] === 'migrate' && args[1] === 'deploy';

let prismaCli;
try {
  prismaCli = require.resolve('prisma/build/index.js');
} catch {
  prismaCli = path.join(__dirname, '..', 'node_modules', 'prisma', 'build', 'index.js');
}

const result = spawnSync(process.execPath, [prismaCli, ...args], {
  stdio: 'inherit',
  env: process.env,
});

const status = result.status ?? 1;

if (isMigrateDeploy && status !== 0) {
  console.warn(
    'prisma migrate deploy could not reach the database during build.',
  );
  console.warn('Build will continue; migrations retry on service startup.');
  process.exit(0);
}

process.exit(status);
