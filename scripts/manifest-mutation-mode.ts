import { readFile, writeFile } from 'node:fs/promises';
import YAML from 'yaml';

export type MutationMode = 'auto' | 'manual';

export async function setMutationMode(manifestPath: string, mode: MutationMode, actor: string): Promise<void> {
  const text = await readFile(manifestPath, 'utf8').catch(() => '');
  const data = (text ? (YAML.parse(text) as Record<string, unknown>) : null) ?? {};
  data.mutationMode = mode;
  data.mutationModeSetBy = actor;
  data.mutationModeSetAt = new Date().toISOString();
  await writeFile(manifestPath, YAML.stringify(data, { lineWidth: 120 }), 'utf8');
}

export async function readMutationMode(manifestPath: string): Promise<MutationMode | null> {
  const text = await readFile(manifestPath, 'utf8').catch(() => '');
  if (!text) return null;
  try {
    const data = YAML.parse(text) as { mutationMode?: unknown } | null;
    const m = data?.mutationMode;
    return m === 'auto' || m === 'manual' ? m : null;
  } catch {
    return null;
  }
}
