import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { calculateFileChecksum, reconcileRevision, snapshotFiles } from '../checksum-utils.js';
import { validateChildOutcome, verifyChildArtifacts, type ChildSkillOutcome } from '../child-outcome.js';
import { createManifest, planResume, propagateStale, saveManifest } from '../manifest-utils.js';
import { evaluateMutationGate } from '../mutation-gate.js';
import { saveManagedMarkdown } from '../protected-markdown.js';
import { renderStatus } from '../status-utils.js';
import { discoverTicket } from '../ticket-utils.js';

const now = '2026-09-10T00:00:00.000Z';
const pattern = /^[A-Z][A-Z0-9]*-[0-9]+-[a-z0-9]+(?:-[a-z0-9]+)*$/;

test('runs state mechanics without Paco access or source mutation', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'paco-synthetic-'));
  const sourceDirectory = path.join(root, 'ticket', 'PAC9-201-synthetic-flow');
  await mkdir(sourceDirectory, { recursive: true });
  await writeFile(path.join(sourceDirectory, 'ticket.md'), '# Synthetic only\n');
  const before = await calculateFileChecksum(path.join(sourceDirectory, 'ticket.md'));

  const discovery = await discoverTicket({ selection: 'PAC9-201-synthetic-flow', projectRoot: root, sourceRoot: 'ticket', outputRoot: 'docs/tickets', folderPattern: pattern, primarySourceFile: 'ticket.md' });
  assert.equal(discovery.ok, true);
  if (!discovery.ok) return;
  const files = await snapshotFiles(sourceDirectory, discovery.ticket.sources);
  const revision1 = reconcileRevision(null, files, now);
  const manifest = createManifest({ key: discovery.ticket.key, folder_name: discovery.ticket.folder_name, source_directory: discovery.ticket.source_directory, primary_source: discovery.ticket.primary_source }, revision1.snapshot, now);
  manifest.phases.DISCOVER.status = 'completed';
  manifest.phases.INGEST.status = 'completed';
  manifest.phases.ANALYZE.status = 'completed';

  const outputDirectory = path.join(root, discovery.ticket.output_directory);
  const requirementPath = path.join(outputDirectory, 'requirements.md');
  await saveManagedMarkdown(requirementPath, '# Requirements: PAC9-201\n\nSynthetic requirement.');
  const requirementChecksum = await calculateFileChecksum(requirementPath);
  const child: ChildSkillOutcome = { schema_version: 1, skill: 'paco-requirements', phase: 'ANALYZE', ticket: { key: discovery.ticket.key, folder_name: discovery.ticket.folder_name }, input_revision: 1, outcome: 'completed', artifacts: [{ path: path.relative(root, requirementPath), action: 'created', sha256: requirementChecksum }], summary: { message: 'Synthetic', counts: { requirements: 1 } }, mutation: { class: 'None', occurred: false, cleanup: 'not_applicable', leftover_identifiers: [] }, sensitive_data: { detected: false, redacted: false, details: [] }, blockers: [], warnings: [], recommended_next_phase: 'TEST_DESIGN' };
  assert.equal(validateChildOutcome(child, { skill: child.skill, phase: child.phase, ticket_key: child.ticket.key, folder_name: child.ticket.folder_name, input_revision: 1 }).ok, true);
  assert.equal((await verifyChildArtifacts(child, root, 'docs/tickets')).ok, true);
  manifest.outputs['requirements.md'] = { owner: 'paco-requirements', path: path.relative(root, requirementPath), state: 'valid', input_revision: 1, sha256: requirementChecksum };
  manifest.workflow.current_phase = 'TEST_DESIGN';
  manifest.workflow.last_completed_phase = 'ANALYZE';
  assert.equal((await saveManifest(path.join(outputDirectory, 'manifest.yaml'), manifest)), 'written');
  await saveManagedMarkdown(path.join(outputDirectory, 'status.md'), renderStatus(manifest, 'Chạy `TEST_DESIGN`.'));
  assert.equal(planResume(manifest).ok, true);
  assert.equal((await saveManifest(path.join(outputDirectory, 'manifest.yaml'), manifest)), 'unchanged');

  const statusPath = path.join(outputDirectory, 'status.md');
  await writeFile(statusPath, (await readFile(statusPath, 'utf8')).replace('## Tester notes\n', '## Tester notes\n\nGiữ nguyên ghi chú.\n'));
  await saveManagedMarkdown(statusPath, renderStatus(manifest, 'Chạy `TEST_DESIGN`.'));
  assert.match(await readFile(statusPath, 'utf8'), /Giữ nguyên ghi chú\./);

  await writeFile(path.join(sourceDirectory, 'ticket.md'), '# Changed synthetic only\n');
  const revision2 = reconcileRevision(revision1.snapshot, await snapshotFiles(sourceDirectory, discovery.ticket.sources), '2026-09-11T00:00:00.000Z');
  const stale = propagateStale(manifest, revision2.delta, revision2.snapshot, '2026-09-11T00:00:00.000Z');
  assert.equal(stale.outputs['requirements.md'].state, 'stale');
  assert.equal(evaluateMutationGate({ run_id: 'run', environment: 'dev', ticket_key: 'PAC9-201', case_id: 'TC-1', action: 'Update', test_data_fingerprint: 'x', mutation_class: 'Persistent' }, null, {}, now).allowed, false);
  assert.notEqual(await calculateFileChecksum(path.join(sourceDirectory, 'ticket.md')), before);
  assert.equal((await readFile(requirementPath, 'utf8')).includes('Synthetic requirement.'), true);
});
