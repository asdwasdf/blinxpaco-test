import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setExecutionMode, readExecutionMode } from '../manifest-execution-mode.js';

const tmp = mkdtempSync(join(tmpdir(), 'pacoexecmode-'));

test('readExecutionMode returns null on missing key', async () => {
  const p = join(tmp, 'm1.yaml');
  writeFileSync(p, 'phase: TEST_DESIGN\n');
  assert.equal(await readExecutionMode(p), null);
});

test('readExecutionMode returns null on missing file', async () => {
  assert.equal(await readExecutionMode(join(tmp, 'nope.yaml')), null);
});

test('setExecutionMode writes cli_first with actor and timestamp; preserves other keys', async () => {
  const p = join(tmp, 'm2.yaml');
  writeFileSync(p, 'phase: TEST_DESIGN\nexisting: keep\n');
  await setExecutionMode(p, 'cli_first', 'paco-ticket');
  const after = readFileSync(p, 'utf8');
  assert.match(after, /mode: cli_first/);
  assert.match(after, /modeSetBy: paco-ticket/);
  assert.match(after, /modeSetAt: \d{4}-\d{2}-\d{2}T/);
  assert.match(after, /existing: keep/);
  assert.equal(await readExecutionMode(p), 'cli_first');
});

test('setExecutionMode can switch to mcp_first', async () => {
  const p = join(tmp, 'm3.yaml');
  writeFileSync(p, 'phase: TEST_DESIGN\n');
  await setExecutionMode(p, 'mcp_first', 'paco-ticket');
  assert.equal(await readExecutionMode(p), 'mcp_first');
});

test('readExecutionMode tolerates malformed manifest (returns null)', async () => {
  const p = join(tmp, 'm4.yaml');
  writeFileSync(p, 'this is: not: valid: yaml: ::\n  oops');
  assert.equal(await readExecutionMode(p), null);
});

test.after(async () => {
  rmSync(tmp, { recursive: true, force: true });
});
