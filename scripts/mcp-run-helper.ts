/**
 * MCP Run Helper - Provides run-specific MCP launch arguments
 *
 * Usage:
 *   import { getMcpArgs } from './mcp-run-helper.js';
 *
 *   const args = await getMcpArgs('PAC2-1234');
 *   // args = ['@playwright/mcp@latest', '--port', '3201', '--user-data-dir', '...', '--storage-state', '...']
 */

import { McpRunManager, getMcpRunManager, McpRun } from './mcp-run-manager.js';

export interface McpLaunchConfig {
  port: number;
  userDataDir: string;
  storageState: string;
  runId: string;
}

/**
 * Get MCP launch arguments for a specific ticket run
 *
 * This enables concurrent ticket execution by:
 * 1. Allocating a unique port per run
 * 2. Using isolated browser data directory
 * 3. Using isolated session storage
 */
export async function getMcpLaunchConfig(ticketId: string): Promise<McpLaunchConfig> {
  const run = await getMcpRunManager().createRun(ticketId);

  return {
    port: run.port,
    userDataDir: run.userDataDir,
    storageState: run.storageState,
    runId: run.runId,
  };
}

/**
 * Get CLI arguments to spawn @playwright/mcp with isolated resources
 */
export function getMcpArgs(config: McpLaunchConfig): string[] {
  return [
    'npx',
    '@playwright/mcp@latest',
    '--port', String(config.port),
    '--user-data-dir', config.userDataDir,
    '--storage-state', config.storageState,
  ];
}

/**
 * Clean up a run after testing is complete
 */
export async function cleanupRun(runId: string): Promise<void> {
  await getMcpRunManager().cleanupRun(runId);
}

/**
 * Get all active runs for debugging
 */
export function getActiveRuns(): McpRun[] {
  return getMcpRunManager().getActiveRuns();
}

/**
 * Check if a port is available
 */
export function isPortAvailable(port: number): boolean {
  return getMcpRunManager().isPortAvailable(port);
}

/**
 * Get port allocation for debugging
 */
export function getPortAllocation(): Record<number, string> {
  return getMcpRunManager().getPortAllocation();
}

// CLI export for manual use
export async function main(): Promise<void> {
  const command = process.argv[2];

  switch (command) {
    case 'create': {
      const ticketId = process.argv[3] || 'TEST';
      const config = await getMcpLaunchConfig(ticketId);
      console.log(JSON.stringify(config, null, 2));
      break;
    }

    case 'cleanup': {
      const runId = process.argv[3];
      if (!runId) {
        console.error('Usage: mcp-run-helper.ts cleanup <runId>');
        process.exit(1);
      }
      await cleanupRun(runId);
      console.log(`Cleaned up ${runId}`);
      break;
    }

    case 'list': {
      const runs = getActiveRuns();
      console.log('Active runs:');
      for (const run of runs) {
        console.log(`  ${run.runId}: port=${run.port}, pid=${run.process?.pid || 'N/A'}`);
      }
      break;
    }

    case 'ports': {
      const allocation = getPortAllocation();
      console.log('Port allocation:');
      for (const [port, runId] of Object.entries(allocation)) {
        console.log(`  ${port}: ${runId}`);
      }
      break;
    }

    case 'cleanup-all': {
      // Cleanup all runs marked as 'starting' or 'running' (stale)
      const { cleanupStaleRuns } = await import('./mcp-run-manager.js');
      const cleaned = await cleanupStaleRuns();
      console.log(`[McpRunManager] Cleaned up ${cleaned} stale runs`);
      break;
    }

    default:
      console.log(`
MCP Run Manager CLI

Commands:
  create <ticketId>  - Create a new isolated run
  cleanup <runId>    - Clean up a specific run
  list               - List all active runs
  ports              - Show port allocation

Usage in code:
  import { getMcpLaunchConfig, cleanupRun } from './mcp-run-helper.js';

  // Create isolated resources
  const config = await getMcpLaunchConfig('PAC2-1234');

  // Spawn MCP with unique port
  const mcp = spawn('npx', [
    '@playwright/mcp@latest',
    '--port', String(config.port),
    '--user-data-dir', config.userDataDir,
    '--storage-state', config.storageState,
  ], { stdio: 'inherit' });

  // On cleanup
  await cleanupRun(config.runId);
`);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
