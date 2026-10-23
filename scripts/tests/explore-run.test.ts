import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parse } from 'yaml';
import { applyTick, newRunId, runCli, type ActiveRun } from '../explore-run.js';

const baseRun = (): ActiveRun => ({
  run_id: 'auto-x', started_at: '2026-10-23T00:00:00.000Z', stage: 'running',
  budget: { max_features: 3, max_minutes: 60, max_meaningful_states: 80 },
  used: { features: 0, minutes: 0, meaningful_states: 0 },
  locked_role: 'Super Admin GB', last_tick_at: '2026-10-23T00:00:00.000Z',
});

test('applyTick counts short gaps fully and caps idle gaps', () => {
  const run = baseRun();
  applyTick(run, new Date('2026-10-23T00:04:00.000Z'));
  assert.equal(run.used.minutes, 4);
  const res = applyTick(run, new Date('2026-10-23T01:04:00.000Z')); // 60 phút pause/compaction
  assert.equal(run.used.minutes, 14);
  assert.equal(res.stop, false);
});

test('applyTick stops on budget and on role drift', () => {
  const run = baseRun();
  run.used.minutes = 58;
  assert.equal(applyTick(run, new Date('2026-10-23T00:03:00.000Z')).stop_reason, 'budget_minutes');
  const drift = baseRun();
  assert.equal(applyTick(drift, new Date('2026-10-23T00:01:00.000Z'), { observedRole: 'Config Admin' }).stop_reason, 'role_drift');
  const same = baseRun();
  assert.equal(applyTick(same, new Date('2026-10-23T00:01:00.000Z'), { observedRole: ' Super Admin GB ' }).stop, false);
});

test('newRunId uses UTC auto-YYYYMMDD-HHmm', () => {
  assert.equal(newRunId(new Date('2026-10-23T02:23:41.509Z')), 'auto-20261023-0223');
});

test('runCli start/checkpoint/close keeps state and partial outcome in sync', () => {
  const dir = mkdtempSync(join(tmpdir(), 'pacoexplore-'));
  const statePath = join(dir, 'state.yaml');
  writeFileSync(statePath, '# header comment\nroles:\n  Super Admin GB:\n    active_run:\n      run_id: null\n      stage: done\n      budget: {max_features: 6, max_minutes: 120, max_meaningful_states: 80}\n      used: {features: 0, minutes: 0, meaningful_states: 0}\n');
  const cwd = process.cwd();
  process.chdir(dir);
  try {
    const start = runCli(['start', '--role', 'Super Admin GB', '--max-minutes', '60'], statePath, new Date('2026-10-23T03:00:00.000Z'));
    assert.equal(start.ok, true);
    assert.equal(start.run_id, 'auto-20261023-0300');
    assert.equal(runCli(['start', '--role', 'Super Admin GB'], statePath).ok, false);

    runCli(['tick', '--states', '5', '--feature-done'], statePath, new Date('2026-10-23T03:07:00.000Z'));
    runCli(['checkpoint', '--feature', 'Patient Search', '--summary', 'Create verified'], statePath);
    const outcomePath = join(dir, 'test-results/product-explore/auto-20261023-0300/outcome.json');
    const outcome = JSON.parse(readFileSync(outcomePath, 'utf8'));
    assert.equal(outcome.features[0].feature, 'Patient Search');
    assert.equal(outcome.used.minutes, 7);

    const closed = runCli(['close', '--reason', 'budget_minutes'], statePath, new Date('2026-10-23T03:09:00.000Z'));
    assert.equal(closed.stage, 'done');
    const text = readFileSync(statePath, 'utf8');
    assert.match(text, /^# header comment/);
    const run = parse(text).roles['Super Admin GB'].active_run;
    assert.equal(run.used.minutes, 9);
    assert.equal(run.locked_role, 'Super Admin GB');
    assert.equal(JSON.parse(readFileSync(outcomePath, 'utf8')).stop_reason, 'budget_minutes');
  } finally { process.chdir(cwd); }
});
