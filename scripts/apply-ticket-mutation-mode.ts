import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import YAML from 'yaml';
import { hostMatchesPattern } from './mutation-gate-helpers.js';
import { setMutationMode, type MutationMode } from './manifest-mutation-mode.js';

export async function applyTicketMutationMode(
  ticketKey: string,
  env: string,
  host: string,
  actor: 'paco-ticket' | 'paco-discover',
): Promise<MutationMode> {
  const base = process.env.PACO_TICKET_OUTPUT ?? 'docs/tickets';
  const manifestPath = join(base, ticketKey, 'manifest.yaml');
  const cfgText = await readFile('paco.config.yaml', 'utf8');
  const cfg = YAML.parse(cfgText) as { safety: { mutationEnabledEnvironments: string[]; allowedHosts: string[]; externalDevHosts: string[] } };
  const onDev = cfg.safety.mutationEnabledEnvironments.includes(env);
  const onHost = hostMatchesPattern(host, [...cfg.safety.allowedHosts, ...cfg.safety.externalDevHosts]);
  const mode: MutationMode = onDev && onHost ? 'auto' : 'manual';
  await setMutationMode(manifestPath, mode, actor);
  return mode;
}
