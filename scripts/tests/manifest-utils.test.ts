import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { calculateChecksum, reconcileRevision } from '../checksum-utils.js';
import type { ChildSkillOutcome } from '../child-outcome.js';
import type { AutomationCaseImplementation, ManualCaseExecution, TestResult } from '../workflow-types.js';
import {
  applyPlaywrightOutcome,
  createManifest,
  loadManifest,
  markFeatureLocationStale,
  planResume,
  reconcileManifest,
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

test('creates workflow v2 with split execution phases', () => {
  const value = manifest();
  assert.equal(value.schema_version, 2);
  assert.deepEqual(Object.keys(value.phases), [
    'DISCOVER', 'INGEST', 'ANALYZE', 'LOCATE', 'EXPLORE', 'TEST_DESIGN',
    'MANUAL_EXECUTE', 'AUTOMATE', 'AUTOMATION_EXECUTE', 'REPORT', 'COMPLETE',
  ]);
  assert.deepEqual(value.execution, { case_ids: [], manual: {}, automation: {}, runs: {} });
  assert.equal(validateManifest(value).ok, true);
  assert.equal(validateManifest({}).ok, false);
});

test('rejects malformed structured execution records', () => {
  const value = manifest();
  value.execution.manual['TC-1'] = { ...manualExecution('Pass'), result: 'Maybe' as never };
  value.execution.automation['TC-1'] = { ...implementation('wrong.txt'), diagnostic: 'false' as never };
  value.execution.runs['TC-1'] = { result: 'Pass', verification: 'Unknown' as never, evidence: [], product_result_changed: true as never };
  const result = validateManifest(value);
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.issues.join(' '), /execution\.manual\.TC-1.*execution\.automation\.TC-1.*execution\.runs\.TC-1/s);
});

