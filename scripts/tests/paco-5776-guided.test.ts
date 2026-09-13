import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  classifySchedulerPopup,
  classifySchedulerPopupStages,
  parseGuidedApproval,
  PAC2_5776_TC_004_SCOPE,
} from '../../playwright/support/paco-5776-guided.js';

test('uses the approved PAC2-5776 guided-run scope', () => {
  assert.deepEqual(PAC2_5776_TC_004_SCOPE, {
    run_id: 'PAC2-5776-TC-004-guided-2026-09-12-06',
    environment: 'dev',
    ticket_key: 'PAC2-5776',
    case_id: 'PAC2-5776-TC-004',
    action: 'Select General Patient Message, insert one Booking Link and one Health Form into one Quick Send draft',
    test_data_fingerprint: 'patient=katie sparrow;nhs=222 222 9537;template=General Patient Message;slot=Adult Phlebotomy paco-connect;form=Sleep Ap',
    mutation_class: 'Unknown',
  });
});

test('requires an ephemeral exact approval from the environment', () => {
  assert.throws(() => parseGuidedApproval(undefined), /PACO_MUTATION_APPROVAL_JSON/);
  assert.equal(
    parseGuidedApproval(JSON.stringify({ approved: true, scope: PAC2_5776_TC_004_SCOPE })).approved,
    true,
  );
});

test('classifies only the observed popup state', () => {
  assert.equal(classifySchedulerPopup(true), 'Observed: Scheduler Link Required popup reproduced');
  assert.equal(classifySchedulerPopup(false), 'Pass for this run: popup not observed');
});

test('passes only when initial scheduler popup is handled and health form does not reopen it', () => {
  assert.equal(
    classifySchedulerPopupStages({ afterBookingLink: true, afterHealthForm: false }),
    'Pass for this run: scheduler popup handled after Booking Link and did not reopen after Health Form',
  );
  assert.equal(
    classifySchedulerPopupStages({ afterBookingLink: true, afterHealthForm: true }),
    'Observed: scheduler popup reopened after Health Form',
  );
  assert.equal(
    classifySchedulerPopupStages({ afterBookingLink: false, afterHealthForm: false }),
    'Inconclusive: scheduler popup was not observed after Booking Link',
  );
});

test('supports slowing every browser action for evidence recording', () => {
  const source = readFileSync(new URL('../../playwright.config.ts', import.meta.url), 'utf8');
  const env = readFileSync(new URL('../../.env', import.meta.url), 'utf8');

  assert.match(source, /loadEnvFile\(\)/);
  assert.match(source, /slowMo: Number\(process\.env\.PACO_SLOW_MO_MS \?\? 0\)/);
  assert.match(env, /^PACO_SLOW_MO_MS=500$/m);
  assert.doesNotMatch(env, /PACO_ALLOW_MUTATION|PACO_MUTATION_APPROVAL_JSON/);
});

test('automates the approved two-stage flow without manual checkpoints', () => {
  const source = readFileSync(
    new URL('../../playwright/tests/tickets/PAC2-5776-TC-004.guided.spec.ts', import.meta.url),
    'utf8',
  );

  assert.doesNotMatch(source, /checkpoint\s*\(|\.first\s*\(/);
  assert.match(source, /classifySchedulerPopupStages/);
  assert.match(source, /evaluateMutationGate/);
  assert.match(source, /addInitScript/);
  assert.match(source, /stopImmediatePropagation/);
  assert.match(source, /expect\(locator\)\.toHaveCount\(1\)/);
  assert.match(source, /Search patients by name or NHS number/);
  assert.match(source, /\.fill\('katie sparrow'\)/);
  assert.match(source, /NHS No: 222 222 9537/);
  assert.match(source, /getByText\('General Patient Message', \{ exact: true \}\)/);
  assert.match(source, /getByText\('\(click to change\)', \{ exact: true \}\)/);
  assert.match(source, /getByText\('Choose template', \{ exact: true \}\)/);
  assert.match(source, /name: 'tab-Booking Link', exact: true/);
  assert.match(source, /getAttribute\('class'\)/);
  assert.match(source, /Booking Link is disabled because no campaign\/template is selected/);
  assert.match(source, /data-pc-name="multiselect"/);
  assert.match(source, /picker\.getByRole\('option', \{\s*name: 'Adult Phlebotomy paco-connect',\s*exact: true,?\s*\}\)/);
  assert.doesNotMatch(source, /slotOptions\.includes/);
  assert.doesNotMatch(source, /getByRole\('checkbox', \{ name: 'Adult Phlebotomy paco-connect'/);
  assert.match(source, /expect\(dialog\)\.toContainText\('\{\{\{scheduler_link\}\}\}'\)/);
  assert.doesNotMatch(source, /getByText\('\{\{\{scheduler_link\}\}\}', \{ exact: true \}\)/);
  assert.match(source, /name: 'tab-Health Forms', exact: true/);
  assert.match(source, /getByText\('Add Health Form\(s\)', \{ exact: true \}\)/);
  assert.match(source, /name: 'Search\.\.\.', exact: true/);
  assert.match(source, /\.fill\('sleep ap'\)/);
  assert.match(source, /getByText\('Sleep Ap', \{ exact: true \}\)/);
  assert.doesNotMatch(source, /getByRole\('checkbox', \{ name: 'sleep ap'/);
  assert.match(source, /getByText\('Added Health Forms:', \{ exact: true \}\)/);
  assert.match(source, /dialog\.getByRole\('button', \{ name: 'Sleep Ap', exact: true \}\)/);
  assert.doesNotMatch(source, /Add at End button for Health Form/);
  assert.match(source, /ancestor::div\[contains\(@class, "_patient-row_"\)\]\[1\]/);
  assert.match(source, /afterBookingLink/);
  assert.match(source, /afterHealthForm/);
  assert.match(source, /const evidenceRunId = new Date\(\)\.toISOString\(\)\.replace\(\/\[:\.\]\/g, '-'\)/);
  assert.match(source, /const evidenceDir = join\('test-results', 'PAC2-5776-TC-004', evidenceRunId\)/);
  assert.match(source, /mkdirSync\(evidenceDir, \{ recursive: true \}\)/);
  assert.match(source, /path: join\(evidenceDir, 'after-booking-link\.png'\)/);
  assert.match(source, /path: join\(evidenceDir, 'after-health-form\.png'\)/);
  assert.doesNotMatch(source, /PAC2-5776-TC-004-after-(booking-link|health-form)\.png/);
  assert.equal((source.match(/page\.screenshot\s*\(/g) ?? []).length, 2);
});
