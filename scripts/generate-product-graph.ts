import { mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const STATUSES = ['Confirmed', 'Observed', 'Inferred', 'Open Question'] as const;
type Status = (typeof STATUSES)[number];

export interface SurveyControl {
  name: string;
  kind: string;
}

export interface SurveyView {
  id: string;
  title: string;
  roles: string[];
  environment: string;
  status: Status;
  routes: string[];
  controls: SurveyControl[];
  verified_by: string[];
  last_observed: string;
  source: string;
}

export interface ProductGraph {
  generatedAt: string;
  views: SurveyView[];
  edges: Array<{ from: string; to: string; kind: 'route' }>;
  danglingRoutes: Array<{ from: string; to: string }>;
}

function requiredString(value: unknown, field: string, source: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${source}: ${field} must be a non-empty string`);
  return value;
}

function strings(value: unknown, field: string, source: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || !item)) {
    throw new Error(`${source}: ${field} must be an array of strings`);
  }
  return value;
}

export function parseSurveyView(markdown: string, sourcePath: string): SurveyView {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error(`${sourcePath}: YAML frontmatter is required`);
  const data = YAML.parse(match[1]) as Record<string, unknown>;
  const status = requiredString(data.status, 'status', sourcePath);
  if (!STATUSES.includes(status as Status)) throw new Error(`${sourcePath}: status must be ${STATUSES.join(', ')}`);
  if (!Array.isArray(data.controls)) throw new Error(`${sourcePath}: controls must be an array`);
  const controls = data.controls.map((value, index) => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new Error(`${sourcePath}: controls[${index}] must be an object`);
    const control = value as Record<string, unknown>;
    return { name: requiredString(control.name, `controls[${index}].name`, sourcePath), kind: requiredString(control.kind, `controls[${index}].kind`, sourcePath) };
  });
  return {
    id: requiredString(data.id, 'id', sourcePath),
    title: requiredString(data.title, 'title', sourcePath),
    roles: strings(data.roles, 'roles', sourcePath),
    environment: requiredString(data.environment, 'environment', sourcePath),
    status: status as Status,
    routes: strings(data.routes, 'routes', sourcePath),
    controls,
    verified_by: strings(data.verified_by, 'verified_by', sourcePath),
    last_observed: requiredString(String(data.last_observed ?? ''), 'last_observed', sourcePath),
    source: sourcePath.replaceAll('\\', '/'),
  };
}

export function buildProductGraph(input: SurveyView[], generatedAt?: string): ProductGraph {
  const byId = new Map<string, SurveyView>();
  for (const view of input) {
    if (byId.has(view.id)) throw new Error(`Duplicate survey view id: ${view.id}`);
    byId.set(view.id, view);
  }
  const views = [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
  const edges: ProductGraph['edges'] = [];
  const danglingRoutes: ProductGraph['danglingRoutes'] = [];
  for (const target of views) {
    for (const from of [...target.routes].sort()) {
      if (byId.has(from)) edges.push({ from, to: target.id, kind: 'route' });
      else danglingRoutes.push({ from: target.id, to: from });
    }
  }
  const latestObservation = views.map((view) => view.last_observed).sort().at(-1);
  return { generatedAt: generatedAt ?? latestObservation ?? 'empty', views, edges, danglingRoutes };
}

function mermaidId(id: string): string {
  return `v_${Buffer.from(id).toString('hex')}`;
}

export function renderMermaid(graph: ProductGraph): string {
  const lines = ['flowchart LR'];
  for (const view of graph.views) lines.push(`  ${mermaidId(view.id)}["${view.title.replaceAll('"', '&quot;')}"]`);
  for (const edge of graph.edges) lines.push(`  ${mermaidId(edge.from)} --> ${mermaidId(edge.to)} %% ${edge.from} --> ${edge.to}`);
  return `${lines.join('\n')}\n`;
}

function markdownFiles(directory: string): string[] {
  if (!readdirSync(directory, { withFileTypes: true })) return [];
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md')
    .map((entry) => path.join(directory, entry.name));
}

function atomicWrite(target: string, content: string): void {
  const temporary = `${target}.tmp`;
  writeFileSync(temporary, content, 'utf8');
  renameSync(temporary, target);
}

export function generateProductGraph(root = path.resolve('docs/product/survey')): ProductGraph {
  const viewsDir = path.join(root, 'views');
  mkdirSync(viewsDir, { recursive: true });
  const views = markdownFiles(viewsDir).map((file) => parseSurveyView(readFileSync(file, 'utf8'), path.relative(root, file)));
  const graph = buildProductGraph(views);
  atomicWrite(path.join(root, 'graph.json'), `${JSON.stringify(graph, null, 2)}\n`);
  atomicWrite(path.join(root, 'graph.mmd'), renderMermaid(graph));
  return graph;
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) generateProductGraph();
