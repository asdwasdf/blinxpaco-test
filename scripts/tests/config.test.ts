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
defaults:
  readOnly: true
  language: vi
  uiTermsLanguage: en
  browser: chromium
  authStrategy: manual
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
