import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { applyTicketExecutionMode } from '../apply-ticket-execution-mode.js';
import { readExecutionMode } from '../manifest-execution-mode.js';

const tmp = mkdtempSync(join(tmpdir(), 'pacoapplyexec-'));
process.env.PACO_TICKET_OUTPUT = tmp;

function writeManifest(ticketKey: string, content: string): string {
  const p = join(tmp, ticketKey, 'manifest.yaml');
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
  return p;
}

test('defaults to cli_first for fresh intake', async () => {
  writeManifest('PAC9-300', 'phase: INGEST\n');
  const result = await applyTicketExecutionMode('PAC9-300', 'paco-ticket');
  assert.equal(result, 'cli_first');
  assert.equal(await readExecutionMode(join(tmp, 'PAC9-300', 'manifest.yaml')), 'cli_first');
});

test('honors existing mcp_first manifest opt-out', async () => {
  writeManifest('PAC9-301', 'phase: INGEST\nexecution:\n  mode: mcp_first\n');
  const result = await applyTicketExecutionMode('PAC9-301', 'paco-ticket');
  assert.equal(result, 'mcp_first');
  assert.equal(await readExecutionMode(join(tmp, 'PAC9-301', 'manifest.yaml')), 'mcp_first');
});

test('override forces mode regardless of existing', async () => {
  writeManifest('PAC9-302', 'phase: INGEST\nexecution:\n  mode: mcp_first\n');
  const result = await applyTicketExecutionMode('PAC9-302', 'paco-ticket', 'cli_first');
  assert.equal(result, 'cli_first');
  assert.equal(await readExecutionMode(join(tmp, 'PAC9-302', 'manifest.yaml')), 'cli_first');
});

test.after(async () => {
  rmSync(tmp, { recursive: true, force: true });
});
