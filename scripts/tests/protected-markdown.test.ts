import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mergeManagedMarkdown, parseTesterNotes } from '../protected-markdown.js';

test('preserves tester notes byte-for-byte', () => {
  const notes = '## Tester notes\r\n\r\nKeep **this**.\r\n';
  const result = mergeManagedMarkdown(`# Old\n\n${notes}`, '# New');
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.content, `# New\n\n${notes}`);
});

test('rejects missing, duplicate, and non-final tester notes', () => {
  assert.deepEqual(parseTesterNotes('# No notes\n'), { ok: false, reason: 'missing_tester_notes' });
  assert.deepEqual(parseTesterNotes('## Tester notes\n## Tester notes\n'), { ok: false, reason: 'duplicate_tester_notes' });
  assert.deepEqual(parseTesterNotes('## Tester notes\n## Later\n'), { ok: false, reason: 'tester_notes_not_final_section' });
});

test('creates one protected section and detects unchanged rerun', () => {
  const created = mergeManagedMarkdown(null, '# Managed');
  assert.deepEqual(created, { ok: true, content: '# Managed\n\n## Tester notes\n', changed: true });
  const same = mergeManagedMarkdown(created.ok ? created.content : null, '# Managed');
  assert.equal(same.ok && same.changed, false);
});
