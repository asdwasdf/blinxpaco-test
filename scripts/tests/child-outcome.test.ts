import assert from 'node:assert/strict';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { validateChildOutcome, verifyChildArtifacts, type ChildSkillOutcome } from '../child-outcome.js';
import { calculateChecksum } from '../checksum-utils.js';

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
