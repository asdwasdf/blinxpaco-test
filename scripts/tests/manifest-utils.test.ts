import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { calculateChecksum, reconcileRevision } from '../checksum-utils.js';
import {
  createManifest,
  loadManifest,
  markFeatureLocationStale,
  planResume,
  reconcileManifestV1,
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
  assert.equal(Object.keys(value.phases).length, 11);
  assert.equal(Object.keys(value.phases)[3], 'LOCATE');
  assert.equal(validateManifest(value).ok, true);
  assert.equal(validateManifest({}).ok, false);
});

test('requires LOCATE before UI phases and a reason before skipping it', () => {
  const value = manifest();
  assert.equal(transitionPhase(value, 'INGEST', now).ok, true);
  value.workflow.current_phase = 'ANALYZE';
  assert.equal(transitionPhase(value, 'EXPLORE', now).ok, false);
  const located = transitionPhase(value, 'LOCATE', now);
  assert.equal(located.ok, true);
  if (!located.ok) return;
  assert.equal(transitionPhase(located.manifest, 'TEST_DESIGN', now).ok, false);
  located.manifest.phases.LOCATE.status = 'skipped';
  located.manifest.phases.LOCATE.warnings.push('Location does not apply to API-only case');
  assert.equal(transitionPhase(located.manifest, 'TEST_DESIGN', now).ok, true);
  value.workflow.current_phase = 'INGEST';
  assert.equal(transitionPhase(value, 'AUTOMATE', now).ok, false);
});

test('requires valid feature-location artifact before leaving completed LOCATE', () => {
  const value = manifest();
  value.workflow.current_phase = 'LOCATE';
  value.phases.LOCATE.status = 'completed';
  assert.equal(transitionPhase(value, 'EXPLORE', now).ok, false);
  value.outputs['feature-location.md'] = { owner: 'paco-explore', path: 'docs/tickets/PAC9-101-test/feature-location.md', state: 'valid', input_revision: 1, sha256: null };
  assert.equal(transitionPhase(value, 'EXPLORE', now).ok, true);
});

test('reconciles legacy v1 manifest without losing history', () => {
  const legacy = manifest() as unknown as Record<string, unknown>;
  const phases = legacy.phases as Record<string, unknown>;
  delete phases.LOCATE;
  const workflow = legacy.workflow as { current_phase: string; checkpoints: unknown[] };
  workflow.current_phase = 'EXPLORE';
  workflow.checkpoints.push({ at: now, phase: 'ANALYZE', outcome: 'completed', input_revision: 1, message: 'Analyzed' });
  const reconciled = reconcileManifestV1(legacy, now) as ReturnType<typeof manifest>;
  assert.equal(reconciled.phases.LOCATE.status, 'skipped');
  assert.equal(reconciled.phases.LOCATE.outcome, 'no_change');
  assert.match(reconciled.phases.LOCATE.warnings[0], /legacy/i);
  assert.equal(reconciled.workflow.checkpoints.length, 1);
  assert.equal(reconciled.workflow.current_phase, 'EXPLORE');
});

test('adds pending LOCATE to legacy workflow that has not reached EXPLORE', () => {
  const legacy = manifest() as unknown as Record<string, unknown>;
  delete (legacy.phases as Record<string, unknown>).LOCATE;
  (legacy.workflow as { current_phase: string }).current_phase = 'ANALYZE';
  const reconciled = reconcileManifestV1(legacy, now) as ReturnType<typeof manifest>;
  assert.equal(reconciled.phases.LOCATE.status, 'pending');
});

test('blocks execute with stale output', () => {
  const value = manifest();
  value.workflow.current_phase = 'AUTOMATE';
  value.outputs['automation.md'] = { owner: 'paco-playwright', path: 'docs/tickets/PAC9-101-test/automation.md', state: 'stale', input_revision: 1, sha256: null };
  assert.equal(transitionPhase(value, 'EXECUTE', now).ok, false);
});

test('marks feature location stale only for semantic location changes', () => {
  const value = manifest();
  value.outputs['feature-location.md'] = { owner: 'paco-explore', path: 'docs/tickets/PAC9-101-test/feature-location.md', state: 'valid', input_revision: 1, sha256: null };
  value.phases.LOCATE.status = 'completed';
  const unchanged = markFeatureLocationStale(value, ['expected_behavior_only'], now);
  assert.equal(unchanged.outputs['feature-location.md'].state, 'valid');
  const stale = markFeatureLocationStale(value, ['entry_path'], now);
  assert.equal(stale.outputs['feature-location.md'].state, 'stale');
  assert.equal(stale.phases.LOCATE.status, 'stale');
  assert.equal(stale.workflow.checkpoints.length, value.workflow.checkpoints.length);
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
