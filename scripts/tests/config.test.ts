import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { getDefaultEnvironment, loadConfig } from '../load-config.js';

const validConfig = `product: Paco
environments:
  default: dev
  dev:
    baseUrl: https://example.test
    dashboardPath: /paco/dashboard
paths:
  ticketSource: ticket
  ticketOutput: docs/tickets
  testResults: test-results
  playwrightAuth: playwright/.auth
ticket:
  sourcePattern: "^[A-Z][A-Z0-9]*-[0-9]+-[a-z0-9]+(?:-[a-z0-9]+)*$"
  primarySourceFile: ticket.md
safety:
  mutationEnabledEnvironments: [dev]
  allowedHosts: [example.test]
  externalDevHosts: []
defaults:
  readOnly: true
  language: vi
  uiTermsLanguage: en
  browser: chromium
  authStrategy: manual
  locateMaxMinutes: 15
  locateMaxViews: 12
  reusableRouteMaxViews: 3
`;

async function configFile(content: string): Promise<string> {
  const directory = await mkdtemp(path.join(tmpdir(), 'paco-config-'));
  const file = path.join(directory, 'paco.config.yaml');
  await writeFile(file, content);
  return file;
}

test('loads and resolves valid config', async () => {
  const config = loadConfig(await configFile(validConfig));
  assert.equal(config.product, 'Paco');
  assert.deepEqual(getDefaultEnvironment(config), {
    baseUrl: 'https://example.test',
    dashboardPath: '/paco/dashboard',
  });
  assert.deepEqual({ minutes: config.defaults.locateMaxMinutes, views: config.defaults.locateMaxViews, reuse: config.defaults.reusableRouteMaxViews }, { minutes: 15, views: 12, reuse: 3 });
  assert.deepEqual(config.safety, {
    mutationEnabledEnvironments: ['dev'],
    allowedHosts: ['example.test'],
    externalDevHosts: [],
  });
});

test('rejects missing and URL-shaped allowed hosts', async () => {
  const empty = await configFile(validConfig.replace('  allowedHosts: [example.test]\n', '  allowedHosts: []\n'));
  const url = await configFile(validConfig.replace('  allowedHosts: [example.test]\n', '  allowedHosts: [https://example.test]\n'));
  assert.throws(() => loadConfig(empty), /safety\.allowedHosts/);
  assert.throws(() => loadConfig(url), /safety\.allowedHosts/);
});

test('rejects invalid LOCATE limits', async () => {
  const file = await configFile(validConfig.replace('  locateMaxViews: 12', '  locateMaxViews: 0'));
  assert.throws(() => loadConfig(file), /defaults\.locateMaxViews/);
});

test('rejects missing field with path', async () => {
  const file = await configFile(validConfig.replace('  ticketSource: ticket\n', ''));
  assert.throws(() => loadConfig(file), /paths\.ticketSource/);
});

test('rejects invalid source regex', async () => {
  const file = await configFile(
    validConfig.replace(
      '  sourcePattern: "^[A-Z][A-Z0-9]*-[0-9]+-[a-z0-9]+(?:-[a-z0-9]+)*$"',
      '  sourcePattern: "["',
    ),
  );
  assert.throws(() => loadConfig(file), /ticket\.sourcePattern/);
});

test('rejects default environment that is not an object', async () => {
  const file = await configFile(validConfig.replace('  default: dev', '  default: missing'));
  assert.throws(() => loadConfig(file), /environments\.default/);
});
