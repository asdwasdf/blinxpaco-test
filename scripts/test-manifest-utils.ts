// scripts/test-manifest-utils.ts
import assert from 'assert';
import { createManifest, loadManifest } from './manifest-utils.js';
import { calculateChecksum } from './checksum-utils.js';

async function testManifestCreation() {
  const manifest = await createManifest({
    key: 'PAC2-5776',
    folder_name: 'PAC2-5776-test',
    source_directory: 'ticket/PAC2-5776-test',
    primary_source: 'ticket.md'
  });

  assert.strictEqual(manifest.schema_version, 1);
  assert.strictEqual(manifest.ticket.key, 'PAC2-5776');
  assert.strictEqual(manifest.workflow.status, 'pending');
  console.log('✓ testManifestCreation passed');
}

async function testChecksumCalculation() {
  const content = 'test content\n';
  const checksum = await calculateChecksum(content);

  assert.strictEqual(checksum.length, 64); // SHA-256 hex length
  console.log('✓ testChecksumCalculation passed');
}

async function run() {
  await testManifestCreation();
  await testChecksumCalculation();
  console.log('\nAll tests passed');
}

run().catch(err => {
  console.error('FAIL:', err.message);
  process.exit(1);
});
