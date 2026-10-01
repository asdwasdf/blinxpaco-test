import assert from 'node:assert/strict';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { validateChildOutcome, verifyChildArtifacts, type ChildSkillOutcome } from '../child-outcome.js';
import { calculateChecksum } from '../checksum-utils.js';
import type { ManualAttempt, ManualCaseExecution } from '../workflow-types.js';

const expected = { skill: 'paco-requirements' as const, phase: 'ANALYZE' as const, ticket_key: 'PAC9-101', folder_name: 'PAC9-101-test', input_revision: 1 };
function outcome(artifactPath = 'docs/tickets/PAC9-101-test/requirements.md'): ChildSkillOutcome {
  return { schema_version: 1, skill: 'paco-requirements', phase: 'ANALYZE', ticket: { key: 'PAC9-101', folder_name: 'PAC9-101-test' }, input_revision: 1, outcome: 'completed', artifacts: [{ path: artifactPath, action: 'created', sha256: calculateChecksum('artifact') }], summary: { message: 'Synthetic', counts: { requirements: 1 } }, mutation: { class: 'None', occurred: false, cleanup: 'not_applicable', leftover_identifiers: [] }, sensitive_data: { detected: false, redacted: false, details: [] }, blockers: [], warnings: [], recommended_next_phase: 'TEST_DESIGN' };
}

test('validates expected child context', () => {
  assert.equal(validateChildOutcome(outcome(), expected).ok, true);
  assert.equal(validateChildOutcome({ ...outcome(), input_revision: 2 }, expected).ok, false);
  assert.equal(validateChildOutcome({ ...outcome(), sensitive_data: { detected: true, redacted: false, details: [] } }, expected).ok, false);
});

test('requires safe location metadata for LOCATE', () => {
  const locate = { ...outcome('docs/tickets/PAC9-101-test/feature-location.md'), skill: 'paco-explore' as const, phase: 'LOCATE' as const, location: { mode: 'locate' as const, route_status: 'Confirmed' as const, budget: { views_used: 3, views_limit: 12, elapsed_minutes: 4, minutes_limit: 15 }, next_action: 'Run EXPLORE' } };
  const context = { ...expected, skill: 'paco-explore' as const, phase: 'LOCATE' as const };
  assert.equal(validateChildOutcome(locate, context).ok, true);
  const { location: _location, ...missing } = locate;
  assert.equal(validateChildOutcome(missing, context).ok, false);
  assert.equal(validateChildOutcome({ ...locate, mutation: { ...locate.mutation, occurred: true } }, context).ok, false);
  assert.equal(validateChildOutcome({ ...locate, phase: 'EXPLORE', location: locate.location }, { ...context, phase: 'EXPLORE' }).ok, false);
});

function attempt(data_variant: ManualAttempt['data_variant'], result: ManualAttempt['result'] = 'Fail'): ManualAttempt {
  return { id: `attempt-${data_variant}`, result, data_variant, evidence: [`evidence/${data_variant}.png`] };
}

function manual(result: ManualCaseExecution['result']): ManualCaseExecution {
  return {
    result,
    expected_basis: result === 'Fail' ? 'Confirmed' : 'Observed',
    attempts: [attempt('initial', result)],
    control_path_checked: false,
    route: '/feature',
    locators: ['button:Save'],
    skip_or_block_reason: null,
  };
}

function playwrightOutcome(phase: 'MANUAL_EXECUTE' | 'AUTOMATE' | 'AUTOMATION_EXECUTE', playwright_cases: NonNullable<ChildSkillOutcome['playwright_cases']>): ChildSkillOutcome {
  return {
    ...outcome('docs/tickets/PAC9-101-test/automation.md'),
    skill: 'paco-playwright',
    phase,
    playwright_cases,
    recommended_next_phase: phase === 'MANUAL_EXECUTE' ? 'AUTOMATE' : phase === 'AUTOMATE' ? 'AUTOMATION_EXECUTE' : 'REPORT',
  };
}

function playwrightExpected(phase: 'MANUAL_EXECUTE' | 'AUTOMATE' | 'AUTOMATION_EXECUTE') {
  return { ...expected, skill: 'paco-playwright' as const, phase };
}

test('rejects an unverified manual Fail', () => {
  const failed = manual('Fail');
  failed.attempts = [attempt('initial'), attempt('same')];
  const result = validateChildOutcome(playwrightOutcome('MANUAL_EXECUTE', [{ case_id: 'TC-1', manual: failed }]), playwrightExpected('MANUAL_EXECUTE'));
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.issues.join(' '), /three diagnostic attempts.*control path/i);
});

test('accepts verified Fail and unstable Inconclusive', () => {
  const failed = manual('Fail');
  failed.attempts = [attempt('same'), attempt('clean'), attempt('fresh_session'), attempt('control')];
  failed.control_path_checked = true;
  const intermittent = manual('Inconclusive');
  intermittent.attempts = [attempt('initial', 'Fail'), attempt('fresh_session', 'Pass')];
  assert.equal(validateChildOutcome(playwrightOutcome('MANUAL_EXECUTE', [{ case_id: 'TC-1', manual: failed }]), playwrightExpected('MANUAL_EXECUTE')).ok, true);
  assert.equal(validateChildOutcome(playwrightOutcome('MANUAL_EXECUTE', [{ case_id: 'TC-2', manual: intermittent }]), playwrightExpected('MANUAL_EXECUTE')).ok, true);
});

