import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { calculateFileChecksum, reconcileRevision, snapshotFiles } from '../checksum-utils.js';
import { validateChildOutcome, verifyChildArtifacts, type ChildSkillOutcome } from '../child-outcome.js';
import { createManifest, planResume, saveManifest } from '../manifest-utils.js';
import { evaluateUiLocationGate } from '../locate-policy.js';
import { evaluateMutationGate } from '../mutation-gate.js';
import { saveManagedMarkdown } from '../protected-markdown.js';
import { renderStatus } from '../status-utils.js';
import { discoverTicket } from '../ticket-utils.js';

const now = '2026-09-10T00:00:00.000Z';
const pattern = /^[A-Z][A-Z0-9]*-[0-9]+-[a-z0-9]+(?:-[a-z0-9]+)*$/;

const workflowTemplatePath = path.resolve('docs/templates/workflow.md');

test('keeps survey workflow observational and bounded', async () => {
  const template = await readFile(workflowTemplatePath, 'utf8');
  for (const required of [
    'Classification: `[Observed:',
    'Starting data state:',
    '## Read-only flow',
    '## Safety boundary',
    'Approval stop:',
    'Mutation: `None`',
    '## Execution guidance',
    '## Automation guidance',
    'Assertions lacking trusted expected basis:',
    '## Tester notes',
  ]) assert.match(template, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.doesNotMatch(template, /Classification:\s*`\[Confirmed\]/);

  const standard = await readFile(path.resolve('docs/standards/knowledge-classification.md'), 'utf8');
  assert.match(standard, /không được tạo ticket requirement hoặc expected result/);
});

test('runs LOCATE state mechanics without Paco access or source mutation', async () => {
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
  const child: ChildSkillOutcome = { schema_version: 1, skill: 'paco-requirements', phase: 'ANALYZE', ticket: { key: discovery.ticket.key, folder_name: discovery.ticket.folder_name }, input_revision: 1, outcome: 'completed', artifacts: [{ path: path.relative(root, requirementPath), action: 'created', sha256: requirementChecksum }], summary: { message: 'Synthetic', counts: { requirements: 1 } }, mutation: { class: 'None', occurred: false, cleanup: 'not_applicable', leftover_identifiers: [] }, sensitive_data: { detected: false, redacted: false, details: [] }, blockers: [], warnings: [], recommended_next_phase: 'LOCATE' };
  assert.equal(validateChildOutcome(child, { skill: child.skill, phase: child.phase, ticket_key: child.ticket.key, folder_name: child.ticket.folder_name, input_revision: 1 }).ok, true);
  assert.equal((await verifyChildArtifacts(child, root, 'docs/tickets')).ok, true);
  manifest.outputs['requirements.md'] = { owner: 'paco-requirements', path: path.relative(root, requirementPath), state: 'valid', input_revision: 1, sha256: requirementChecksum };

  const locationPath = path.join(outputDirectory, 'feature-location.md');
  await saveManagedMarkdown(locationPath, '# Feature Location: PAC9-201\n\n**Status:** Confirmed\n\n## Confirmed entry path\n\nDashboard to synthetic feature.');
  const locationChecksum = await calculateFileChecksum(locationPath);
  const locate: ChildSkillOutcome = { ...child, skill: 'paco-explore', phase: 'LOCATE', artifacts: [{ path: path.relative(root, locationPath), action: 'created', sha256: locationChecksum }], summary: { message: 'Synthetic route verified', counts: { meaningful_views: 3 } }, location: { mode: 'locate', route_status: 'Confirmed', budget: { views_used: 3, views_limit: 12, elapsed_minutes: 4, minutes_limit: 15 }, next_action: 'Run EXPLORE' }, recommended_next_phase: 'EXPLORE' };
  assert.equal(validateChildOutcome(locate, { skill: locate.skill, phase: locate.phase, ticket_key: locate.ticket.key, folder_name: locate.ticket.folder_name, input_revision: 1 }).ok, true);
  assert.equal((await verifyChildArtifacts(locate, root, 'docs/tickets')).ok, true);
  manifest.outputs['feature-location.md'] = { owner: 'paco-explore', path: path.relative(root, locationPath), state: 'valid', input_revision: 1, sha256: locationChecksum };
  manifest.phases.LOCATE = { status: 'completed', outcome: 'completed', input_revision: 1, updated_at: now, artifacts: [path.relative(root, locationPath)], budget: locate.location!.budget, warnings: [], blockers: [] };
  manifest.workflow.current_phase = 'EXPLORE';
  manifest.workflow.last_completed_phase = 'LOCATE';

  assert.equal(evaluateUiLocationGate({ ui_dependent: true, location_state: 'valid', route_status: 'Confirmed', has_entry_path: true, has_context: true, has_role: true, has_test_data_category: true }).allowed, true);
  assert.equal((await saveManifest(path.join(outputDirectory, 'manifest.yaml'), manifest)), 'written');
  await saveManagedMarkdown(path.join(outputDirectory, 'status.md'), renderStatus(manifest, 'Chạy `EXPLORE`.'));
  const resume = planResume(manifest);
  assert.equal(resume.ok, true);
  if (resume.ok) assert.equal(resume.phase, 'EXPLORE');
  assert.equal((await saveManifest(path.join(outputDirectory, 'manifest.yaml'), manifest)), 'unchanged');

  const statusPath = path.join(outputDirectory, 'status.md');
  await writeFile(statusPath, (await readFile(statusPath, 'utf8')).replace('## Tester notes\n', '## Tester notes\n\nGiữ nguyên ghi chú.\n'));
  await saveManagedMarkdown(statusPath, renderStatus(manifest, 'Chạy `EXPLORE`.'));
  assert.match(await readFile(statusPath, 'utf8'), /Giữ nguyên ghi chú\./);
  assert.equal(evaluateMutationGate({ run_id: 'run', environment: 'dev', ticket_key: 'PAC9-201', case_id: 'TC-1', action: 'Update', test_data_fingerprint: 'x', mutation_class: 'Persistent' }, null, {}, now).allowed, false);
  assert.equal(await calculateFileChecksum(path.join(sourceDirectory, 'ticket.md')), before);
});
