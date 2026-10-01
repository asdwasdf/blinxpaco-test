import fs from 'node:fs/promises';
import path from 'node:path';
import { calculateFileChecksum } from './checksum-utils.js';
import type { LocationBudgetRecord } from './manifest-utils.js';
import {
  PHASES,
  type AutomationCaseExecution,
  type AutomationCaseImplementation,
  type ManualCaseExecution,
  type MutationClass,
  type Phase,
  type SkillOutcomeCode,
} from './workflow-types.js';

export type ChildSkill = 'paco-requirements' | 'paco-explore' | 'paco-test-design' | 'paco-playwright' | 'paco-report';
export type ChildPhase = Exclude<Phase, 'DISCOVER' | 'INGEST' | 'COMPLETE'>;
export interface ChildArtifactResult { path: string; action: 'created' | 'updated' | 'unchanged'; sha256: string }
export interface PlaywrightCaseOutcome {
  case_id: string;
  manual?: ManualCaseExecution;
  automation?: AutomationCaseImplementation;
  run?: AutomationCaseExecution;
}
export interface ChildSkillOutcome {
  schema_version: 1; skill: ChildSkill; phase: ChildPhase;
  ticket: { key: string; folder_name: string }; input_revision: number; outcome: SkillOutcomeCode;
  artifacts: ChildArtifactResult[]; summary: { message: string; counts: Record<string, number> };
  mutation: { class: MutationClass; occurred: boolean; cleanup: 'not_applicable' | 'not_required' | 'completed' | 'failed' | 'pending'; leftover_identifiers: string[] };
  sensitive_data: { detected: boolean; redacted: boolean; details: string[] };
  location?: { mode: 'locate'; route_status: 'Confirmed' | 'Candidate' | 'Blocked' | 'Inconclusive'; budget: LocationBudgetRecord; next_action: string };
  playwright_cases?: PlaywrightCaseOutcome[];
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
const testResults = ['Pass', 'Fail', 'Blocked', 'Not Run', 'Inconclusive'] as const;
const expectedBases = ['Confirmed', 'Observed', 'Inferred', 'Open Question'] as const;
const dataVariants = ['same', 'clean', 'fresh_session', 'control', 'initial'] as const;
const automationVerifications = ['Matched product result', 'Product behavior mismatch', 'Automation defect', 'Setup or authentication failure', 'Inconclusive'] as const;

function record(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null && !Array.isArray(value); }
function strings(value: unknown): value is string[] { return Array.isArray(value) && value.every((item) => typeof item === 'string'); }

function validateManualExecution(value: Record<string, unknown>, caseId: string, issues: string[]): void {
  if (!testResults.includes(value.result as typeof testResults[number]) || !expectedBases.includes(value.expected_basis as typeof expectedBases[number]) ||
      typeof value.control_path_checked !== 'boolean' || typeof value.route !== 'string' || !strings(value.locators) ||
      (value.skip_or_block_reason !== null && typeof value.skip_or_block_reason !== 'string') || !Array.isArray(value.attempts)) {
    issues.push(`${caseId}: manual payload is invalid`);
    return;
  }
  const attempts = value.attempts;
  if (attempts.some((attempt) => !record(attempt) || typeof attempt.id !== 'string' || !testResults.includes(attempt.result as typeof testResults[number]) ||
      !dataVariants.includes(attempt.data_variant as typeof dataVariants[number]) || !strings(attempt.evidence) || !attempt.evidence.length)) {
    issues.push(`${caseId}: every manual attempt requires valid fields and evidence`);
    return;
  }
  const typedAttempts = attempts as unknown as ManualCaseExecution['attempts'];
  if ((value.expected_basis === 'Inferred' || value.expected_basis === 'Open Question') && value.result === 'Fail') issues.push(`${caseId}: inferred or open expected basis cannot produce Fail`);
  const observed = new Set(typedAttempts.map((attempt) => attempt.result));
  const diagnosticObserved = new Set(typedAttempts.filter((attempt) => attempt.data_variant !== 'control').map((attempt) => attempt.result));
  if ((value.result === 'Pass' || value.result === 'Fail') && (diagnosticObserved.has(value.result === 'Pass' ? 'Fail' : 'Pass') || !diagnosticObserved.has(value.result))) {
    issues.push(`${caseId}: manual result is inconsistent; mixed diagnostic Pass/Fail outcomes require Inconclusive`);
  }
  if (value.result === 'Fail') {
    const diagnostic = new Set(typedAttempts.filter((attempt) => attempt.data_variant !== 'control').map((attempt) => attempt.data_variant));
    if (!(['same', 'clean', 'fresh_session'] as const).every((variant) => diagnostic.has(variant)) || !value.control_path_checked || !typedAttempts.some((attempt) => attempt.data_variant === 'control')) {
      issues.push(`${caseId}: Fail requires three diagnostic attempts and a control path`);
    }
  } else if (value.result === 'Pass' && (!typedAttempts.length || typedAttempts.every((attempt) => attempt.result !== 'Pass'))) {
    issues.push(`${caseId}: Pass requires observed evidence`);
  } else if (value.result === 'Inconclusive' && observed.size < 2) {
    issues.push(`${caseId}: Inconclusive requires differing attempt results`);
  } else if ((value.result === 'Blocked' || value.result === 'Not Run') && !(value.skip_or_block_reason as string | null)?.trim()) {
    issues.push(`${caseId}: ${value.result} requires a reason`);
  }
}

function validateAutomationImplementation(value: Record<string, unknown>, caseId: string, issues: string[]): void {
  if ((value.spec_path !== null && typeof value.spec_path !== 'string') || typeof value.diagnostic !== 'boolean' ||
      (value.reason !== null && typeof value.reason !== 'string') || !Number.isInteger(value.input_revision) || Number(value.input_revision) < 1) {
    issues.push(`${caseId}: automation payload is invalid`);
  }
}

function validateAutomationExecution(value: Record<string, unknown>, caseId: string, issues: string[]): void {
  if (!testResults.includes(value.result as typeof testResults[number]) ||
      !automationVerifications.includes(value.verification as typeof automationVerifications[number]) || !strings(value.evidence) ||
      value.product_result_changed !== false) issues.push(`${caseId}: automation run payload is invalid`);
}

function validatePlaywrightCases(value: Record<string, unknown>, issues: string[]): void {
  if (value.skill !== 'paco-playwright') {
    if (value.playwright_cases !== undefined) issues.push('playwright_cases is only valid for paco-playwright');
    return;
  }
  if (!['MANUAL_EXECUTE', 'AUTOMATE', 'AUTOMATION_EXECUTE'].includes(String(value.phase))) return;
  if (!Array.isArray(value.playwright_cases)) { issues.push('playwright_cases must be an array'); return; }
  const seen = new Set<string>();
  for (const raw of value.playwright_cases) {
    if (!record(raw) || typeof raw.case_id !== 'string' || !raw.case_id.trim()) { issues.push('playwright case_id is invalid'); continue; }
    if (seen.has(raw.case_id)) issues.push(`${raw.case_id}: duplicate case id`);
    seen.add(raw.case_id);
    const expected = value.phase === 'MANUAL_EXECUTE' ? 'manual' : value.phase === 'AUTOMATE' ? 'automation' : 'run';
    const supplied = ['manual', 'automation', 'run'].filter((field) => raw[field] !== undefined);
    if (supplied.length !== 1 || supplied[0] !== expected || !record(raw[expected])) { issues.push(`${raw.case_id}: payload does not match ${value.phase}`); continue; }
    if (expected === 'manual') validateManualExecution(raw.manual as Record<string, unknown>, raw.case_id, issues);
    else if (expected === 'automation') validateAutomationImplementation(raw.automation as Record<string, unknown>, raw.case_id, issues);
    else validateAutomationExecution(raw.run as Record<string, unknown>, raw.case_id, issues);
  }
}

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
  validatePlaywrightCases(value, issues);
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
  const playwrightRoot = path.resolve(root, 'playwright/tests/tickets');
  const issues: string[] = [];
  const expectedSpecs = new Map((outcome.playwright_cases ?? []).flatMap((item) => item.automation?.spec_path ? [[item.automation.spec_path, item.case_id] as const] : []));
  const artifactPaths = new Set(outcome.artifacts.map((artifact) => artifact.path));
  for (const specPath of expectedSpecs.keys()) if (!artifactPaths.has(specPath)) issues.push(`${specPath}: spec missing from artifacts`);
  for (const artifact of outcome.artifacts) {
    const fullPath = path.resolve(root, artifact.path);
    const normalized = artifact.path.split(path.sep).join('/');
    const isSpec = outcome.skill === 'paco-playwright' && normalized.endsWith('.spec.ts');
    if (!(confined(allowedRoot, fullPath) || (isSpec && confined(playwrightRoot, fullPath)))) { issues.push(`${artifact.path}: outside ticket output`); continue; }
    if (!owners[outcome.skill].test(`/${normalized}`)) { issues.push(`${artifact.path}: wrong owner`); continue; }
    if (isSpec) {
      const caseId = expectedSpecs.get(artifact.path);
      if (!caseId || !path.basename(artifact.path).includes(caseId)) { issues.push(`${artifact.path}: spec case mapping mismatch`); continue; }
    }
    if (outcome.skill === 'paco-explore' && ((outcome.phase === 'LOCATE') !== normalized.endsWith('/feature-location.md'))) { issues.push(`${artifact.path}: wrong paco-explore mode`); continue; }
    try {
      const stat = await fs.lstat(fullPath);
      if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('not regular');
      if ((await calculateFileChecksum(fullPath)) !== artifact.sha256) issues.push(`${artifact.path}: checksum mismatch`);
    } catch { issues.push(`${artifact.path}: missing`); }
  }
  return issues.length ? { ok: false, issues } : { ok: true };
}
