import assert from 'node:assert/strict';
import { mkdtemp, mkdir, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import {
  calculateChecksum,
  calculateFileChecksum,
  reconcileRevision,
  snapshotFiles,
} from '../checksum-utils.js';
import { discoverTicket } from '../ticket-utils.js';

const pattern = /^[A-Z][A-Z0-9]*-[0-9]+-[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function project(folder = 'PAC9-101-valid-ticket'): Promise<string> {
  const root = await mkdtemp(path.join(tmpdir(), 'paco-ticket-'));
  const ticket = path.join(root, 'ticket', folder);
  await mkdir(path.join(ticket, 'attachments'), { recursive: true });
  await writeFile(path.join(ticket, 'ticket.md'), '# Synthetic ticket\n');
  await writeFile(path.join(ticket, 'attachments', 'image.bin'), Buffer.from([0xff, 0xfe, 0x00]));
  return root;
}

function request(root: string, selection = 'PAC9-101-valid-ticket') {
  return {
    selection,
    projectRoot: root,
    sourceRoot: 'ticket',
    outputRoot: 'docs/tickets',
    folderPattern: pattern,
    primarySourceFile: 'ticket.md' as const,
  };
}

test('discovers selected ticket and sorted nested sources', async () => {
  const root = await project();
  const result = await discoverTicket(request(root));
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.ticket.key, 'PAC9-101');
  assert.deepEqual(result.ticket.sources.map((source) => source.path), [
    'attachments/image.bin',
    'ticket.md',
  ]);
});

test('selects ticket by key', async () => {
  const root = await project();
  assert.equal((await discoverTicket(request(root, 'PAC9-101'))).ok, true);
});

test('rejects missing primary and invalid folder', async () => {
  const root = await project('bad-folder');
  const invalid = await discoverTicket(request(root, 'bad-folder'));
  assert.deepEqual(invalid.ok ? null : invalid.code, 'INVALID_FOLDER_NAME');

  const root2 = await mkdtemp(path.join(tmpdir(), 'paco-ticket-'));
  await mkdir(path.join(root2, 'ticket', 'PAC9-102-no-primary'), { recursive: true });
  const missing = await discoverTicket(request(root2, 'PAC9-102-no-primary'));
  assert.deepEqual(missing.ok ? null : missing.code, 'MISSING_PRIMARY_SOURCE');
});

test('rejects duplicate external key and symlink source', async () => {
  const root = await project();
  const duplicate = path.join(root, 'ticket', 'PAC9-101-other-ticket');
  await mkdir(duplicate);
  await writeFile(path.join(duplicate, 'ticket.md'), '# Duplicate\n');
  const result = await discoverTicket(request(root));
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.code, 'DUPLICATE_TICKET_KEY');

  const root2 = await project();
  await symlink('/tmp', path.join(root2, 'ticket', 'PAC9-101-valid-ticket', 'attachments', 'link'));
  const linked = await discoverTicket(request(root2));
  assert.equal(linked.ok, false);
  if (!linked.ok) assert.equal(linked.code, 'UNSUPPORTED_SOURCE_ENTRY');
});

test('rejects configured path escape', async () => {
  const root = await project();
  const result = await discoverTicket({ ...request(root), outputRoot: '../outside' });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.code, 'OUTSIDE_SOURCE_ROOT');
});

test('hashes raw bytes and reconciles revisions deterministically', async () => {
  const root = await project();
  const base = path.join(root, 'ticket', 'PAC9-101-valid-ticket');
  const files = await snapshotFiles(base, [
    { path: 'ticket.md', role: 'primary_source' },
    { path: 'attachments/image.bin', role: 'supporting' },
  ]);
  assert.equal(
    await calculateFileChecksum(path.join(base, 'attachments', 'image.bin')),
    calculateChecksum(Buffer.from([0xff, 0xfe, 0x00])),
  );
  assert.deepEqual(files.map((file) => file.path), ['attachments/image.bin', 'ticket.md']);

  const first = reconcileRevision(null, files, '2026-09-10T00:00:00.000Z');
  const same = reconcileRevision(first.snapshot, files, '2026-09-11T00:00:00.000Z');
  assert.equal(same.revision_changed, false);
  assert.strictEqual(same.snapshot, first.snapshot);

  await writeFile(path.join(base, 'ticket.md'), '# Changed synthetic ticket\n');
  const changedFiles = await snapshotFiles(base, [
    { path: 'ticket.md', role: 'primary_source' },
    { path: 'attachments/image.bin', role: 'supporting' },
  ]);
  const changed = reconcileRevision(first.snapshot, changedFiles, '2026-09-11T00:00:00.000Z');
  assert.equal(changed.snapshot.revision, 2);
  assert.equal(changed.delta.primary_source_changed, true);
  assert.deepEqual(changed.delta.modified, ['ticket.md']);
});