test('uses the execution-first transition order', () => {
  const value = manifest();
  value.workflow.current_phase = 'TEST_DESIGN';
  value.phases.TEST_DESIGN.status = 'completed';
  value.outputs['test-cases.md'] = {
    owner: 'paco-test-design', path: 'docs/tickets/PAC9-101-test/test-cases.md',
    state: 'valid', input_revision: 1, sha256: null,
  };
  assert.equal(transitionPhase(value, 'MANUAL_EXECUTE', now).ok, true);
  assert.equal(transitionPhase(value, 'AUTOMATE', now).ok, false);
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

function legacyManifestAt(currentPhase: 'AUTOMATION_REVIEW' | 'AUTOMATE' | 'EXECUTE' | 'COMPLETE') {
  const value = manifest() as unknown as Record<string, unknown>;
  value.schema_version = 1;
  delete value.execution;
  const phases = value.phases as Record<string, unknown>;
  phases.AUTOMATION_REVIEW = phases.MANUAL_EXECUTE;
  phases.EXECUTE = phases.AUTOMATION_EXECUTE;
  delete phases.MANUAL_EXECUTE;
  delete phases.AUTOMATION_EXECUTE;
  const workflow = value.workflow as { current_phase: string; checkpoints: unknown[] };
  workflow.current_phase = currentPhase;
  workflow.checkpoints.push({ at: now, phase: 'ANALYZE', outcome: 'completed', input_revision: 1, message: 'Analyzed' });
  return value;
}

for (const oldPhase of ['AUTOMATION_REVIEW', 'AUTOMATE', 'EXECUTE', 'COMPLETE'] as const) {
  test(`migrates legacy ${oldPhase} without claiming new execution evidence`, () => {
    const legacy = legacyManifestAt(oldPhase);
    const reconciled = reconcileManifest(legacy, now) as ReturnType<typeof manifest>;
    assert.equal(reconciled.schema_version, 2);
    assert.equal(reconciled.workflow.current_phase, 'MANUAL_EXECUTE');
    assert.deepEqual(reconciled.execution, { case_ids: [], manual: {}, automation: {}, runs: {} });
    assert.equal(reconciled.workflow.checkpoints.length, 1);
    assert.match(reconciled.phases.MANUAL_EXECUTE.warnings.join(' '), /Legacy v1/);
  });
}

test('reconciles missing LOCATE while migrating legacy v1', () => {
  const legacy = legacyManifestAt('AUTOMATION_REVIEW');
  delete (legacy.phases as Record<string, unknown>).LOCATE;
  const reconciled = reconcileManifest(legacy, now) as ReturnType<typeof manifest>;
  assert.equal(reconciled.phases.LOCATE.status, 'skipped');
  assert.equal(reconciled.phases.LOCATE.outcome, 'no_change');
});

test('blocks automation execution with stale output', () => {
  const value = manifest();
  value.workflow.current_phase = 'AUTOMATE';
  value.outputs['automation.md'] = { owner: 'paco-playwright', path: 'docs/tickets/PAC9-101-test/automation.md', state: 'stale', input_revision: 1, sha256: null };
  assert.equal(transitionPhase(value, 'AUTOMATION_EXECUTE', now).ok, false);
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

function manualExecution(result: TestResult, reason: string | null = null): ManualCaseExecution {
  return {
    result,
    expected_basis: result === 'Fail' ? 'Confirmed' : 'Observed',
    attempts: result === 'Blocked' || result === 'Not Run' ? [] : [{ id: 'attempt-1', result, data_variant: 'initial', evidence: ['evidence/1.png'] }],
    control_path_checked: result === 'Fail', route: '/feature', locators: ['button:Save'], skip_or_block_reason: reason,
  };
}

function implementation(spec_path: string | null, reason: string | null = null, input_revision = 1, diagnostic = false): AutomationCaseImplementation {
  return { spec_path, diagnostic, reason, input_revision };
}

function readyAt(phase: 'AUTOMATE' | 'AUTOMATION_EXECUTE') {
  const value = manifest();
  value.workflow.current_phase = phase;
  value.phases[phase].status = 'completed';
  value.outputs['automation.md'] = { owner: 'paco-playwright', path: 'docs/tickets/PAC9-101-test/automation.md', state: 'valid', input_revision: 1, sha256: null };
  return value;
}

test('blocks AUTOMATE without a designed case inventory', () => {
  const value = manifest();
  value.workflow.current_phase = 'MANUAL_EXECUTE';
  const result = transitionPhase(value, 'AUTOMATE', now);
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.reason, /case inventory/i);
});

test('blocks AUTOMATE until every designed case has a manual result', () => {
  const value = manifest();
  value.workflow.current_phase = 'MANUAL_EXECUTE';
  value.execution.case_ids = ['TC-1', 'TC-2'];
  value.execution.manual['TC-1'] = manualExecution('Pass');
  const result = transitionPhase(value, 'AUTOMATE', now);
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.reason, /TC-2.*manual result/i);
});

test('requires specs for every manual Pass and Fail', () => {
  const value = readyAt('AUTOMATE');
  value.execution.manual = {
    'TC-1': manualExecution('Pass'),
    'TC-2': manualExecution('Fail'),
    'TC-3': manualExecution('Blocked', 'Missing safe data'),
  };
  value.execution.automation = {
    'TC-1': implementation('playwright/tests/tickets/PAC9-101-TC-1.spec.ts'),
    'TC-3': implementation(null, 'Missing safe data'),
  };
  const result = transitionPhase(value, 'AUTOMATION_EXECUTE', now);
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.reason, /TC-2.*spec/i);
});

test('requires diagnostic spec or blocker for intermittent Inconclusive', () => {
  const value = readyAt('AUTOMATE');
  const unstable = manualExecution('Inconclusive');
  unstable.attempts = [
    { id: 'attempt-1', result: 'Fail', data_variant: 'initial', evidence: ['evidence/1.png'] },
    { id: 'attempt-2', result: 'Pass', data_variant: 'fresh_session', evidence: ['evidence/2.png'] },
  ];
  value.execution.manual['TC-4'] = unstable;
  value.execution.automation['TC-4'] = implementation(null);
  assert.equal(transitionPhase(value, 'AUTOMATION_EXECUTE', now).ok, false);
  value.execution.automation['TC-4'] = implementation('playwright/tests/tickets/PAC9-101-TC-4.spec.ts', null, 1, true);
  assert.equal(transitionPhase(value, 'AUTOMATION_EXECUTE', now).ok, true);
});

test('allows Blocked and Not Run without specs only with reasons', () => {
  const value = readyAt('AUTOMATE');
  value.execution.manual['TC-1'] = manualExecution('Blocked', 'Missing safe data');
  value.execution.manual['TC-2'] = manualExecution('Not Run', 'Out of scope');
  value.execution.automation['TC-1'] = implementation(null, 'Missing safe data');
  value.execution.automation['TC-2'] = implementation(null, 'Out of scope');
  assert.equal(transitionPhase(value, 'AUTOMATION_EXECUTE', now).ok, true);
});

test('rejects stale automation revision', () => {
  const value = readyAt('AUTOMATE');
  value.execution.manual['TC-1'] = manualExecution('Pass');
  value.execution.automation['TC-1'] = implementation('playwright/tests/tickets/PAC9-101-TC-1.spec.ts', null, 0);
  assert.equal(transitionPhase(value, 'AUTOMATION_EXECUTE', now).ok, false);
});

test('blocks REPORT until every implemented spec has a CLI result or technical blocker', () => {
  const value = readyAt('AUTOMATION_EXECUTE');
  value.execution.manual['TC-1'] = manualExecution('Fail');
  value.execution.automation['TC-1'] = implementation('playwright/tests/tickets/PAC9-101-TC-1.spec.ts');
  assert.equal(transitionPhase(value, 'REPORT', now).ok, false);
  value.execution.runs['TC-1'] = { result: 'Blocked', verification: 'Setup or authentication failure', evidence: ['Auth expired before CLI run'], product_result_changed: false };
  assert.equal(transitionPhase(value, 'REPORT', now).ok, true);
});

test('keeps manual Fail when CLI fails the expected product assertion', () => {
  const value = readyAt('AUTOMATION_EXECUTE');
  value.execution.manual['TC-1'] = manualExecution('Fail');
  value.execution.automation['TC-1'] = implementation('playwright/tests/tickets/PAC9-101-TC-1.spec.ts');
  value.execution.runs['TC-1'] = { result: 'Fail', verification: 'Matched product result', evidence: ['trace.zip'], product_result_changed: false };
  assert.equal(transitionPhase(value, 'REPORT', now).ok, true);
  assert.equal(value.execution.manual['TC-1'].result, 'Fail');
  assert.equal(value.execution.runs['TC-1'].product_result_changed, false);
});

test('accepts automation and setup failures without changing product result', () => {
  for (const verification of ['Automation defect', 'Setup or authentication failure'] as const) {
    const value = readyAt('AUTOMATION_EXECUTE');
    value.execution.manual['TC-1'] = manualExecution('Pass');
    value.execution.automation['TC-1'] = implementation('playwright/tests/tickets/PAC9-101-TC-1.spec.ts');
    value.execution.runs['TC-1'] = { result: 'Blocked', verification, evidence: ['trace.zip'], product_result_changed: false };
    assert.equal(transitionPhase(value, 'REPORT', now).ok, true);
    assert.equal(value.execution.manual['TC-1'].result, 'Pass');
  }
});

test('applies Playwright child outcome without changing workflow state', () => {
  const value = manifest();
  const child = {
    schema_version: 1, skill: 'paco-playwright', phase: 'MANUAL_EXECUTE', ticket: { key: ticket.key, folder_name: ticket.folder_name }, input_revision: 1,
    outcome: 'completed', artifacts: [], summary: { message: 'Manual', counts: { cases: 1 } },
    mutation: { class: 'None', occurred: false, cleanup: 'not_applicable', leftover_identifiers: [] },
    sensitive_data: { detected: false, redacted: false, details: [] }, blockers: [], warnings: [], recommended_next_phase: 'AUTOMATE',
    playwright_cases: [{ case_id: 'TC-1', manual: manualExecution('Pass') }],
  } satisfies ChildSkillOutcome;
  const applied = applyPlaywrightOutcome(value, child);
  assert.equal(applied.execution.manual['TC-1'].result, 'Pass');
  assert.equal(applied.workflow.current_phase, value.workflow.current_phase);
});

test('saves atomically and skips unchanged content', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'paco-manifest-'));
  const file = path.join(root, 'manifest.yaml');
  assert.equal(await saveManifest(file, manifest()), 'written');
  assert.equal(await saveManifest(file, manifest()), 'unchanged');
  assert.equal((await loadManifest(file)).ticket.key, 'PAC9-101');
  assert.match(await readFile(file, 'utf8'), /schema_version: 2/);
});
