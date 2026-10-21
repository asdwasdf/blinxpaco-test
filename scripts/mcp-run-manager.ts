/**
 * MCP Run Manager - Provides isolation for concurrent ticket execution
 *
 * Usage:
 *   import { McpRunManager } from './mcp-run-manager.js';
 *
 *   const manager = new McpRunManager();
 *   const run = await manager.createRun('PAC2-1234');
 *   // run.port, run.userDataDir, run.storageState
 *   await manager.cleanupRun('PAC2-1234');
 */

import { spawn, ChildProcess } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import crypto from 'node:crypto';

export interface McpRun {
  runId: string;
  port: number;
  userDataDir: string;
  storageState: string;
  process?: ChildProcess;
  createdAt: Date;
}

export interface RunMetadata {
  runId: string;
  ticketId: string;
  port: number;
  pid?: number;
  createdAt: string;
  status: 'starting' | 'running' | 'stopped';
}

const RUNS_DIR = 'playwright/.mcp-runs';
const METADATA_FILE = 'playwright/.mcp-runs/metadata.json';
const BASE_PORT = 3200;
const MAX_CONCURRENT_RUNS = 10;

export class McpRunManager {
  private runs: Map<string, McpRun> = new Map();
  private usedPorts: Set<number> = new Set();
  private metadataPath: string;

  constructor() {
    this.metadataPath = path.resolve(process.cwd(), METADATA_FILE);
    this.ensureRunsDir();
    this.loadMetadata();
  }

