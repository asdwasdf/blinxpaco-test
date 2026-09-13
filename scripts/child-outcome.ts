import fs from 'node:fs/promises';
import path from 'node:path';
import { calculateFileChecksum } from './checksum-utils.js';
import type { LocationBudgetRecord } from './manifest-utils.js';
import { PHASES, type MutationClass, type Phase, type SkillOutcomeCode } from './workflow-types.js';

export type ChildSkill = 'paco-requirements' | 'paco-explore' | 'paco-test-design' | 'paco-playwright' | 'paco-report';
export type ChildPhase = Exclude<Phase, 'DISCOVER' | 'INGEST' | 'COMPLETE'>;
export interface ChildArtifactResult { path: string; action: 'created' | 'updated' | 'unchanged'; sha256: string }
export interface ChildSkillOutcome {
  schema_version: 1; skill: ChildSkill; phase: ChildPhase;
  ticket: { key: string; folder_name: string }; input_revision: number; outcome: SkillOutcomeCode;
  artifacts: ChildArtifactResult[]; summary: { message: string; counts: Record<string, number> };
  mutation: { class: MutationClass; occurred: boolean; cleanup: 'not_applicable' | 'not_required' | 'completed' | 'failed' | 'pending'; leftover_identifiers: string[] };
  sensitive_data: { detected: boolean; redacted: boolean; details: string[] };
  location?: { mode: 'locate'; route_status: 'Confirmed' | 'Candidate' | 'Blocked' | 'Inconclusive'; budget: LocationBudgetRecord; next_action: string };
  blockers: string[]; warnings: string[]; recommended_next_phase: Phase | null;
}

const owners: Record<ChildSkill, RegExp> = {
  'paco-requirements': /\/requirements\.md$/,
  'paco-explore': /\/(?:feature-location|exploration)\.md$/,
  'paco-test-design': /\/test-cases\.md$/,
  'paco-playwright': /\/(?:automation\.md|playwright\/.*\.spec\.ts)$/,
  'paco-report': /\/(?:report\.md|defects\/.*\.md|evidence\/.*)$/,
};
const childPhases = PHASES.filter((phase): phase is ChildPhase => !['DISCOVER', 'INGEST', 'COMPLETE'].includes(phase));
const outcomes: SkillOutcomeCode[] = ['completed', 'completed_with_warnings', 'blocked', 'failed', 'inconclusive', 'no_change'];

function record(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null && !Array.isArray(value); }

export function validateChildOutcome(
  value: unknown,
  expected: { skill: ChildSkill; phase: ChildPhase; ticket_key: string; folder_name: string; input_revision: number },
): { ok: true; value: ChildSkillOutcome } | { ok: false; issues: string[] } {
  const issues: string[] = [];
  if (!record(value)) return { ok: false, issues: ['outcome must be an object'] };
  if (value.schema_version !== 1) issues.push('schema_version must be 1');
  if (value.skill !== expected.skill) issues.push('skill does not match expected context');
  if (value.phase !== expected.phase || !childPhases.includes(value.phase as ChildPhase)) issues.push('phase does not match expected context');
  const ticket = record(value.ticket) ? value.ticket : {};
  if (ticket.key !== expected.ticket_key || ticket.folder_name !== expected.folder_name) issues.push('ticket does not match expected context');
  if (value.input_revision !== expected.input_revision) issues.push('input_revision does not match expected context');
  if (!outcomes.includes(value.outcome as SkillOutcomeCode)) issues.push('outcome is invalid');
  if (!Array.isArray(value.artifacts)) issues.push('artifacts must be an array');
  if (!record(value.mutation)) issues.push('mutation must be an object');
  if (!record(value.sensitive_data)) issues.push('sensitive_data must be an object');
  else if (value.sensitive_data.detected === true && value.sensitive_data.redacted !== true) issues.push('sensitive data must be redacted');
  const mutation = record(value.mutation) ? value.mutation : {};
  if (mutation.occurred === false && !['not_applicable', 'not_required'].includes(String(mutation.cleanup))) issues.push('cleanup is inconsistent with no mutation');
  if (value.phase === 'LOCATE') {
    const location = record(value.location) ? value.location : {};
    const budget = record(location.budget) ? location.budget : {};
    if (location.mode !== 'locate' || !['Confirmed', 'Candidate', 'Blocked', 'Inconclusive'].includes(String(location.route_status)) || typeof location.next_action !== 'string') issues.push('location metadata is invalid');
    for (const field of ['views_used', 'elapsed_minutes']) if (typeof budget[field] !== 'number' || Number(budget[field]) < 0) issues.push(`location budget ${field} is invalid`);
    for (const field of ['views_limit', 'minutes_limit']) if (typeof budget[field] !== 'number' || Number(budget[field]) <= 0) issues.push(`location budget ${field} is invalid`);
    if (mutation.occurred !== false) issues.push('LOCATE cannot record mutation');
  } else if (value.location !== undefined) issues.push('location metadata is only valid for LOCATE');
  if (!Array.isArray(value.blockers) || !Array.isArray(value.warnings)) issues.push('blockers and warnings must be arrays');
  return issues.length ? { ok: false, issues } : { ok: true, value: value as unknown as ChildSkillOutcome };
}

function confined(root: string, candidate: string): boolean {
  const relative = path.relative(root, candidate);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

export async function verifyChildArtifacts(
  outcome: ChildSkillOutcome,
  projectRoot: string,
  outputRoot: string,
): Promise<{ ok: true } | { ok: false; issues: string[] }> {
  const root = path.resolve(projectRoot);
  const allowedRoot = path.resolve(root, outputRoot, outcome.ticket.folder_name);
  const issues: string[] = [];
  for (const artifact of outcome.artifacts) {
    const fullPath = path.resolve(root, artifact.path);
    const normalized = artifact.path.split(path.sep).join('/');
    if (!confined(allowedRoot, fullPath)) { issues.push(`${artifact.path}: outside ticket output`); continue; }
    if (!owners[outcome.skill].test(`/${normalized}`)) { issues.push(`${artifact.path}: wrong owner`); continue; }
    if (outcome.skill === 'paco-explore' && ((outcome.phase === 'LOCATE') !== normalized.endsWith('/feature-location.md'))) { issues.push(`${artifact.path}: wrong paco-explore mode`); continue; }
    try {
      const stat = await fs.lstat(fullPath);
      if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('not regular');
      if ((await calculateFileChecksum(fullPath)) !== artifact.sha256) issues.push(`${artifact.path}: checksum mismatch`);
    } catch { issues.push(`${artifact.path}: missing`); }
  }
  return issues.length ? { ok: false, issues } : { ok: true };
}
