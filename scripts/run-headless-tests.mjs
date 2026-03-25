import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const browserCandidates = [
  {
    launcher: 'ChromeHeadless',
    envKey: 'CHROME_BIN',
    binaries: [
      process.env.CHROME_BIN,
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/usr/local/bin/google-chrome',
      '/usr/local/bin/chromium',
    ].filter(Boolean),
  },
  {
    launcher: 'FirefoxHeadless',
    envKey: 'FIREFOX_BIN',
    binaries: [process.env.FIREFOX_BIN, '/usr/bin/firefox', '/usr/local/bin/firefox'].filter(Boolean),
  },
];

const findInstalledBrowser = () => {
  for (const candidate of browserCandidates) {
    const binary = candidate.binaries.find((path) => existsSync(path));
    if (binary) {
      return { ...candidate, binary };
    }
  }

  return null;
};

const selectedBrowser = findInstalledBrowser();

if (!selectedBrowser) {
  console.error(
    'No se encontro ningun navegador compatible para Karma. Instala Chrome/Chromium o Firefox, o define CHROME_BIN/FIREFOX_BIN.'
  );
  process.exit(1);
}

const extraArgs = process.argv.slice(2);
const env = {
  ...process.env,
  [selectedBrowser.envKey]: selectedBrowser.binary,
};

console.log(`Usando ${selectedBrowser.launcher} con ${selectedBrowser.binary}`);

const result = spawnSync(
  'pnpm',
  ['exec', 'ng', 'test', '--watch=false', `--browsers=${selectedBrowser.launcher}`, ...extraArgs],
  {
    stdio: 'inherit',
    env,
  }
);

process.exit(result.status ?? 1);
