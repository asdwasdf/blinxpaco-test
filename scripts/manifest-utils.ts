import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';
import { calculateFileChecksum, type InputSnapshot, type SnapshotDelta } from './checksum-utils.js';
import { PHASES, type ArtifactState, type Phase, type PhaseStatus, type SkillOutcomeCode } from './workflow-types.js';

export interface ManifestTicket { key: string; folder_name: string; source_directory: string; primary_source: string }
export interface PhaseRecord { status: PhaseStatus; outcome: SkillOutcomeCode | null; input_revision: number; updated_at: string; artifacts: string[]; warnings: string[]; blockers: string[] }
export type ArtifactOwner = 'paco-ticket' | 'paco-requirements' | 'paco-explore' | 'paco-test-design' | 'paco-playwright' | 'paco-report';
export interface OutputRecord { owner: ArtifactOwner; path: string; state: ArtifactState; input_revision: number; sha256: string | null }
export interface CheckpointRecord { at: string; phase: Phase; outcome: SkillOutcomeCode; input_revision: number; message: string }
export interface WorkflowStatus { status: 'pending' | 'in_progress' | 'blocked' | 'failed' | 'complete'; current_phase: Phase; last_completed_phase: Phase | null; updated_at: string; checkpoints: CheckpointRecord[] }
export interface Manifest { schema_version: 1; ticket: ManifestTicket; input_snapshot: InputSnapshot; workflow: WorkflowStatus; phases: Record<Phase, PhaseRecord>; outputs: Record<string, OutputRecord> }

const transitions: Record<Phase, readonly Phase[]> = {
  DISCOVER: ['INGEST'], INGEST: ['ANALYZE'], ANALYZE: ['EXPLORE', 'TEST_DESIGN'],
  EXPLORE: ['TEST_DESIGN'], TEST_DESIGN: ['AUTOMATION_REVIEW', 'REPORT'],
  AUTOMATION_REVIEW: ['AUTOMATE', 'REPORT'], AUTOMATE: ['EXECUTE'], EXECUTE: ['REPORT'],
  REPORT: ['COMPLETE'], COMPLETE: [],
};
const requiredOutput: Partial<Record<Phase, string>> = {
  ANALYZE: 'requirements.md', EXPLORE: 'exploration.md', TEST_DESIGN: 'test-cases.md',
  AUTOMATION_REVIEW: 'automation.md', AUTOMATE: 'automation.md', REPORT: 'report.md',
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
  return { schema_version: 1, ticket, input_snapshot: snapshot, workflow: { status: 'pending', current_phase: 'DISCOVER', last_completed_phase: null, updated_at: now, checkpoints: [] }, phases, outputs: {} };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function validateManifest(value: unknown): { ok: true; value: Manifest } | { ok: false; issues: string[] } {
  const issues: string[] = [];
  if (!isRecord(value)) return { ok: false, issues: ['manifest must be an object'] };
  if (value.schema_version !== 1) issues.push('schema_version must be 1');
  for (const field of ['ticket', 'input_snapshot', 'workflow', 'phases', 'outputs']) if (!isRecord(value[field])) issues.push(`${field} must be an object`);
  const workflow = isRecord(value.workflow) ? value.workflow : {};
  if (!PHASES.includes(workflow.current_phase as Phase)) issues.push('workflow.current_phase is invalid');
  const phases = isRecord(value.phases) ? value.phases : {};
  for (const phase of PHASES) {
    const entry = phases[phase];
    if (!isRecord(entry)) issues.push(`phases.${phase} must be an object`);
    else if (!['pending', 'in_progress', 'completed', 'blocked', 'stale', 'skipped', 'failed'].includes(String(entry.status))) issues.push(`phases.${phase}.status is invalid`);
  }
  const snapshot = isRecord(value.input_snapshot) ? value.input_snapshot : {};
  if (!Number.isInteger(snapshot.revision) || Number(snapshot.revision) < 1) issues.push('input_snapshot.revision must be a positive integer');
  if (!Array.isArray(snapshot.files)) issues.push('input_snapshot.files must be an array');
  return issues.length ? { ok: false, issues } : { ok: true, value: value as unknown as Manifest };
}

function invalidDependency(manifest: Manifest): string | null {
  for (const [name, output] of Object.entries(manifest.outputs)) if (output.state !== 'valid') return `${name} is ${output.state}`;
  return null;
}

export function transitionPhase(manifest: Manifest, next: Phase, now: string): { ok: true; manifest: Manifest } | { ok: false; reason: string } {
  const current = manifest.workflow.current_phase;
  if (!transitions[current].includes(next)) return { ok: false, reason: `Invalid transition: ${current} to ${next}` };
  if (next === 'EXECUTE') {
    const invalid = invalidDependency(manifest);
    if (invalid) return { ok: false, reason: `Cannot execute: ${invalid}` };
  }
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

export function propagateStale(manifest: Manifest, delta: SnapshotDelta, nextSnapshot: InputSnapshot, now: string): Manifest {
  if (!delta.changed) return manifest;
  const result = structuredClone(manifest);
  result.input_snapshot = nextSnapshot;
  result.workflow.updated_at = now;
  if (delta.primary_source_changed) {
    for (const name of ['requirements.md', 'test-cases.md', 'report.md']) setOutputState(result, name, 'stale');
    setOutputState(result, 'automation.md', 'review_required');
    for (const phase of ['ANALYZE', 'TEST_DESIGN', 'REPORT'] as const) result.phases[phase].status = 'stale';
    if (result.outputs['automation.md']) { result.phases.AUTOMATION_REVIEW.status = 'stale'; result.phases.AUTOMATE.status = 'stale'; }
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
    if (requestedPhase === 'EXECUTE') { const invalid = invalidDependency(manifest); if (invalid) return { ok: false, reason: `Cannot execute: ${invalid}` }; }
    return { ok: true, phase: requestedPhase, reason: 'Requested phase dependencies are valid' };
  }
  const phase = PHASES.find((candidate) => !['completed', 'skipped'].includes(manifest.phases[candidate].status)) ?? 'COMPLETE';
  return { ok: true, phase, reason: `First incomplete phase: ${phase}` };
}

export async function loadManifest(filePath: string): Promise<Manifest> {
  const parsed: unknown = YAML.parse(await fs.readFile(filePath, 'utf8'));
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
