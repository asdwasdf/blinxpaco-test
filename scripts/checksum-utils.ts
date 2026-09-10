import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

export interface SourceSnapshotEntry {
  path: string;
  role: 'primary_source' | 'supporting';
  type: string;
  sha256: string;
}

export interface InputSnapshot {
  revision: number;
  generated_at: string;
  files: SourceSnapshotEntry[];
}

export interface SnapshotDelta {
  changed: boolean;
  added: string[];
  modified: string[];
  deleted: string[];
  unchanged: string[];
  primary_source_changed: boolean;
}

export function calculateChecksum(content: string | Buffer): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

export async function calculateFileChecksum(filePath: string): Promise<string> {
  return calculateChecksum(await fs.readFile(filePath));
}

function posixPath(value: string): string {
  return value.split(path.sep).join(path.posix.sep);
}

function confined(baseDir: string, relativePath: string): string {
  const fullPath = path.resolve(baseDir, relativePath);
  const relative = path.relative(path.resolve(baseDir), fullPath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Source path escapes base directory: ${relativePath}`);
  }
  return fullPath;
}

export async function snapshotFiles(
  baseDir: string,
  files: ReadonlyArray<{ path: string; role: SourceSnapshotEntry['role'] }>,
): Promise<SourceSnapshotEntry[]> {
  const snapshots = await Promise.all(
    files.map(async (file) => {
      const normalized = posixPath(path.normalize(file.path));
      const fullPath = confined(baseDir, normalized);
      const stat = await fs.lstat(fullPath);
      if (!stat.isFile() || stat.isSymbolicLink()) {
        throw new Error(`Unsupported source entry: ${file.path}`);
      }
      const extension = path.extname(normalized).slice(1).toLowerCase();
      return {
        path: normalized,
        role: file.role,
        type: extension || 'unknown',
        sha256: await calculateFileChecksum(fullPath),
      } satisfies SourceSnapshotEntry;
    }),
  );
  return snapshots.sort((left, right) => left.path.localeCompare(right.path));
}

export function compareSnapshots(
  previous: InputSnapshot,
  current: ReadonlyArray<SourceSnapshotEntry>,
): SnapshotDelta {
  const before = new Map(previous.files.map((file) => [file.path, file]));
  const after = new Map(current.map((file) => [file.path, file]));
  const added: string[] = [];
  const modified: string[] = [];
  const deleted: string[] = [];
  const unchanged: string[] = [];

  for (const [filePath, file] of after) {
    const old = before.get(filePath);
    if (!old) added.push(filePath);
    else if (old.sha256 !== file.sha256 || old.role !== file.role || old.type !== file.type) {
      modified.push(filePath);
    } else unchanged.push(filePath);
  }
  for (const filePath of before.keys()) {
    if (!after.has(filePath)) deleted.push(filePath);
  }
  for (const list of [added, modified, deleted, unchanged]) list.sort();
  const primaryPaths = new Set(
    [...previous.files, ...current]
      .filter((file) => file.role === 'primary_source')
      .map((file) => file.path),
  );
  const primary_source_changed = [...primaryPaths].some(
    (filePath) => added.includes(filePath) || modified.includes(filePath) || deleted.includes(filePath),
  );

  return {
    changed: added.length + modified.length + deleted.length > 0,
    added,
    modified,
    deleted,
    unchanged,
    primary_source_changed,
  };
}

export function reconcileRevision(
  previous: InputSnapshot | null,
  current: ReadonlyArray<SourceSnapshotEntry>,
  generatedAt: string,
): { snapshot: InputSnapshot; delta: SnapshotDelta; revision_changed: boolean } {
  const files = [...current].sort((left, right) => left.path.localeCompare(right.path));
  if (!previous) {
    return {
      snapshot: { revision: 1, generated_at: generatedAt, files },
      delta: {
        changed: true,
        added: files.map((file) => file.path),
        modified: [],
        deleted: [],
        unchanged: [],
        primary_source_changed: files.some((file) => file.role === 'primary_source'),
      },
      revision_changed: true,
    };
  }
  const delta = compareSnapshots(previous, files);
  if (!delta.changed) return { snapshot: previous, delta, revision_changed: false };
  return {
    snapshot: { revision: previous.revision + 1, generated_at: generatedAt, files },
    delta,
    revision_changed: true,
  };
}
