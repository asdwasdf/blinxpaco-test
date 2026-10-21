# MCP Isolation for Concurrent QA Execution

## Problem

When running multiple QA tickets concurrently, Playwright MCP instances can conflict over:
- TCP ports (fixed 3101, 3102 in `.mcp.json`)
- Browser user-data directories
- Browser sessions/contexts

## Solution

The `scripts/mcp-run-manager.ts` and `scripts/mcp-run-helper.ts` provide:

1. **Unique port allocation** - Each run gets an isolated port (3200-3209)
2. **Isolated browser directories** - Each run has its own `browser-data` folder
3. **Process tracking** - PIDs are recorded for safe cleanup
4. **Metadata persistence** - Run state survives restarts

## Usage

### In Code

```typescript
import { getMcpLaunchConfig, cleanupRun } from './scripts/mcp-run-helper.js';

// Create isolated resources for a ticket
const config = await getMcpLaunchConfig('PAC2-1234');

// Use in MCP spawn:
const mcp = spawn('npx', [
  '@playwright/mcp@latest',
  '--port', String(config.port),
  '--user-data-dir', config.userDataDir,
  '--storage-state', config.storageState,
], { stdio: 'inherit' });

// Clean up when done
await cleanupRun(config.runId);
```

### CLI Commands

```bash
# Create a new run
node --loader ts-node/esm scripts/mcp-run-helper.ts create PAC2-1234

# List active runs
node --loader ts-node/esm scripts/mcp-run-helper.ts list

# Show port allocation
node --loader ts-node/esm scripts/mcp-run-helper.ts ports

# Clean up a run
node --loader ts-node/esm scripts/mcp-run-helper.ts cleanup <runId>
```

## Architecture

```
playwright/.mcp-runs/
├── metadata.json           # Run metadata (persisted)
├── PAC2-1234-1697712345-a1b2c3/
│   ├── browser-data/       # Isolated Chrome profile
│   └── session.json        # Auth session
├── PAC2-5678-1697712346-d4e5f6/
│   ├── browser-data/
│   └── session.json
└── ...
```

## Port Allocation

- Base: 3200
- Max concurrent: 10 (3200-3209)
- Ports are tracked in memory and metadata file

## Safety

- Never kills process by name alone
- Only kills processes spawned by this manager
- Cleanup is idempotent
- Metadata prevents orphan cleanup