  private ensureRunsDir(): void {
    const dir = path.dirname(this.metadataPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private loadMetadata(): void {
    try {
      if (fs.existsSync(this.metadataPath)) {
        const data = fs.readFileSync(this.metadataPath, 'utf-8');
        const metadata: RunMetadata[] = JSON.parse(data);

        // Mark any runs that weren't properly cleaned up
        for (const run of metadata) {
          if (run.status === 'running' || run.status === 'starting') {
            this.usedPorts.add(run.port);
          }
        }
      }
    } catch {
      // Ignore errors, start fresh
    }
  }

  /**
   * Re-read metadata from disk to get current state
   * Use this before finding available port in separate process
   */
  private syncFromDisk(): void {
    this.usedPorts.clear();
    this.loadMetadata();
  }

  private saveMetadata(run: RunMetadata): void {
    try {
      let metadata: RunMetadata[] = [];
      if (fs.existsSync(this.metadataPath)) {
        const data = fs.readFileSync(this.metadataPath, 'utf-8');
        metadata = JSON.parse(data);
      }

      // Update or add
      const idx = metadata.findIndex(m => m.runId === run.runId);
      if (idx >= 0) {
        metadata[idx] = run;
      } else {
        metadata.push(run);
      }

      fs.writeFileSync(this.metadataPath, JSON.stringify(metadata, null, 2));
    } catch (e) {
      console.error('[McpRunManager] Failed to save metadata:', e);
    }
  }

  private findAvailablePort(): number {
    // Find port in range BASE_PORT to BASE_PORT + MAX_CONCURRENT_RUNS
    for (let port = BASE_PORT; port < BASE_PORT + MAX_CONCURRENT_RUNS; port++) {
      if (!this.usedPorts.has(port)) {
        return port;
      }
    }
    throw new Error(`No available ports in range ${BASE_PORT}-${BASE_PORT + MAX_CONCURRENT_RUNS}`);
  }

  private generateRunId(ticketId: string): string {
    const timestamp = Date.now();
    const shortHash = crypto.randomBytes(3).toString('hex');
    return `${ticketId}-${timestamp}-${shortHash}`;
  }

  /**
   * Create a new isolated run for a ticket
   * Uses file locking to prevent race conditions
   */
  async createRun(ticketId: string): Promise<McpRun> {
    const runId = this.generateRunId(ticketId);

    // Create run object first
    const runsDir = path.resolve(process.cwd(), RUNS_DIR);
    const userDataDir = path.join(runsDir, runId, 'browser-data');
    const storageState = path.join(runsDir, runId, 'session.json');

    // Create directories
    fs.mkdirSync(userDataDir, { recursive: true });

    // Atomically reserve a port by writing metadata first
    // This prevents race conditions with concurrent processes
    let port: number;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      // Re-read metadata each attempt to get latest state
      this.syncFromDisk();
      port = this.findAvailablePort();

      // Try to reserve by writing metadata
      const reserved = this.tryReservePort(runId, ticketId, port);
      if (reserved) {
        break;
      }
      attempts++;
    } while (attempts < maxAttempts);

    if (!port) {
      throw new Error(`Failed to reserve port after ${maxAttempts} attempts`);
    }

    const run: McpRun = {
      runId,
      port,
      userDataDir,
      storageState,
      createdAt: new Date(),
    };

    this.runs.set(runId, run);
    this.usedPorts.add(port);

    console.log(`[McpRunManager] Created run ${runId} on port ${port}`);
    return run;
  }

  /**
   * Try to reserve a port by atomically writing metadata
   * Returns true if successful, false if port was taken
   */
  private tryReservePort(runId: string, ticketId: string, port: number): boolean {
    try {
      // Read current metadata
      let metadata: RunMetadata[] = [];
      if (fs.existsSync(this.metadataPath)) {
        const data = fs.readFileSync(this.metadataPath, 'utf-8');
        metadata = JSON.parse(data);
      }

      // Check if port is already taken
      const portInUse = metadata.some(m =>
        (m.status === 'starting' || m.status === 'running') && m.port === port
      );

      if (portInUse) {
        return false;
      }

      // Reserve the port by adding our entry
      metadata.push({
        runId,
        ticketId,
        port,
        createdAt: new Date().toISOString(),
        status: 'starting',
      });

      // Write back atomically (write to temp then rename)
      const tempPath = this.metadataPath + '.tmp';
      fs.writeFileSync(tempPath, JSON.stringify(metadata, null, 2));
      fs.renameSync(tempPath, this.metadataPath);

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Register an MCP process for a run
   */
  registerProcess(runId: string, process: ChildProcess): void {
    const run = this.runs.get(runId);
    if (run) {
      run.process = process;

      if (process.pid) {
        this.saveMetadata({
          runId,
          ticketId: runId.split('-')[0], // Extract ticket prefix
          port: run.port,
          pid: process.pid,
          createdAt: run.createdAt.toISOString(),
          status: 'running',
        });
      }
    }
  }

  /**
   * Get run by ticket ID (returns most recent)
   */
  getRunByTicket(ticketId: string): McpRun | undefined {
    let latest: McpRun | undefined;
    for (const run of this.runs.values()) {
      if (run.runId.startsWith(ticketId)) {
        if (!latest || run.createdAt > latest.createdAt) {
          latest = run;
        }
      }
    }
    return latest;
  }

  /**
   * Get all active runs
   */
  getActiveRuns(): McpRun[] {
    // Read directly from metadata to get current state across processes
    try {
      if (fs.existsSync(this.metadataPath)) {
        const data = fs.readFileSync(this.metadataPath, 'utf-8');
        const metadata: RunMetadata[] = JSON.parse(data);

        return metadata
          .filter(m => m.status === 'starting' || m.status === 'running')
          .map(m => ({
            runId: m.runId,
            port: m.port,
            userDataDir: path.join(path.resolve(process.cwd(), RUNS_DIR), m.runId, 'browser-data'),
            storageState: path.join(path.resolve(process.cwd(), RUNS_DIR), m.runId, 'session.json'),
            createdAt: new Date(m.createdAt),
          }));
      }
    } catch {
      // Ignore errors
    }
    return [];
  }

  /**
   * Clean up a specific run
   */
  async cleanupRun(runId: string): Promise<void> {
    // First check memory
    let run = this.runs.get(runId);

    // If not in memory, try to load from metadata
    if (!run) {
      try {
        if (fs.existsSync(this.metadataPath)) {
          const data = fs.readFileSync(this.metadataPath, 'utf-8');
          const metadata: RunMetadata[] = JSON.parse(data);
          const meta = metadata.find(m => m.runId === runId);
          if (meta) {
            run = {
              runId: meta.runId,
              port: meta.port,
              userDataDir: path.join(path.resolve(process.cwd(), RUNS_DIR), meta.runId, 'browser-data'),
              storageState: path.join(path.resolve(process.cwd(), RUNS_DIR), meta.runId, 'session.json'),
              createdAt: new Date(meta.createdAt),
            };
          }
        }
      } catch {
        // Ignore
      }
    }

    if (!run) {
      console.log(`[McpRunManager] Run ${runId} not found, skipping cleanup`);
      return;
    }

    // Kill process if still running (using recorded PID)
    try {
      if (fs.existsSync(this.metadataPath)) {
        const data = fs.readFileSync(this.metadataPath, 'utf-8');
        const metadata: RunMetadata[] = JSON.parse(data);
        const meta = metadata.find(m => m.runId === runId);
        if (meta?.pid) {
          try {
            process.kill(meta.pid, 'SIGTERM');
          } catch {
            // Process may have already exited
          }
        }
      }
    } catch {
      // Ignore PID lookup errors
    }

    // Release port
    this.usedPorts.delete(run.port);

    // Update metadata to stopped
    try {
      if (fs.existsSync(this.metadataPath)) {
        let metadata: RunMetadata[] = [];
        const data = fs.readFileSync(this.metadataPath, 'utf-8');
        metadata = JSON.parse(data);

        const idx = metadata.findIndex(m => m.runId === runId);
        if (idx >= 0) {
          metadata[idx].status = 'stopped';
          fs.writeFileSync(this.metadataPath, JSON.stringify(metadata, null, 2));
        }
      }
    } catch {
      // Ignore metadata errors
    }

    // Remove from memory
    this.runs.delete(runId);

    console.log(`[McpRunManager] Cleaned up run ${runId}`);
  }

  /**
   * Clean up all runs (for shutdown)
   */
  async cleanupAll(): Promise<void> {
    const runIds = Array.from(this.runs.keys());
    for (const runId of runIds) {
      await this.cleanupRun(runId);
    }
  }

  /**
   * Check if a port is available
   */
  isPortAvailable(port: number): boolean {
    return !this.usedPorts.has(port);
  }

  /**
   * Get port allocation info for debugging
   */
  getPortAllocation(): Record<number, string> {
    const allocation: Record<number, string> = {};

    // Read directly from metadata file to get current state across processes
    try {
      if (fs.existsSync(this.metadataPath)) {
        const data = fs.readFileSync(this.metadataPath, 'utf-8');
        const metadata: RunMetadata[] = JSON.parse(data);

        for (const run of metadata) {
          if (run.status === 'starting' || run.status === 'running') {
            allocation[run.port] = run.runId;
          }
        }
      }
    } catch {
      // Ignore errors
    }

    return allocation;
  }
}

// Singleton instance
let managerInstance: McpRunManager | null = null;

export function getMcpRunManager(): McpRunManager {
  if (!managerInstance) {
    managerInstance = new McpRunManager();
  }
  return managerInstance;
}

export function createMcpRun(ticketId: string): Promise<McpRun> {
  return getMcpRunManager().createRun(ticketId);
}

export function cleanupMcpRun(runId: string): Promise<void> {
  return getMcpRunManager().cleanupRun(runId);
}

/**
 * Cleanup all stale runs (marked starting/running but process died)
 */
export async function cleanupStaleRuns(): Promise<number> {
  const manager = getMcpRunManager();

  // Read directly from metadata
  let metadataPath = path.resolve(process.cwd(), METADATA_FILE);
  if (!fs.existsSync(metadataPath)) {
    return 0;
  }

  const data = fs.readFileSync(metadataPath, 'utf-8');
  const allMetadata: RunMetadata[] = JSON.parse(data);
  const stale = allMetadata.filter(m => m.status === 'starting' || m.status === 'running');

  let count = 0;
  for (const run of stale) {
    // Check if process is still alive by PID
    if (run.pid) {
      try {
        process.kill(run.pid, 0); // Signal 0 = check if exists
        // Still alive, skip
        continue;
      } catch {
        // Process dead, cleanup
      }
    }

    await manager.cleanupRun(run.runId);
    count++;
  }

  return count;
}
