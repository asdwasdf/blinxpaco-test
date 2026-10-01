import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { calculateFileChecksum, reconcileRevision, snapshotFiles } from '../checksum-utils.js';
import { validateChildOutcome, verifyChildArtifacts, type ChildSkillOutcome } from '../child-outcome.js';
import { applyPlaywrightOutcome, createManifest, planResume, saveManifest, transitionPhase } from '../manifest-utils.js';
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

  manifest.phases.EXPLORE.status = 'completed';
  manifest.phases.TEST_DESIGN.status = 'completed';
  manifest.workflow.current_phase = 'TEST_DESIGN';
  const testCasesPath = path.join(outputDirectory, 'test-cases.md');
  await saveManagedMarkdown(testCasesPath, '# Test Cases\n\nSynthetic cases.');
  manifest.outputs['test-cases.md'] = { owner: 'paco-test-design', path: path.relative(root, testCasesPath), state: 'valid', input_revision: 1, sha256: await calculateFileChecksum(testCasesPath) };
  const manualTransition = transitionPhase(manifest, 'MANUAL_EXECUTE', now);
  assert.equal(manualTransition.ok, true);
  if (!manualTransition.ok) return;
  let executionManifest = manualTransition.manifest;
  executionManifest.execution.case_ids = ['TC-PASS', 'TC-FAIL', 'TC-BLOCKED', 'TC-FLAKY'];
  executionManifest.phases.MANUAL_EXECUTE.status = 'completed';

  const passAttempt = { id: 'pass-1', result: 'Pass' as const, data_variant: 'initial' as const, evidence: ['evidence/pass.png'] };
  const failedAttempts = [
    { id: 'fail-same', result: 'Fail' as const, data_variant: 'same' as const, evidence: ['evidence/fail-same.png'] },
    { id: 'fail-clean', result: 'Fail' as const, data_variant: 'clean' as const, evidence: ['evidence/fail-clean.png'] },
    { id: 'fail-fresh', result: 'Fail' as const, data_variant: 'fresh_session' as const, evidence: ['evidence/fail-fresh.png'] },
    { id: 'fail-control', result: 'Pass' as const, data_variant: 'control' as const, evidence: ['evidence/control.png'] },
  ];
  const manualOutcome: ChildSkillOutcome = {
    ...child, skill: 'paco-playwright', phase: 'MANUAL_EXECUTE', artifacts: [], recommended_next_phase: 'AUTOMATE',
    playwright_cases: [
      { case_id: 'TC-PASS', manual: { result: 'Pass', expected_basis: 'Observed', attempts: [passAttempt], control_path_checked: false, route: '/feature', locators: ['button:Save'], skip_or_block_reason: null } },
      { case_id: 'TC-FAIL', manual: { result: 'Fail', expected_basis: 'Confirmed', attempts: failedAttempts, control_path_checked: true, route: '/feature', locators: ['button:Save'], skip_or_block_reason: null } },
      { case_id: 'TC-BLOCKED', manual: { result: 'Blocked', expected_basis: 'Open Question', attempts: [], control_path_checked: false, route: '/feature', locators: [], skip_or_block_reason: 'Missing safe data' } },
      { case_id: 'TC-FLAKY', manual: { result: 'Inconclusive', expected_basis: 'Observed', attempts: [passAttempt, { ...passAttempt, id: 'flaky-2', result: 'Fail' }], control_path_checked: false, route: '/feature', locators: ['button:Save'], skip_or_block_reason: null } },
    ],
  };
  assert.equal(validateChildOutcome(manualOutcome, { skill: 'paco-playwright', phase: 'MANUAL_EXECUTE', ticket_key: child.ticket.key, folder_name: child.ticket.folder_name, input_revision: 1 }).ok, true);
  executionManifest = applyPlaywrightOutcome(executionManifest, manualOutcome);
  const automationPath = path.join(outputDirectory, 'automation.md');
  await saveManagedMarkdown(automationPath, '# Automation\n\nSynthetic mapping.');
  executionManifest.outputs['automation.md'] = { owner: 'paco-playwright', path: path.relative(root, automationPath), state: 'valid', input_revision: 1, sha256: await calculateFileChecksum(automationPath) };
  const automateTransition = transitionPhase(executionManifest, 'AUTOMATE', now);
  assert.equal(automateTransition.ok, true);
  if (!automateTransition.ok) return;
  executionManifest = automateTransition.manifest;
  executionManifest.phases.AUTOMATE.status = 'completed';


  const specPaths = ['TC-PASS', 'TC-FAIL', 'TC-FLAKY'].map((id) => path.join(outputDirectory, 'playwright', `${id}.spec.ts`));
  for (const specPath of specPaths) {
    await mkdir(path.dirname(specPath), { recursive: true });
    await writeFile(specPath, `// standalone synthetic ${path.basename(specPath)}\n`);
  }
  const automateOutcome: ChildSkillOutcome = {
    ...manualOutcome, phase: 'AUTOMATE', recommended_next_phase: 'AUTOMATION_EXECUTE',
    playwright_cases: [
      { case_id: 'TC-PASS', automation: { spec_path: path.relative(root, specPaths[0]), diagnostic: false, reason: null, input_revision: 1 } },
      { case_id: 'TC-FAIL', automation: { spec_path: path.relative(root, specPaths[1]), diagnostic: false, reason: null, input_revision: 1 } },
      { case_id: 'TC-BLOCKED', automation: { spec_path: null, diagnostic: false, reason: 'Missing safe data', input_revision: 1 } },
      { case_id: 'TC-FLAKY', automation: { spec_path: path.relative(root, specPaths[2]), diagnostic: true, reason: null, input_revision: 1 } },
    ],
  };
  executionManifest = applyPlaywrightOutcome(executionManifest, automateOutcome);
  const cliTransition = transitionPhase(executionManifest, 'AUTOMATION_EXECUTE', now);
  assert.equal(cliTransition.ok, true);
  if (!cliTransition.ok) return;
  executionManifest = cliTransition.manifest;
  executionManifest.phases.AUTOMATION_EXECUTE.status = 'completed';
  const cliOutcome: ChildSkillOutcome = {
    ...manualOutcome, phase: 'AUTOMATION_EXECUTE', recommended_next_phase: 'REPORT',
    playwright_cases: [
      { case_id: 'TC-PASS', run: { result: 'Pass', verification: 'Matched product result', evidence: ['trace-pass.zip'], product_result_changed: false } },
      { case_id: 'TC-FAIL', run: { result: 'Fail', verification: 'Matched product result', evidence: ['trace-fail.zip'], product_result_changed: false } },
      { case_id: 'TC-FLAKY', run: { result: 'Inconclusive', verification: 'Inconclusive', evidence: ['trace-flaky.zip'], product_result_changed: false } },
    ],
  };
  executionManifest = applyPlaywrightOutcome(executionManifest, cliOutcome);
  assert.equal(transitionPhase(executionManifest, 'REPORT', now).ok, true);
  assert.equal(executionManifest.execution.manual['TC-FAIL'].result, 'Fail');
  assert.equal(executionManifest.execution.runs['TC-FAIL'].verification, 'Matched product result');

  assert.equal((await saveManifest(path.join(outputDirectory, 'manifest.yaml'), executionManifest)), 'written');
  await saveManagedMarkdown(path.join(outputDirectory, 'status.md'), renderStatus(executionManifest, 'Chạy `REPORT`.'));
  const resume = planResume(executionManifest);
  assert.equal(resume.ok, true);
  if (resume.ok) assert.equal(resume.phase, 'REPORT');
  assert.equal((await saveManifest(path.join(outputDirectory, 'manifest.yaml'), executionManifest)), 'unchanged');

  const statusPath = path.join(outputDirectory, 'status.md');
  await writeFile(statusPath, (await readFile(statusPath, 'utf8')).replace('## Tester notes\n', '## Tester notes\n\nGiữ nguyên ghi chú.\n'));
  await saveManagedMarkdown(statusPath, renderStatus(manifest, 'Chạy `EXPLORE`.'));
  assert.match(await readFile(statusPath, 'utf8'), /Giữ nguyên ghi chú\./);
  assert.equal(evaluateMutationGate({ run_id: 'run', environment: 'dev', ticket_key: 'PAC9-201', case_id: 'TC-1', action: 'Update', test_data_fingerprint: 'x', mutation_class: 'Persistent' }, null, {}, now).allowed, false);
  assert.equal(await calculateFileChecksum(path.join(sourceDirectory, 'ticket.md')), before);
});
