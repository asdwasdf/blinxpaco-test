import type { Manifest } from './manifest-utils.js';
import { PHASES } from './workflow-types.js';

function list(values: string[], empty: string): string {
  return values.length ? values.map((value) => `- ${value}`).join('\n') : `- ${empty}`;
}

export function renderStatus(manifest: Manifest, nextAction: string): string {
  const completed = PHASES.filter((phase) => ['completed', 'skipped'].includes(manifest.phases[phase].status));
  const warnings = PHASES.flatMap((phase) => manifest.phases[phase].warnings.map((value) => `${phase}: ${value}`));
  const blockers = PHASES.flatMap((phase) => manifest.phases[phase].blockers.map((value) => `${phase}: ${value}`));
  const valid = Object.entries(manifest.outputs).filter(([, output]) => output.state === 'valid').map(([name]) => name);
  const stale = Object.entries(manifest.outputs).filter(([, output]) => output.state !== 'valid').map(([name, output]) => `${name}: ${output.state}`);
  const rows = PHASES.map((phase) => {
    const entry = manifest.phases[phase];
    return `| ${phase} | ${entry.status} | ${entry.outcome ?? '-'} | ${entry.updated_at || '-'} |`;
  }).join('\n');
  const checkpoints = manifest.workflow.checkpoints.map(
    (item) => `- ${item.at} | revision ${item.input_revision} | ${item.phase} | ${item.outcome} | ${item.message}`,
  );
  const location = manifest.phases.LOCATE;
  const manualCounts = Object.values(manifest.execution.manual).reduce<Record<string, number>>((counts, item) => {
    counts[item.result] = (counts[item.result] ?? 0) + 1;
    return counts;
  }, {});
  const implemented = Object.values(manifest.execution.automation).filter((item) => item.spec_path).length;
  const automationBlocked = Object.values(manifest.execution.automation).filter((item) => !item.spec_path && item.reason).length;
  const executed = Object.keys(manifest.execution.runs).length;
  const budget = location.budget
    ? `${location.budget.views_used}/${location.budget.views_limit} views; ${location.budget.elapsed_minutes}/${location.budget.minutes_limit} minutes`
    : 'Chưa ghi';

  return `# Ticket Status: ${manifest.ticket.key}

**Input Revision:** ${manifest.input_snapshot.revision}
**Current Phase:** ${manifest.workflow.current_phase}
**Last Completed Phase:** ${manifest.workflow.last_completed_phase ?? 'None'}
**Updated:** ${manifest.workflow.updated_at}

## Progress

| Phase | Status | Outcome | Updated |
|---|---|---|---|
${rows}

## Execution Summary

- Manual results: Pass ${manualCounts.Pass ?? 0}, Fail ${manualCounts.Fail ?? 0}, Inconclusive ${manualCounts.Inconclusive ?? 0}, Blocked ${manualCounts.Blocked ?? 0}, Not Run ${manualCounts['Not Run'] ?? 0}
- Automation: Implemented ${implemented}, Executed ${executed}, Blocked ${automationBlocked}

## Completed Work

${list(completed, 'Chưa có')}

## Warnings & Blockers

${list([...warnings, ...blockers], 'Không có')}

## Feature Location

- Status: ${location.status}
- Budget: ${budget}
${list([...location.warnings, ...location.blockers], 'Không có context, candidate hoặc blocker')}

## Valid Artifacts

${list(valid, 'Không có')}

## Stale Artifacts

${list(stale, 'Không có')}

## Next Action

${nextAction}

## Checkpoint History

${list(checkpoints, 'Chưa có checkpoint')}
`;
}
