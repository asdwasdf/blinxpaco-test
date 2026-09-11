import assert from 'node:assert/strict';
import { access, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import {
  browserLaunchOptions,
  buildLoginUrl,
  ensureAuthDirectory,
  isDashboardUrl,
  resolveAuthFile,
} from '../playwright-login.js';

test('launches installed Chrome without Playwright browser download', () => {
  assert.deepEqual(browserLaunchOptions(), { headless: false, channel: 'chrome' });
});

test('starts authentication at Paco login page', () => {
  assert.equal(
    buildLoginUrl('https://blinx.dev.blinxpaco-np.com'),
    'https://blinx.dev.blinxpaco-np.com/paco/login',
  );
});

test('resolves auth state inside configured local directory', () => {
  assert.equal(
    resolveAuthFile('C:\\workspace', 'playwright/.auth'),
    path.resolve('C:\\workspace', 'playwright/.auth', 'user.json'),
  );
});

test('creates missing auth directory', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'paco-auth-'));
  const directory = path.join(root, 'nested', '.auth');

  await ensureAuthDirectory(directory);

  await access(directory);
});

test('accepts only dashboard URL on configured origin', () => {
  assert.equal(
    isDashboardUrl(
      'https://blinx.dev.blinxpaco-np.com/paco/dashboard?welcome=true',
      'https://blinx.dev.blinxpaco-np.com',
      '/paco/dashboard',
    ),
    true,
  );
  assert.equal(
    isDashboardUrl(
      'https://evil.example/paco/dashboard',
      'https://blinx.dev.blinxpaco-np.com',
      '/paco/dashboard',
    ),
    false,
  );
  assert.equal(
    isDashboardUrl(
      'https://blinx.dev.blinxpaco-np.com/login',
      'https://blinx.dev.blinxpaco-np.com',
      '/paco/dashboard',
    ),
    false,
  );
});
