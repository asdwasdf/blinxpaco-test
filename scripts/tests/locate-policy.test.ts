import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  DEFAULT_LOCATE_BUDGET,
  evaluateLocateAction,
  evaluateLocateProgress,
  evaluateUiLocationGate,
  filterLocateCandidates,
  locationNeedsReview,
  toSafeFeatureMapEntry,
  validateLocateInputs,
  validateReusableRoute,
} from '../locate-policy.js';

test('requires environment, role, authentication, and read-only mode', () => {
  assert.deepEqual(validateLocateInputs({ role: 'Tester', authenticated: true, read_only: true }), { allowed: false, blocker: 'Missing environment', next_action: 'Provide environment' });
  assert.deepEqual(validateLocateInputs({ environment: 'dev', authenticated: true, read_only: true }), { allowed: false, blocker: 'Missing role', next_action: 'Provide role' });
  assert.match(JSON.stringify(validateLocateInputs({ environment: 'dev', role: 'Tester', authenticated: false, read_only: true })), /Authentication expired/);
  assert.equal(validateLocateInputs({ environment: 'dev', role: 'Tester', authenticated: true, read_only: false }).allowed, false);
  assert.equal(validateLocateInputs({ environment: 'dev', role: 'Tester', authenticated: true, read_only: true }).allowed, true);
});

test('allows only known read-only actions', () => {
  for (const action of ['navigate', 'view', 'search', 'filter', 'sort', 'paginate', 'open_read_only'] as const) assert.equal(evaluateLocateAction(action).allowed, true);
  assert.equal(evaluateLocateAction('mutation').allowed, false);
  assert.equal(evaluateLocateAction('unknown').allowed, false);
});

test('stops at first budget ceiling or verified route', () => {
  const base = { views_used: 1, views_limit: DEFAULT_LOCATE_BUDGET.views_limit, started_at_ms: 0, now_ms: 60_000, minutes_limit: DEFAULT_LOCATE_BUDGET.minutes_limit, route_verified: false };
  assert.equal(evaluateLocateProgress(base).continue, true);
  assert.equal(evaluateLocateProgress({ ...base, views_used: 12 }).reason, 'view_budget');
  assert.equal(evaluateLocateProgress({ ...base, now_ms: 15 * 60_000 }).reason, 'time_budget');
  assert.equal(evaluateLocateProgress({ ...base, route_verified: true }).reason, 'route_verified');
});

test('validates reusable route in one to three meaningful views', () => {
  assert.equal(validateReusableRoute({ views_used: 1, landmark_matched: true, entry_opened: true }).valid, true);
  assert.equal(validateReusableRoute({ views_used: 3, landmark_matched: true, entry_opened: true }).valid, true);
  assert.equal(validateReusableRoute({ views_used: 4, landmark_matched: true, entry_opened: true }).valid, false);
  assert.equal(validateReusableRoute({ views_used: 2, landmark_matched: false, entry_opened: true }).valid, false);
});

test('does not repeat rejected route while dependency is unchanged', () => {
  const candidates = ['global navigation', 'patient menu'];
  assert.deepEqual(filterLocateCandidates(candidates, [{ path: 'global navigation', dependency_revision: 1 }], 1), ['patient menu']);
  assert.deepEqual(filterLocateCandidates(candidates, [{ path: 'global navigation', dependency_revision: 1 }], 2), candidates);
});

test('distinguishes location changes from expected behavior only', () => {
  assert.equal(locationNeedsReview(['feature_alias']), true);
  assert.equal(locationNeedsReview(['actor_context', 'role_permission']), true);
  assert.equal(locationNeedsReview(['expected_behavior_only']), false);
});

test('gates UI-dependent design and automation on confirmed location context', () => {
  const complete = { ui_dependent: true, location_state: 'valid' as const, route_status: 'Confirmed' as const, has_entry_path: true, has_context: true, has_role: true, has_test_data_category: true };
  assert.equal(evaluateUiLocationGate(complete).allowed, true);
  assert.equal(evaluateUiLocationGate({ ...complete, location_state: 'stale' }).allowed, false);
  assert.equal(evaluateUiLocationGate({ ...complete, route_status: 'Candidate' }).allowed, false);
  assert.equal(evaluateUiLocationGate({ ...complete, has_context: false }).allowed, false);
  assert.equal(evaluateUiLocationGate({ ...complete, ui_dependent: false }).allowed, true);
});

test('promotes only allowlisted route fields as Observed', () => {
  const entry = toSafeFeatureMapEntry({ feature: 'Quick Send', entry: ['Dashboard', 'Quick Send'], role_observed: 'Tester', environment: 'dev', source_ticket: 'PAC9-101', last_verified: '2026-09-13', aliases: ['Quicksend'], patient_identifier: 'secret', test_data: 'record', locator: '.generated' });
  assert.equal(entry.classification, 'Observed');
  assert.equal('patient_identifier' in entry, false);
  assert.equal('test_data' in entry, false);
  assert.equal('locator' in entry, false);
});
