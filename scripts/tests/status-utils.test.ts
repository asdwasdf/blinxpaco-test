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
  manifest.outputs['requirements.md'] = { owner: 'paco-requirements', path: 'docs/tickets/PAC9-101-test/requirements.md', state: 'stale', input_revision: 1, sha256: null };
  manifest.workflow.checkpoints.push({ at: now, phase: 'DISCOVER', outcome: 'completed', input_revision: 2, message: 'Selected' });
  const output = renderStatus(manifest, 'Chạy `INGEST`.');
  assert.equal((output.match(/^\| (?:DISCOVER|INGEST|ANALYZE|EXPLORE|TEST_DESIGN|AUTOMATION_REVIEW|AUTOMATE|EXECUTE|REPORT|COMPLETE) /gm) ?? []).length, 10);
  assert.match(output, /requirements\.md: stale/);
  assert.match(output, /Chạy `INGEST`\./);
  assert.match(output, /2026-09-10T00:00:00.000Z \| revision 2 \| DISCOVER/);
});