test('rejects manual result inconsistent with attempt outcomes', () => {
  const failed = manual('Fail');
  failed.attempts = [attempt('same', 'Pass'), attempt('clean', 'Pass'), attempt('fresh_session', 'Pass'), attempt('control', 'Pass')];
  failed.control_path_checked = true;
  const passed = manual('Pass');
  passed.attempts = [attempt('initial', 'Pass'), attempt('fresh_session', 'Fail')];
  for (const execution of [failed, passed]) {
    const result = validateChildOutcome(playwrightOutcome('MANUAL_EXECUTE', [{ case_id: 'TC-1', manual: execution }]), playwrightExpected('MANUAL_EXECUTE'));
    assert.equal(result.ok, false);
    if (!result.ok) assert.match(result.issues.join(' '), /inconsistent|Inconclusive/i);
  }
});

test('rejects malformed playwright payload values', () => {
  const malformedManual = { ...manual('Pass'), result: 'Maybe', attempts: [{ ...attempt('initial', 'Pass'), evidence: 'not-an-array' }] };
  const malformedAutomation = { spec_path: 42, diagnostic: 'no', reason: null, input_revision: 1 };
  const malformedRun = { result: 'Pass', verification: 'Made up', evidence: [], product_result_changed: true };
  assert.equal(validateChildOutcome(playwrightOutcome('MANUAL_EXECUTE', [{ case_id: 'TC-1', manual: malformedManual as never }]), playwrightExpected('MANUAL_EXECUTE')).ok, false);
  assert.equal(validateChildOutcome(playwrightOutcome('AUTOMATE', [{ case_id: 'TC-1', automation: malformedAutomation as never }]), playwrightExpected('AUTOMATE')).ok, false);
  assert.equal(validateChildOutcome(playwrightOutcome('AUTOMATION_EXECUTE', [{ case_id: 'TC-1', run: malformedRun as never }]), playwrightExpected('AUTOMATION_EXECUTE')).ok, false);
});

test('requires reasons for manual Blocked and Not Run results', () => {
  for (const result of ['Blocked', 'Not Run'] as const) {
    const execution = manual(result);
    execution.attempts = [];
    assert.equal(validateChildOutcome(playwrightOutcome('MANUAL_EXECUTE', [{ case_id: 'TC-1', manual: execution }]), playwrightExpected('MANUAL_EXECUTE')).ok, false);
    execution.skip_or_block_reason = 'Missing safe data';
    assert.equal(validateChildOutcome(playwrightOutcome('MANUAL_EXECUTE', [{ case_id: 'TC-1', manual: execution }]), playwrightExpected('MANUAL_EXECUTE')).ok, true);
  }
});

test('rejects duplicate case ids and phase-mismatched payloads', () => {
  const item = { case_id: 'TC-1', manual: manual('Pass') };
  assert.equal(validateChildOutcome(playwrightOutcome('MANUAL_EXECUTE', [item, item]), playwrightExpected('MANUAL_EXECUTE')).ok, false);
  assert.equal(validateChildOutcome(playwrightOutcome('AUTOMATE', [item]), playwrightExpected('AUTOMATE')).ok, false);
});

test('verifies Playwright specs outside docs with case mapping and checksum', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'paco-child-'));
  const specPath = 'playwright/tests/tickets/PAC9-101-TC-1.spec.ts';
  await mkdir(path.dirname(path.join(root, specPath)), { recursive: true });
  await writeFile(path.join(root, specPath), 'artifact');
  const child = playwrightOutcome('AUTOMATE', [{ case_id: 'PAC9-101-TC-1', automation: { spec_path: specPath, diagnostic: false, reason: null, input_revision: 1 } }]);
  child.artifacts = [{ path: specPath, action: 'created', sha256: calculateChecksum('artifact') }];
  assert.equal((await verifyChildArtifacts(child, root, 'docs/tickets')).ok, true);
  child.artifacts = [];
  assert.equal((await verifyChildArtifacts(child, root, 'docs/tickets')).ok, false);
  child.artifacts = [{ path: specPath, action: 'created', sha256: calculateChecksum('artifact') }];
  child.playwright_cases![0].case_id = 'PAC9-101-TC-2';
  assert.equal((await verifyChildArtifacts(child, root, 'docs/tickets')).ok, false);
  child.playwright_cases![0].case_id = 'PAC9-101-TC-1';
  child.artifacts[0].sha256 = calculateChecksum('wrong');
  assert.equal((await verifyChildArtifacts(child, root, 'docs/tickets')).ok, false);
});

test('verifies confined owned artifact and checksum', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'paco-child-'));
  const relative = 'docs/tickets/PAC9-101-test/requirements.md';
  await mkdir(path.dirname(path.join(root, relative)), { recursive: true });
  await writeFile(path.join(root, relative), 'artifact');
  assert.equal((await verifyChildArtifacts(outcome(), root, 'docs/tickets')).ok, true);
  const locationPath = 'docs/tickets/PAC9-101-test/feature-location.md';
  await writeFile(path.join(root, locationPath), 'artifact');
  const locate = { ...outcome(locationPath), skill: 'paco-explore' as const, phase: 'LOCATE' as const, location: { mode: 'locate' as const, route_status: 'Confirmed' as const, budget: { views_used: 3, views_limit: 12, elapsed_minutes: 4, minutes_limit: 15 }, next_action: 'Run EXPLORE' } };
  assert.equal((await verifyChildArtifacts(locate, root, 'docs/tickets')).ok, true);
  assert.equal((await verifyChildArtifacts({ ...locate, phase: 'EXPLORE' }, root, 'docs/tickets')).ok, false);
  assert.equal((await verifyChildArtifacts(outcome('../escape.md'), root, 'docs/tickets')).ok, false);
  assert.equal((await verifyChildArtifacts(outcome('docs/tickets/PAC9-101-test/report.md'), root, 'docs/tickets')).ok, false);
  await writeFile(path.join(root, relative), 'changed');
  assert.equal((await verifyChildArtifacts(outcome(), root, 'docs/tickets')).ok, false);
});
