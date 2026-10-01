import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';
import { calculateFileChecksum, type InputSnapshot, type SnapshotDelta } from './checksum-utils.js';
import type { ChildSkillOutcome } from './child-outcome.js';
import { locationNeedsReview, type LocationChange } from './locate-policy.js';
import { PHASES, type ArtifactState, type ExecutionState, type Phase, type PhaseStatus, type SkillOutcomeCode } from './workflow-types.js';

export interface ManifestTicket { key: string; folder_name: string; source_directory: string; primary_source: string }
export interface LocationBudgetRecord { views_used: number; views_limit: number; elapsed_minutes: number; minutes_limit: number }
export interface PhaseRecord { status: PhaseStatus; outcome: SkillOutcomeCode | null; input_revision: number; updated_at: string; artifacts: string[]; budget?: LocationBudgetRecord; warnings: string[]; blockers: string[] }
export type ArtifactOwner = 'paco-ticket' | 'paco-requirements' | 'paco-explore' | 'paco-test-design' | 'paco-playwright' | 'paco-report';
export interface OutputRecord { owner: ArtifactOwner; path: string; state: ArtifactState; input_revision: number; sha256: string | null }
export interface CheckpointRecord { at: string; phase: Phase; outcome: SkillOutcomeCode; input_revision: number; message: string }
export interface WorkflowStatus { status: 'pending' | 'in_progress' | 'blocked' | 'failed' | 'complete'; current_phase: Phase; last_completed_phase: Phase | null; updated_at: string; checkpoints: CheckpointRecord[] }
export interface Manifest { schema_version: 2; ticket: ManifestTicket; input_snapshot: InputSnapshot; workflow: WorkflowStatus; phases: Record<Phase, PhaseRecord>; outputs: Record<string, OutputRecord>; execution: ExecutionState }

const transitions: Record<Phase, readonly Phase[]> = {
  DISCOVER: ['INGEST'], INGEST: ['ANALYZE'], ANALYZE: ['LOCATE'], LOCATE: ['EXPLORE', 'TEST_DESIGN'],
  EXPLORE: ['TEST_DESIGN'], TEST_DESIGN: ['MANUAL_EXECUTE'], MANUAL_EXECUTE: ['AUTOMATE'],
  AUTOMATE: ['AUTOMATION_EXECUTE'], AUTOMATION_EXECUTE: ['REPORT'], REPORT: ['COMPLETE'], COMPLETE: [],
};
const requiredOutput: Partial<Record<Phase, string>> = {
  ANALYZE: 'requirements.md', LOCATE: 'feature-location.md', EXPLORE: 'exploration.md', TEST_DESIGN: 'test-cases.md',
  MANUAL_EXECUTE: 'automation.md', AUTOMATE: 'automation.md', AUTOMATION_EXECUTE: 'automation.md', REPORT: 'report.md',
};

function emptyPhase(revision: number, now: string): PhaseRecord {
  return { status: 'pending', outcome: null, input_revision: revision, updated_at: now, artifacts: [], warnings: [], blockers: [] };
}

