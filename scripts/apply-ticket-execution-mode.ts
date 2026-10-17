import { join } from 'node:path';
import { readExecutionMode, setExecutionMode, type ExecutionMode } from './manifest-execution-mode.js';

export async function applyTicketExecutionMode(
  ticketKey: string,
  actor: 'paco-ticket' | 'paco-discover',
  override?: ExecutionMode,
): Promise<ExecutionMode> {
  const base = process.env.PACO_TICKET_OUTPUT ?? 'docs/tickets';
  const manifestPath = join(base, ticketKey, 'manifest.yaml');
  const existing = await readExecutionMode(manifestPath);
  const mode: ExecutionMode = override ?? existing ?? 'cli_first';
  if (mode !== existing) await setExecutionMode(manifestPath, mode, actor);
  return mode;
}
