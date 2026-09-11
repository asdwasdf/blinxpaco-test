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
    run_id: 'PAC2-5776-TC-004-guided-2026-09-10',
    environment: 'dev',
    ticket_key: 'PAC2-5776',
    case_id: 'PAC2-5776-TC-004',
    action: 'Insert one Booking Link and one Health Form into one Quick Send draft',
    test_data_fingerprint: 'patient=katie sparrow;slot=Virtual Mental Health;form=sleep ap',
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
  assert.match(source, /afterBookingLink/);
  assert.match(source, /afterHealthForm/);
  assert.equal((source.match(/page\.screenshot\s*\(/g) ?? []).length, 2);
});
