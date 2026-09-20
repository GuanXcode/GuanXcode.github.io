import { existsSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const targets = [
  join(root, '.astro', 'data-store.json'),
  join(root, '.astro', 'data-store'),
  join(root, 'node_modules', '.astro', 'data-store.json'),
  join(root, 'node_modules', '.astro', 'data-store'),
];

for (const target of targets) {
  if (!existsSync(target)) continue;
  rmSync(target, { recursive: true, force: true });
  console.log(`removed ${target.slice(root.length + 1)}`);
}

const result = spawnSync('npx', ['astro', 'sync'], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log('\nContent cache rebuilt. If `astro dev` is already running, restart it (or use npm run dev:fresh).');
