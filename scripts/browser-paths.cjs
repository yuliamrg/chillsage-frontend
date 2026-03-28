const { existsSync, readdirSync } = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');

const findFirstExisting = (candidates) => candidates.find((candidate) => candidate && existsSync(candidate)) ?? null;

const listProjectChromeCandidates = () => {
  const chromeRoot = path.join(projectRoot, '.cache', 'puppeteer', 'chrome');

  if (!existsSync(chromeRoot)) {
    return [];
  }

  return readdirSync(chromeRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(chromeRoot, entry.name, 'chrome-linux64', 'chrome'))
    .filter((candidate) => existsSync(candidate))
    .sort()
    .reverse();
};

const findChromeBinary = () =>
  findFirstExisting([
    process.env.CHROME_BIN,
    ...listProjectChromeCandidates(),
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/local/bin/google-chrome',
    '/usr/local/bin/chromium',
  ]);

const ensureChromeBin = () => {
  const chromeBinary = findChromeBinary();
  if (chromeBinary) {
    process.env.CHROME_BIN = chromeBinary;
  }

  return chromeBinary;
};

module.exports = {
  ensureChromeBin,
  findChromeBinary,
};
