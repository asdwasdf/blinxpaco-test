import fs from 'node:fs/promises';
import path from 'node:path';

export interface DiscoveryRequest {
  selection: string;
  projectRoot: string;
  sourceRoot: string;
  outputRoot: string;
  folderPattern: RegExp;
  primarySourceFile: 'ticket.md';
}

export interface DiscoveredTicket {
  key: string;
  folder_name: string;
  source_directory: string;
  output_directory: string;
  primary_source: 'ticket.md';
  sources: Array<{ path: string; role: 'primary_source' | 'supporting' }>;
}

export type DiscoveryFailureCode =
  | 'NOT_FOUND'
  | 'OUTSIDE_SOURCE_ROOT'
  | 'INVALID_FOLDER_NAME'
  | 'MISSING_PRIMARY_SOURCE'
  | 'DUPLICATE_TICKET_KEY'
  | 'AMBIGUOUS_SELECTION'
  | 'UNSUPPORTED_SOURCE_ENTRY';

export type DiscoveryResult =
  | { ok: true; ticket: DiscoveredTicket }
  | { ok: false; code: DiscoveryFailureCode; message: string; candidates: string[] };

function failure(code: DiscoveryFailureCode, message: string, candidates: string[] = []): DiscoveryResult {
  return { ok: false, code, message, candidates };
}

function within(root: string, target: string): boolean {
  const relative = path.relative(root, target);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function ticketKey(folder: string): string | null {
  return /^([A-Z][A-Z0-9]*-[0-9]+)-/.exec(folder)?.[1] ?? null;
}

async function regularFiles(directory: string, prefix = ''): Promise<string[]> {
  const files: string[] = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const relative = path.posix.join(prefix, entry.name);
    const fullPath = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Unsupported source entry: ${relative}`);
    if (entry.isDirectory()) files.push(...(await regularFiles(fullPath, relative)));
    else if (entry.isFile()) files.push(relative);
    else throw new Error(`Unsupported source entry: ${relative}`);
  }
  return files.sort();
}

export async function discoverTicket(request: DiscoveryRequest): Promise<DiscoveryResult> {
  const projectRoot = path.resolve(request.projectRoot);
  const sourceRoot = path.resolve(projectRoot, request.sourceRoot);
  const outputRoot = path.resolve(projectRoot, request.outputRoot);
  let canonicalSource: string;
  try {
    canonicalSource = await fs.realpath(sourceRoot);
  } catch {
    return failure('NOT_FOUND', `Source root not found: ${request.sourceRoot}`);
  }
  if (!within(projectRoot, canonicalSource) || !within(projectRoot, outputRoot)) {
    return failure('OUTSIDE_SOURCE_ROOT', 'Configured source or output root escapes project root');
  }

  const entries = (await fs.readdir(canonicalSource, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && !entry.isSymbolicLink())
    .map((entry) => entry.name)
    .sort();
  const selectedName = path.basename(request.selection.replace(/[\\/]$/, ''));
  const keySelection = /^[A-Z][A-Z0-9]*-[0-9]+$/.test(request.selection);
  const candidates = entries.filter(
    (name) => name === selectedName || (keySelection && ticketKey(name) === request.selection),
  );
  if (candidates.length === 0) return failure('NOT_FOUND', `Ticket not found: ${request.selection}`);
  if (candidates.length > 1) return failure('AMBIGUOUS_SELECTION', 'Selection matches multiple folders', candidates);

  const folder = candidates[0];
  if (!request.folderPattern.test(folder)) {
    return failure('INVALID_FOLDER_NAME', `Invalid ticket folder: ${folder}`, [folder]);
  }
  const key = ticketKey(folder);
  if (!key) return failure('INVALID_FOLDER_NAME', `Cannot parse ticket key: ${folder}`, [folder]);
  const duplicates = entries.filter((name) => ticketKey(name) === key);
  if (duplicates.length > 1) {
    return failure('DUPLICATE_TICKET_KEY', `Duplicate ticket key: ${key}`, duplicates);
  }

  const selectedPath = path.resolve(canonicalSource, folder);
  let canonicalTicket: string;
  try {
    canonicalTicket = await fs.realpath(selectedPath);
  } catch {
    return failure('NOT_FOUND', `Ticket directory not found: ${folder}`);
  }
  if (!within(canonicalSource, canonicalTicket)) {
    return failure('OUTSIDE_SOURCE_ROOT', `Ticket escapes source root: ${folder}`);
  }
  const primaryPath = path.join(canonicalTicket, request.primarySourceFile);
  try {
    const stat = await fs.lstat(primaryPath);
    if (!stat.isFile() || stat.isSymbolicLink()) {
      return failure('MISSING_PRIMARY_SOURCE', `Missing ${request.primarySourceFile}`, [folder]);
    }
  } catch {
    return failure('MISSING_PRIMARY_SOURCE', `Missing ${request.primarySourceFile}`, [folder]);
  }

  let files: string[];
  try {
    files = await regularFiles(canonicalTicket);
  } catch (error) {
    return failure('UNSUPPORTED_SOURCE_ENTRY', (error as Error).message, [folder]);
  }
  return {
    ok: true,
    ticket: {
      key,
      folder_name: folder,
      source_directory: path.posix.join(request.sourceRoot, folder),
      output_directory: path.posix.join(request.outputRoot, folder),
      primary_source: request.primarySourceFile,
      sources: files.map((file) => ({
        path: file,
        role: file === request.primarySourceFile ? 'primary_source' : 'supporting',
      })),
    },
  };
}
