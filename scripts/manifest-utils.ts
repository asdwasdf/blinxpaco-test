// scripts/manifest-utils.ts
import fs from 'fs/promises';
import YAML from 'yaml';

export interface ManifestTicket {
  key: string;
  folder_name: string;
  source_directory: string;
  primary_source: string;
}

export interface InputSnapshot {
  revision: number;
  generated_at: string;
  files: Array<{
    path: string;
    role: string;
    type: string;
    sha256: string;
  }>;
}

export interface WorkflowStatus {
  status: string;
  current_phase: string;
  last_completed_phase: string | null;
  updated_at: string;
}

export interface Manifest {
  schema_version: number;
  ticket: ManifestTicket;
  input_snapshot: InputSnapshot;
  workflow: WorkflowStatus;
  phases: Record<string, any>;
  outputs: Record<string, any>;
}

export async function createManifest(ticket: ManifestTicket): Promise<Manifest> {
  return {
    schema_version: 1,
    ticket,
    input_snapshot: {
      revision: 1,
      generated_at: new Date().toISOString(),
      files: []
    },
    workflow: {
      status: 'pending',
      current_phase: 'DISCOVER',
      last_completed_phase: null,
      updated_at: new Date().toISOString()
    },
    phases: {},
    outputs: {}
  };
}

export async function loadManifest(path: string): Promise<Manifest> {
  const content = await fs.readFile(path, 'utf8');
  return YAML.parse(content);
}

export async function saveManifest(path: string, manifest: Manifest): Promise<void> {
  const yaml = YAML.stringify(manifest);
  await fs.writeFile(path, yaml, 'utf8');
}
