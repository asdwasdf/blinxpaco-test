import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { access, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import {
  buildLoginUrl,
  cdpEndpoint,
  ensureAuthDirectory,
  isAuthenticationUrl,
  isDashboardUrl,
  persistentContextOptions,
  resolveProfileDirectory,
} from '../playwright-login.js';

test('launches isolated persistent Chrome with local-only CDP', () => {
  assert.deepEqual(persistentContextOptions(9222), {
    headless: false,
    channel: 'chrome',
    args: ['--remote-debugging-address=127.0.0.1', '--remote-debugging-port=9222'],
  });
  assert.equal(cdpEndpoint(9222), 'http://127.0.0.1:9222');
});

test('keeps login browser open for the Playwright run', () => {
  const source = readFileSync(new URL('../playwright-login.ts', import.meta.url), 'utf8');
  const fixture = readFileSync(
    new URL('../../playwright/fixtures/auth-fixtures.ts', import.meta.url),
    'utf8',
  );
  assert.match(source, /Giữ browser mở/);
  assert.match(source, /launchPersistentContext/);
  assert.match(fixture, /connectOverCDP/);
  assert.doesNotMatch(source, /storageState|sessionStorage/);
  assert.doesNotMatch(fixture, /browser\.close\(\)/);
});

test('starts authentication at Paco login page', () => {
  assert.equal(
    buildLoginUrl('https://blinx.dev.blinxpaco-np.com'),
    'https://blinx.dev.blinxpaco-np.com/paco/login',
  );
});

test('resolves isolated Chrome profile inside configured local directory', () => {
  assert.equal(
    resolveProfileDirectory('C:\\workspace', 'playwright/.auth'),
    path.resolve('C:\\workspace', 'playwright/.auth', 'chrome-profile'),
  );
});

test('creates missing auth directory', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'paco-auth-'));
  const directory = path.join(root, 'nested', '.auth');

  await ensureAuthDirectory(directory);

  await access(directory);
});

test('recognizes client-side redirects to authentication pages', () => {
  assert.equal(isAuthenticationUrl('https://blinx.dev.blinxpaco-np.com/paco/login'), true);
  assert.equal(isAuthenticationUrl('https://blinx.dev.blinxpaco-np.com/sign-in?returnUrl=%2Fpaco'), true);
  assert.equal(isAuthenticationUrl('https://blinx.dev.blinxpaco-np.com/paco/dashboard'), false);
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
      'https://blinx.dev.blinxpaco-np.com/paco/dashboard/',
      'https://blinx.dev.blinxpaco-np.com',
      '/paco/dashboard',
    ),
    true,
  );
  assert.equal(
    isDashboardUrl(
      'https://blinx.dev.blinxpaco-np.com/paco/dashboard/patients',
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
