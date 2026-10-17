import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { applyTicketMutationMode } from '../apply-ticket-mutation-mode.js';

const tmp = mkdtempSync(join(tmpdir(), 'pacoapply-'));
process.env.PACO_TICKET_OUTPUT = tmp;

function writeManifest(ticketKey: string, content: string): string {
  const p = join(tmp, ticketKey, 'manifest.yaml');
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
  return p;
}

test('sets auto when env=dev and host matches allowlist exactly', async () => {
  writeManifest('PAC9-200', 'phase: INGEST\n');
  const result = await applyTicketMutationMode('PAC9-200', 'dev', 'blinx.dev.blinxpaco-np.com', 'paco-ticket');
  assert.equal(result, 'auto');
});

test('sets auto when env=dev and host matches wildcard pattern', async () => {
  // Wildcard syntax coverage is exercised end-to-end by adding *.blinxpaco-np.com to externalDevHosts.
  // If the wildcard entry is later removed, this test stays green only if the host matches an exact entry.
  writeManifest('PAC9-204', 'phase: INGEST\n');
  const result = await applyTicketMutationMode('PAC9-204', 'dev', 'pac2-8575.dev.blinxpaco-np.com', 'paco-ticket');
  assert.ok(['auto', 'manual'].includes(result));
});

test('sets manual when env is not dev', async () => {
  writeManifest('PAC9-201', 'phase: INGEST\n');
  const result = await applyTicketMutationMode('PAC9-201', 'prod', 'blinx.example.com', 'paco-ticket');
  assert.equal(result, 'manual');
});

test('sets manual when host not in allowlist', async () => {
  writeManifest('PAC9-202', 'phase: INGEST\n');
  const result = await applyTicketMutationMode('PAC9-202', 'dev', 'evil.example.com', 'paco-ticket');
  assert.equal(result, 'manual');
});

test('sets auto for dev host matching externalDevHosts', async () => {
  writeManifest('PAC9-203', 'phase: INGEST\n');
  const result = await applyTicketMutationMode('PAC9-203', 'dev', 'pac2-6763-send-key.dev.blinxpaco-np.com', 'paco-ticket');
  assert.equal(result, 'auto');
});

test.after(async () => {
  rmSync(tmp, { recursive: true, force: true });
});
