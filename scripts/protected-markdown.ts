import fs from 'node:fs/promises';
import path from 'node:path';

const heading = /^## Tester notes\s*$/gm;

export type ProtectedParseResult =
  | { ok: true; managedPrefix: string; testerNotesSuffix: string }
  | { ok: false; reason: 'missing_tester_notes' | 'duplicate_tester_notes' | 'tester_notes_not_final_section' | 'malformed_markdown' };

export function parseTesterNotes(markdown: string): ProtectedParseResult {
  if (markdown.includes('\0')) return { ok: false, reason: 'malformed_markdown' };
  const matches = [...markdown.matchAll(heading)];
  if (matches.length === 0) return { ok: false, reason: 'missing_tester_notes' };
  if (matches.length > 1) return { ok: false, reason: 'duplicate_tester_notes' };
  const start = matches[0].index;
  if (start === undefined) return { ok: false, reason: 'malformed_markdown' };
  const suffix = markdown.slice(start);
  if (/^## (?!Tester notes\s*$).+/m.test(suffix)) {
    return { ok: false, reason: 'tester_notes_not_final_section' };
  }
  return { ok: true, managedPrefix: markdown.slice(0, start), testerNotesSuffix: suffix };
}

function normalizePrefix(prefix: string): string {
  return `${prefix.trimEnd()}\n\n`;
}

export function mergeManagedMarkdown(
  existing: string | null,
  proposedManagedPrefix: string,
): { ok: true; content: string; changed: boolean } | { ok: false; reason: string } {
  const prefix = normalizePrefix(proposedManagedPrefix);
  if (existing === null) {
    return { ok: true, content: `${prefix}## Tester notes\n`, changed: true };
  }
  const parsed = parseTesterNotes(existing);
  if (!parsed.ok) return parsed;
  const content = prefix + parsed.testerNotesSuffix;
  return { ok: true, content, changed: content !== existing };
}

export async function saveManagedMarkdown(
  filePath: string,
  managedPrefix: string,
): Promise<'written' | 'unchanged'> {
  let existing: string | null = null;
  try { existing = await fs.readFile(filePath, 'utf8'); }
  catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
  const merged = mergeManagedMarkdown(existing, managedPrefix);
  if (!merged.ok) throw new Error(`Protected Markdown conflict: ${merged.reason}`);
  if (!merged.changed) return 'unchanged';
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, merged.content, 'utf8');
  return 'written';
}
