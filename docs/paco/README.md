# PACO Flows & Tickets

Replay-based QA knowledge base from historical Jira Done tickets.

## Structure

```
docs/paco/
├── replay/          # Batch checkpoints (YYYYMMDD-batch-id.replay.yaml)
├── tickets/         # Per-ticket replay records
│   └── <ticket-key>/
│       ├── replay.md
│       ├── requirements.md
│       ├── scenarios.md
│       └── evidence/
├── flows/           # Deduplicated flow documentation
│   └── <flow-slug>.md
└── index/           # Searchable indexes
    ├── tickets.md
    └── flows.md
```

## Usage

### Initialize batch

```bash
npm run paco:replay -- init --batch-id <id> [--batch-size N] [--environment dev]
```

### Fetch Done tickets

```bash
npm run paco:replay -- fetch --batch-id <id>
```

### Check status

```bash
npm run paco:replay -- status --batch-id <id>
```

### Resume pending

```bash
npm run paco:replay -- resume --batch-id <id>
```

### Finalize batch

```bash
npm run paco:replay -- finalize --batch-id <id>
```

### Run replay skill

```bash
# In Claude Code with Playwright plugin tab authenticated:
/paco-ticket-replay
```

## Integration

Reuses:
- `paco-discover`: CLI state management, checkpoint, mutation ledger
- `paco-verify-flow`: mutation gate, auth pattern, evidence handling
- `paco-playwright`: spec generation, CLI execution
- `paco-requirements`: atomic requirements extraction
- `paco-test-design`: scenario reconstruction, mutation class

Output integrates with:
- `docs/product/feature-map.md` (route updates)
- `docs/product/workflows/` (flow documentation)
- `docs/tickets/` (per-ticket evidence)
