import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import browserPaths from './browser-paths.cjs';

const chromeBinary = browserPaths.ensureChromeBin();
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const ngBinary = path.resolve(currentDir, '..', 'node_modules', '.bin', 'ng');

if (!chromeBinary) {
  console.error(
    'No se encontro ningun Chrome/Chromium compatible para Karma. Instala uno del sistema o ejecuta `pnpm exec browsers install chrome@stable --path ./.cache/puppeteer`.'
  );
  process.exit(1);
}

const extraArgs = process.argv.slice(2).filter((arg) => arg !== '--');
const env = {
  ...process.env,
  CHROME_BIN: chromeBinary,
};

console.log(`Usando ChromeHeadless con ${chromeBinary}`);

const result = spawnSync(
  ngBinary,
  ['test', '--watch=false', '--browsers=ChromeHeadlessCI', ...extraArgs],
  {
    stdio: 'inherit',
    env,
  }
);

process.exit(result.status ?? 1);
