import { readFile, writeFile } from 'node:fs/promises';
import YAML from 'yaml';
import type { ExecutionMode } from './workflow-types.js';

export type { ExecutionMode };

export async function setExecutionMode(manifestPath: string, mode: ExecutionMode, actor: string): Promise<void> {
  const text = await readFile(manifestPath, 'utf8').catch(() => '');
  const data = (text ? (YAML.parse(text) as Record<string, unknown>) : null) ?? {};
  const execution = (data.execution && typeof data.execution === 'object' && !Array.isArray(data.execution)) ? (data.execution as Record<string, unknown>) : {};
  execution.mode = mode;
  execution.modeSetBy = actor;
  execution.modeSetAt = new Date().toISOString();
  data.execution = execution;
  await writeFile(manifestPath, YAML.stringify(data, { lineWidth: 120 }), 'utf8');
}

export async function readExecutionMode(manifestPath: string): Promise<ExecutionMode | null> {
  const text = await readFile(manifestPath, 'utf8').catch(() => '');
  if (!text) return null;
  try {
    const data = YAML.parse(text) as { execution?: { mode?: unknown } } | null;
    const m = data?.execution?.mode;
    return m === 'cli_first' || m === 'mcp_first' ? m : null;
  } catch {
    return null;
  }
}
