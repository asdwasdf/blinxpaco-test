import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createManifest } from '../manifest-utils.js';
import { renderStatus } from '../status-utils.js';

const now = '2026-09-10T00:00:00.000Z';

test('renders complete status projection', () => {
  const manifest = createManifest(
    { key: 'PAC9-101', folder_name: 'PAC9-101-test', source_directory: 'ticket/PAC9-101-test', primary_source: 'ticket.md' },
    { revision: 2, generated_at: now, files: [] },
    now,
  );
  manifest.phases.DISCOVER.status = 'completed';
  manifest.phases.INGEST.warnings.push('Synthetic warning');
  manifest.phases.LOCATE.budget = { views_used: 4, views_limit: 12, elapsed_minutes: 6, minutes_limit: 15 };
  manifest.phases.LOCATE.warnings.push('Context: patient record; Candidate: none');
  manifest.outputs['requirements.md'] = { owner: 'paco-requirements', path: 'docs/tickets/PAC9-101-test/requirements.md', state: 'stale', input_revision: 1, sha256: null };
  manifest.execution.manual = {
    'TC-1': { result: 'Pass', expected_basis: 'Observed', attempts: [{ id: '1', result: 'Pass', data_variant: 'initial', evidence: ['e1'] }], control_path_checked: false, route: '/a', locators: [], skip_or_block_reason: null },
    'TC-2': { result: 'Fail', expected_basis: 'Confirmed', attempts: [], control_path_checked: true, route: '/b', locators: [], skip_or_block_reason: null },
    'TC-3': { result: 'Inconclusive', expected_basis: 'Observed', attempts: [], control_path_checked: false, route: '/c', locators: [], skip_or_block_reason: null },
    'TC-4': { result: 'Blocked', expected_basis: 'Open Question', attempts: [], control_path_checked: false, route: '/d', locators: [], skip_or_block_reason: 'No data' },
  };
  manifest.execution.automation = {
    'TC-1': { spec_path: 'playwright/tests/tickets/tc-1.spec.ts', diagnostic: false, reason: null, input_revision: 2 },
    'TC-2': { spec_path: 'playwright/tests/tickets/tc-2.spec.ts', diagnostic: false, reason: null, input_revision: 2 },
    'TC-3': { spec_path: 'playwright/tests/tickets/tc-3.spec.ts', diagnostic: true, reason: null, input_revision: 2 },
    'TC-4': { spec_path: null, diagnostic: false, reason: 'No data', input_revision: 2 },
  };
  manifest.execution.runs = {
    'TC-1': { result: 'Pass', verification: 'Matched product result', evidence: [], product_result_changed: false },
    'TC-2': { result: 'Fail', verification: 'Matched product result', evidence: [], product_result_changed: false },
  };
  manifest.workflow.checkpoints.push({ at: now, phase: 'DISCOVER', outcome: 'completed', input_revision: 2, message: 'Selected' });
  const output = renderStatus(manifest, 'Chạy `AUTOMATION_EXECUTE`.');
  assert.equal((output.match(/^\| (?:DISCOVER|INGEST|ANALYZE|LOCATE|EXPLORE|TEST_DESIGN|MANUAL_EXECUTE|AUTOMATE|AUTOMATION_EXECUTE|REPORT|COMPLETE) /gm) ?? []).length, 11);
  assert.match(output, /Manual results: Pass 1, Fail 1, Inconclusive 1/);
  assert.match(output, /Automation: Implemented 3, Executed 2, Blocked 1/);
  assert.match(output, /## Feature Location/);
  assert.match(output, /4\/12 views; 6\/15 minutes/);
  assert.match(output, /Context: patient record; Candidate: none/);
  assert.match(output, /requirements\.md: stale/);
  assert.match(output, /Chạy `AUTOMATION_EXECUTE`\./);
  assert.match(output, /2026-09-10T00:00:00.000Z \| revision 2 \| DISCOVER/);
});
