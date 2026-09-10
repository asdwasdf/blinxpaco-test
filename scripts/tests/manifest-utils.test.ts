import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { calculateChecksum, reconcileRevision } from '../checksum-utils.js';
import {
  createManifest,
  loadManifest,
  planResume,
  propagateStale,
  reconcileArtifacts,
  saveManifest,
  transitionPhase,
  validateManifest,
} from '../manifest-utils.js';

const now = '2026-09-10T00:00:00.000Z';
const ticket = { key: 'PAC9-101', folder_name: 'PAC9-101-test', source_directory: 'ticket/PAC9-101-test', primary_source: 'ticket.md' };
const source = { path: 'ticket.md', role: 'primary_source' as const, type: 'md', sha256: calculateChecksum('v1') };

function manifest() {
  return createManifest(ticket, { revision: 1, generated_at: now, files: [source] }, now);
}

test('creates and validates all phases', () => {
  const value = manifest();
  assert.equal(Object.keys(value.phases).length, 10);
  assert.equal(validateManifest(value).ok, true);
  assert.equal(validateManifest({}).ok, false);
});

test('allows linear and shortcut transitions but rejects invalid jump', () => {
  const value = manifest();
  assert.equal(transitionPhase(value, 'INGEST', now).ok, true);
  value.workflow.current_phase = 'ANALYZE';
  assert.equal(transitionPhase(value, 'TEST_DESIGN', now).ok, true);
  value.workflow.current_phase = 'INGEST';
  assert.equal(transitionPhase(value, 'AUTOMATE', now).ok, false);
});

test('blocks execute with stale output', () => {
  const value = manifest();
  value.workflow.current_phase = 'AUTOMATE';
  value.outputs['automation.md'] = { owner: 'paco-playwright', path: 'docs/tickets/PAC9-101-test/automation.md', state: 'stale', input_revision: 1, sha256: null };
  assert.equal(transitionPhase(value, 'EXECUTE', now).ok, false);
});

test('propagates primary source staleness without deletion', () => {
  const value = manifest();
  for (const [name, owner] of [['requirements.md', 'paco-requirements'], ['test-cases.md', 'paco-test-design'], ['automation.md', 'paco-playwright'], ['report.md', 'paco-report']] as const) {
    value.outputs[name] = { owner, path: `docs/tickets/PAC9-101-test/${name}`, state: 'valid', input_revision: 1, sha256: null };
  }
  const next = reconcileRevision(value.input_snapshot, [{ ...source, sha256: calculateChecksum('v2') }], now);
  const stale = propagateStale(value, next.delta, next.snapshot, now);
  assert.equal(stale.outputs['requirements.md'].state, 'stale');
  assert.equal(stale.outputs['automation.md'].state, 'review_required');
  assert.equal(Object.keys(stale.outputs).length, 4);
});

test('reconciles missing and corrupt artifacts', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'paco-manifest-'));
  const value = manifest();
  const artifact = 'docs/tickets/PAC9-101-test/requirements.md';
  value.outputs['requirements.md'] = { owner: 'paco-requirements', path: artifact, state: 'valid', input_revision: 1, sha256: calculateChecksum('expected') };
  let result = await reconcileArtifacts(value, root);
  assert.equal(result.manifest.outputs['requirements.md'].state, 'missing');
  await mkdir(path.dirname(path.join(root, artifact)), { recursive: true });
  await writeFile(path.join(root, artifact), 'wrong');
  result = await reconcileArtifacts(value, root);
  assert.equal(result.manifest.outputs['requirements.md'].state, 'corrupt');
});

test('resumes first incomplete phase and rejects premature requested phase', () => {
  const value = manifest();
  value.phases.DISCOVER.status = 'completed';
  const resume = planResume(value);
  assert.equal(resume.ok, true);
  if (resume.ok) assert.equal(resume.phase, 'INGEST');
  assert.equal(planResume(value, 'REPORT').ok, false);
});

test('saves atomically and skips unchanged content', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'paco-manifest-'));
  const file = path.join(root, 'manifest.yaml');
  assert.equal(await saveManifest(file, manifest()), 'written');
  assert.equal(await saveManifest(file, manifest()), 'unchanged');
  assert.equal((await loadManifest(file)).ticket.key, 'PAC9-101');
  assert.match(await readFile(file, 'utf8'), /schema_version: 1/);
});