export function createManifest(
  ticket: ManifestTicket,
  snapshot: InputSnapshot = { revision: 1, generated_at: new Date().toISOString(), files: [] },
  now = new Date().toISOString(),
): Manifest {
  const phases = Object.fromEntries(PHASES.map((phase) => [phase, emptyPhase(snapshot.revision, now)])) as Record<Phase, PhaseRecord>;
  return { schema_version: 2, ticket, input_snapshot: snapshot, workflow: { status: 'pending', current_phase: 'DISCOVER', last_completed_phase: null, updated_at: now, checkpoints: [] }, phases, outputs: {}, execution: { case_ids: [], manual: {}, automation: {}, runs: {} } };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function validateManifest(value: unknown): { ok: true; value: Manifest } | { ok: false; issues: string[] } {
  const issues: string[] = [];
  if (!isRecord(value)) return { ok: false, issues: ['manifest must be an object'] };
  if (value.schema_version !== 2) issues.push('schema_version must be 2');
  for (const field of ['ticket', 'input_snapshot', 'workflow', 'phases', 'outputs', 'execution']) if (!isRecord(value[field])) issues.push(`${field} must be an object`);
  const workflow = isRecord(value.workflow) ? value.workflow : {};
  if (!PHASES.includes(workflow.current_phase as Phase)) issues.push('workflow.current_phase is invalid');
  const phases = isRecord(value.phases) ? value.phases : {};
  for (const phase of PHASES) {
    const entry = phases[phase];
    if (!isRecord(entry)) { issues.push(`phases.${phase} must be an object`); continue; }
    if (!['pending', 'in_progress', 'completed', 'blocked', 'stale', 'skipped', 'failed'].includes(String(entry.status))) issues.push(`phases.${phase}.status is invalid`);
    if (entry.outcome !== null && !['completed', 'completed_with_warnings', 'blocked', 'failed', 'inconclusive', 'no_change'].includes(String(entry.outcome))) issues.push(`phases.${phase}.outcome is invalid`);
    if (entry.budget !== undefined) {
      if (phase !== 'LOCATE' || !isRecord(entry.budget)) issues.push(`phases.${phase}.budget is invalid`);
      else {
        for (const field of ['views_used', 'elapsed_minutes']) if (typeof entry.budget[field] !== 'number' || Number(entry.budget[field]) < 0) issues.push(`phases.${phase}.budget.${field} must be non-negative`);
        for (const field of ['views_limit', 'minutes_limit']) if (typeof entry.budget[field] !== 'number' || Number(entry.budget[field]) <= 0) issues.push(`phases.${phase}.budget.${field} must be positive`);
      }
    }
  }
  const snapshot = isRecord(value.input_snapshot) ? value.input_snapshot : {};
  if (!Number.isInteger(snapshot.revision) || Number(snapshot.revision) < 1) issues.push('input_snapshot.revision must be a positive integer');
  if (!Array.isArray(snapshot.files)) issues.push('input_snapshot.files must be an array');
  const execution = isRecord(value.execution) ? value.execution : {};
  if (!Array.isArray(execution.case_ids) || execution.case_ids.some((caseId) => typeof caseId !== 'string' || !caseId.trim()) || new Set(execution.case_ids).size !== execution.case_ids.length) issues.push('execution.case_ids must contain unique case ids');
  for (const field of ['manual', 'automation', 'runs']) if (!isRecord(execution[field])) issues.push(`execution.${field} must be an object`);
  const manual = isRecord(execution.manual) ? execution.manual : {};
  for (const [caseId, item] of Object.entries(manual)) {
    if (!isRecord(item) || !['Pass', 'Fail', 'Blocked', 'Not Run', 'Inconclusive'].includes(String(item.result)) ||
        !['Confirmed', 'Observed', 'Inferred', 'Open Question'].includes(String(item.expected_basis)) || !Array.isArray(item.attempts) ||
        typeof item.control_path_checked !== 'boolean' || typeof item.route !== 'string' || !Array.isArray(item.locators) ||
        (item.skip_or_block_reason !== null && typeof item.skip_or_block_reason !== 'string')) issues.push(`execution.manual.${caseId} is invalid`);
  }
  const automation = isRecord(execution.automation) ? execution.automation : {};
  for (const [caseId, item] of Object.entries(automation)) {
    if (!isRecord(item) || (item.spec_path !== null && (typeof item.spec_path !== 'string' || !item.spec_path.endsWith('.spec.ts'))) ||
        typeof item.diagnostic !== 'boolean' || (item.reason !== null && typeof item.reason !== 'string') || !Number.isInteger(item.input_revision) || Number(item.input_revision) < 1) issues.push(`execution.automation.${caseId} is invalid`);
  }
  const runs = isRecord(execution.runs) ? execution.runs : {};
  for (const [caseId, item] of Object.entries(runs)) {
    if (!isRecord(item) || !['Pass', 'Fail', 'Blocked', 'Not Run', 'Inconclusive'].includes(String(item.result)) ||
        !['Matched product result', 'Product behavior mismatch', 'Automation defect', 'Setup or authentication failure', 'Inconclusive'].includes(String(item.verification)) ||
        !Array.isArray(item.evidence) || item.product_result_changed !== false) issues.push(`execution.runs.${caseId} is invalid`);
  }
  return issues.length ? { ok: false, issues } : { ok: true, value: value as unknown as Manifest };
}

function invalidDependency(manifest: Manifest): string | null {
  for (const [name, output] of Object.entries(manifest.outputs)) if (output.state !== 'valid') return `${name} is ${output.state}`;
  return null;
}

export function validateExecutionGate(manifest: Manifest, next: Phase): string[] {
  const issues: string[] = [];
  if (next === 'AUTOMATE') {
    if (!manifest.execution.case_ids.length) issues.push('designed case inventory is required');
    for (const caseId of manifest.execution.case_ids) if (!manifest.execution.manual[caseId]) issues.push(`${caseId}: manual result is required`);
    for (const caseId of Object.keys(manifest.execution.manual)) if (!manifest.execution.case_ids.includes(caseId)) issues.push(`${caseId}: manual result is not in designed case inventory`);
  }
  if (next === 'AUTOMATION_EXECUTE') {
    for (const [caseId, manual] of Object.entries(manifest.execution.manual)) {
      const automated = manifest.execution.automation[caseId];
      if (manual.result === 'Pass' || manual.result === 'Fail') {
        if (!automated?.spec_path) issues.push(`${caseId}: .spec.ts is required for ${manual.result}`);
      } else if (manual.result === 'Inconclusive') {
        if (!automated?.spec_path && !automated?.reason?.trim()) issues.push(`${caseId}: diagnostic spec or blocker is required for Inconclusive`);
        if (automated?.spec_path && !automated.diagnostic) issues.push(`${caseId}: Inconclusive spec must be diagnostic`);
      } else if (!automated?.spec_path && !automated?.reason?.trim()) {
        issues.push(`${caseId}: ${manual.result} without spec requires a reason`);
      }
      if (automated && automated.input_revision !== manifest.input_snapshot.revision) issues.push(`${caseId}: automation revision is stale`);
    }
  }
  if (next === 'REPORT') {
    for (const [caseId, automated] of Object.entries(manifest.execution.automation)) {
      if (!automated.spec_path) continue;
      const run = manifest.execution.runs[caseId];
      if (!run) issues.push(`${caseId}: CLI result is required`);
      else if (run.product_result_changed !== false) issues.push(`${caseId}: automation cannot change product result`);
    }
  }
  return issues;
}

export function applyPlaywrightOutcome(manifest: Manifest, outcome: ChildSkillOutcome): Manifest {
  const result = structuredClone(manifest);
  for (const item of outcome.playwright_cases ?? []) {
    if (outcome.phase === 'MANUAL_EXECUTE' && item.manual) result.execution.manual[item.case_id] = item.manual;
    else if (outcome.phase === 'AUTOMATE' && item.automation) result.execution.automation[item.case_id] = item.automation;
    else if (outcome.phase === 'AUTOMATION_EXECUTE' && item.run) result.execution.runs[item.case_id] = item.run;
  }
  return result;
}

export function transitionPhase(manifest: Manifest, next: Phase, now: string): { ok: true; manifest: Manifest } | { ok: false; reason: string } {
  const current = manifest.workflow.current_phase;
  if (!transitions[current].includes(next)) return { ok: false, reason: `Invalid transition: ${current} to ${next}` };
  if (current === 'LOCATE' && next === 'TEST_DESIGN' && (manifest.phases.LOCATE.status !== 'skipped' || manifest.phases.LOCATE.warnings.length === 0)) return { ok: false, reason: 'Cannot skip LOCATE without a specific reason' };
  if (next === 'MANUAL_EXECUTE' || next === 'AUTOMATION_EXECUTE') {
    const invalid = invalidDependency(manifest);
    if (invalid) return { ok: false, reason: `Cannot execute: ${invalid}` };
  }
  const executionIssues = validateExecutionGate(manifest, next);
  if (executionIssues.length) return { ok: false, reason: executionIssues.join('; ') };
  const expected = requiredOutput[current];
  if (expected && manifest.phases[current].status === 'completed') {
    const output = manifest.outputs[expected];
    if (!output || output.state !== 'valid') return { ok: false, reason: `Cannot leave ${current}: ${expected} is not valid` };
  }
  const result = structuredClone(manifest);
  result.workflow.current_phase = next;
  result.workflow.status = next === 'COMPLETE' ? 'complete' : 'in_progress';
  result.workflow.updated_at = now;
  result.phases[next].status = next === 'COMPLETE' ? 'completed' : 'in_progress';
  result.phases[next].updated_at = now;
  return { ok: true, manifest: result };
}

function setOutputState(manifest: Manifest, name: string, state: ArtifactState): void {
  if (manifest.outputs[name]) manifest.outputs[name].state = state;
}

export function markFeatureLocationStale(manifest: Manifest, changes: readonly LocationChange[], now: string): Manifest {
  if (!locationNeedsReview(changes)) return manifest;
  const result = structuredClone(manifest);
  setOutputState(result, 'feature-location.md', 'stale');
  result.phases.LOCATE.status = 'stale';
  result.phases.LOCATE.updated_at = now;
  result.workflow.updated_at = now;
  return result;
}

export function propagateStale(manifest: Manifest, delta: SnapshotDelta, nextSnapshot: InputSnapshot, now: string): Manifest {
  if (!delta.changed) return manifest;
  const result = structuredClone(manifest);
  result.input_snapshot = nextSnapshot;
  result.workflow.updated_at = now;
  if (delta.primary_source_changed) {
    for (const name of ['requirements.md', 'test-cases.md', 'report.md']) setOutputState(result, name, 'stale');
    setOutputState(result, 'automation.md', 'review_required');
    for (const phase of ['ANALYZE', 'TEST_DESIGN', 'REPORT'] as const) result.phases[phase].status = 'stale';
    if (result.outputs['automation.md']) {
      result.phases.MANUAL_EXECUTE.status = 'stale';
      result.phases.AUTOMATE.status = 'stale';
      result.phases.AUTOMATION_EXECUTE.status = 'stale';
    }
  } else {
    for (const output of Object.values(result.outputs)) if (output.state === 'valid') output.state = 'needs_review';
  }
  return result;
}

function confined(root: string, candidate: string): boolean {
  const relative = path.relative(root, candidate);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

export async function reconcileArtifacts(manifest: Manifest, projectRoot: string): Promise<{ manifest: Manifest; discrepancies: string[] }> {
  const result = structuredClone(manifest);
  const discrepancies: string[] = [];
  const root = path.resolve(projectRoot);
  for (const [name, output] of Object.entries(result.outputs)) {
    const fullPath = path.resolve(root, output.path);
    if (!confined(root, fullPath) || /^ticket(?:[\\/]|$)/.test(output.path)) { output.state = 'corrupt'; discrepancies.push(`${name}: invalid output path`); continue; }
    try {
      const stat = await fs.lstat(fullPath);
      if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('not a regular file');
      if (output.sha256 && (await calculateFileChecksum(fullPath)) !== output.sha256) { output.state = 'corrupt'; discrepancies.push(`${name}: checksum mismatch`); }
    } catch { output.state = 'missing'; discrepancies.push(`${name}: missing`); }
  }
  return { manifest: result, discrepancies };
}

export function planResume(manifest: Manifest, requestedPhase?: Phase): { ok: true; phase: Phase; reason: string } | { ok: false; reason: string } {
  if (requestedPhase) {
    const index = PHASES.indexOf(requestedPhase);
    if (index < 0) return { ok: false, reason: 'Requested phase is invalid' };
    const blocking = PHASES.slice(0, index).find((phase) => !['completed', 'skipped'].includes(manifest.phases[phase].status));
    if (blocking) return { ok: false, reason: `${blocking} is not complete` };
    if (requestedPhase === 'MANUAL_EXECUTE' || requestedPhase === 'AUTOMATION_EXECUTE') { const invalid = invalidDependency(manifest); if (invalid) return { ok: false, reason: `Cannot execute: ${invalid}` }; }
    const executionIssues = validateExecutionGate(manifest, requestedPhase);
    if (executionIssues.length) return { ok: false, reason: executionIssues.join('; ') };
    return { ok: true, phase: requestedPhase, reason: 'Requested phase dependencies are valid' };
  }
  const phase = PHASES.find((candidate) => !['completed', 'skipped'].includes(manifest.phases[candidate].status)) ?? 'COMPLETE';
  return { ok: true, phase, reason: `First incomplete phase: ${phase}` };
}

export function reconcileManifest(value: unknown, now: string): unknown {
  if (!isRecord(value) || value.schema_version !== 1 || !isRecord(value.phases) || !isRecord(value.workflow) || !isRecord(value.input_snapshot)) return value;
  const result = structuredClone(value);
  if (!isRecord(result.phases) || !isRecord(result.workflow) || !isRecord(result.input_snapshot)) return value;
  const oldPhases = result.phases;
  const current = String(result.workflow.current_phase ?? 'DISCOVER');
  const legacyOrder = ['DISCOVER', 'INGEST', 'ANALYZE', 'LOCATE', 'EXPLORE', 'TEST_DESIGN', 'AUTOMATION_REVIEW', 'AUTOMATE', 'EXECUTE', 'REPORT', 'COMPLETE'];
  const revision = Number(result.input_snapshot.revision) || 1;
  if (!isRecord(oldPhases.LOCATE)) {
    const passedLocate = legacyOrder.indexOf(current) > legacyOrder.indexOf('LOCATE');
    oldPhases.LOCATE = passedLocate
      ? { ...emptyPhase(revision, now), status: 'skipped', outcome: 'no_change', warnings: ['Legacy v1 reconciliation: LOCATE was not recorded'] }
      : emptyPhase(revision, now);
  }
  const migrated = Object.fromEntries(PHASES.map((phase) => [phase, isRecord(oldPhases[phase]) ? oldPhases[phase] : emptyPhase(revision, now)])) as Record<Phase, PhaseRecord>;
  if (legacyOrder.indexOf(current) >= legacyOrder.indexOf('AUTOMATION_REVIEW')) {
    migrated.MANUAL_EXECUTE = { ...emptyPhase(revision, now), warnings: ['Legacy v1 workflow requires manual execution reconciliation'] };
    result.workflow.current_phase = 'MANUAL_EXECUTE';
    result.workflow.status = 'in_progress';
  }
  result.schema_version = 2;
  result.phases = migrated;
  result.execution = { case_ids: [], manual: {}, automation: {}, runs: {} };
  return result;
}

/** @deprecated Use reconcileManifest. */
export const reconcileManifestV1 = reconcileManifest;

export async function loadManifest(filePath: string, now = new Date().toISOString()): Promise<Manifest> {
  const parsed: unknown = reconcileManifest(YAML.parse(await fs.readFile(filePath, 'utf8')), now);
  const validation = validateManifest(parsed);
  if (!validation.ok) throw new Error(`Invalid manifest: ${validation.issues.join('; ')}`);
  return validation.value;
}

export async function saveManifest(filePath: string, manifest: Manifest): Promise<'written' | 'unchanged'> {
  const validation = validateManifest(manifest);
  if (!validation.ok) throw new Error(`Invalid manifest: ${validation.issues.join('; ')}`);
  const yaml = YAML.stringify(manifest);
  try { if ((await fs.readFile(filePath, 'utf8')) === yaml) return 'unchanged'; }
  catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.${crypto.randomUUID()}.tmp`;
  try { await fs.writeFile(temporary, yaml, { encoding: 'utf8', flag: 'wx' }); await fs.rename(temporary, filePath); }
  catch (error) { await fs.rm(temporary, { force: true }); throw error; }
  // ponytail: single orchestrator owns writes; add locking if concurrent writers are introduced.
  return 'written';
}
