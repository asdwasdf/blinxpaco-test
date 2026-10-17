import { mkdir, readFile, writeFile, appendFile } from 'node:fs/promises';
import { join } from 'node:path';

export interface LedgerEntry {
  timestamp: string;
  ticket_key: string;
  env: string;
  host: string;
  skill: string;
  action_class: string;
  target: string;
  scope_ref: string;
  test_data: string;
  source: 'manifest' | 'status';
  result: 'executed' | 'blocked' | 'failed' | 'cleanup-done';
  leftover?: string;
}

function ledgerPath(ticketKey: string): string {
  const base = process.env.PACO_TICKET_OUTPUT ?? 'docs/tickets';
  return join(base, ticketKey, 'mutation-ledger.md');
}

const HEADER_ROW = '| timestamp | ticket | env | host | skill | class | target | scope | data | source | result | leftover |';
const SEPARATOR_ROW = '|---|---|---|---|---|---|---|---|---|---|---|---|';

export async function appendLedgerEntry(
  ticketKey: string,
  entry: Omit<LedgerEntry, 'timestamp' | 'ticket_key'>,
): Promise<void> {
  const full: LedgerEntry = { ...entry, timestamp: new Date().toISOString(), ticket_key: ticketKey };
  const p = ledgerPath(ticketKey);
  await mkdir(join(p, '..'), { recursive: true });
  const existing = await readFile(p, 'utf8').catch(() => '');
  if (!existing) {
    await writeFile(p, `# Mutation ledger\n\n${HEADER_ROW}\n${SEPARATOR_ROW}\n`, 'utf8');
  }
  const cells = [
    full.timestamp, full.ticket_key, full.env, full.host, full.skill,
    full.action_class, full.target, full.scope_ref, full.test_data,
    full.source, full.result, full.leftover ?? '',
  ].map((c) => String(c).replace(/\|/g, '\\|'));
  await appendFile(p, `| ${cells.join(' | ')} |\n`, 'utf8');
}

export async function readLedger(ticketKey: string): Promise<LedgerEntry[]> {
  const p = ledgerPath(ticketKey);
  const text = await readFile(p, 'utf8').catch(() => '');
  const lines = text.split('\n').filter((l) => l.startsWith('|') && !l.startsWith('|---') && !l.startsWith('| timestamp'));
  return lines.map((l) => {
    const cells = l.split('|').map((c) => c.trim().replace(/\\\|/g, '|')).filter(Boolean);
    return {
      timestamp: cells[0],
      ticket_key: cells[1],
      env: cells[2],
      host: cells[3],
      skill: cells[4],
      action_class: cells[5],
      target: cells[6],
      scope_ref: cells[7],
      test_data: cells[8],
      source: cells[9] as 'manifest' | 'status',
      result: cells[10] as LedgerEntry['result'],
      leftover: cells[11] || undefined,
    };
  });
}
