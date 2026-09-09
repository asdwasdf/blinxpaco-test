// scripts/checksum-utils.ts
import crypto from 'crypto';
import fs from 'fs/promises';

export async function calculateChecksum(content: string): Promise<string> {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

export async function calculateFileChecksum(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath, 'utf8');
  return calculateChecksum(content);
}

export interface FileSnapshot {
  path: string;
  role: 'primary_source' | 'supporting';
  type: string;
  sha256: string;
}

export async function snapshotFiles(
  baseDir: string,
  files: Array<{ path: string; role: 'primary_source' | 'supporting' }>
): Promise<FileSnapshot[]> {
  const snapshots: FileSnapshot[] = [];

  for (const file of files) {
    const fullPath = `${baseDir}/${file.path}`;
    const checksum = await calculateFileChecksum(fullPath);
    const ext = file.path.split('.').pop() || '';

    snapshots.push({
      path: file.path,
      role: file.role,
      type: ext,
      sha256: checksum
    });
  }

  return snapshots;
}
