import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const contractRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

if (process.platform === 'win32') {
  const drive = contractRoot.slice(0, 1).toLowerCase();
  const remainder = contractRoot.slice(2).replaceAll('\\', '/');
  const wslPath = `/mnt/${drive}${remainder}`;
  execFileSync(
    'wsl.exe',
    [
      '-d',
      'Ubuntu-22.04',
      '--',
      'bash',
      '-lc',
      `cd '${wslPath}' && compact compile +0.31.1 src/aegisbid.compact src/managed/aegisbid`,
    ],
    { stdio: 'inherit' },
  );
} else {
  execFileSync(
    'compact',
    ['compile', '+0.31.1', 'src/aegisbid.compact', 'src/managed/aegisbid'],
    { cwd: contractRoot, stdio: 'inherit' },
  );
}
