import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setMutationMode, readMutationMode } from '../manifest-mutation-mode.js';

const tmp = mkdtempSync(join(tmpdir(), 'pacomanifest-'));

test('readMutationMode returns null on missing key', async () => {
  const p = join(tmp, 'm1.yaml');
  writeFileSync(p, 'phase: TEST_DESIGN\n');
  assert.equal(await readMutationMode(p), null);
});

test('readMutationMode returns null on missing file', async () => {
  assert.equal(await readMutationMode(join(tmp, 'nope.yaml')), null);
});

test('setMutationMode writes auto with actor and timestamp; preserves other keys', async () => {
  const p = join(tmp, 'm2.yaml');
  writeFileSync(p, 'phase: TEST_DESIGN\nexisting: keep\n');
  await setMutationMode(p, 'auto', 'paco-ticket');
  const after = readFileSync(p, 'utf8');
  assert.match(after, /mutationMode: auto/);
  assert.match(after, /mutationModeSetBy: paco-ticket/);
  assert.match(after, /mutationModeSetAt: \d{4}-\d{2}-\d{2}T/);
  assert.match(after, /existing: keep/);
  assert.equal(await readMutationMode(p), 'auto');
});

test('readMutationMode tolerates malformed manifest (returns null)', async () => {
  const p = join(tmp, 'm3.yaml');
  writeFileSync(p, 'this is: not: valid: yaml: ::\n  oops');
  assert.equal(await readMutationMode(p), null);
});

test.after(async () => {
  rmSync(tmp, { recursive: true, force: true });
});
