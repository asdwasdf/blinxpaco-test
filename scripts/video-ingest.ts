import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCENE_THRESHOLD = 0.2;
const MAX_FRAME_INTERVAL_SECONDS = 2;

export interface VideoCommand {
  command: 'ffmpeg' | 'ffprobe';
  args: string[];
}

export interface VideoIngestPlan {
  inputPath: string;
  outputDir: string;
  timelinePath: string;
  contactSheetPath: string;
  framePattern: string;
  probe: VideoCommand;
  extract: VideoCommand;
  fallback: VideoCommand;
  contactSheet: VideoCommand;
}

export function validateVideoInput(inputPath: string): '.mp4' | '.webm' {
  const extension = path.extname(inputPath).toLowerCase();
  if (extension !== '.mp4' && extension !== '.webm') {
    throw new Error('Only .mp4 and .webm ticket videos are supported');
  }
  return extension;
}

function isInside(parent: string, child: string): boolean {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

export function buildContactSheetCommand(framePattern: string, contactSheetPath: string, frameCount: number): VideoCommand {
  const columns = Math.min(3, Math.max(1, frameCount));
  const rows = Math.max(1, Math.ceil(frameCount / columns));
  return {
    command: 'ffmpeg',
    args: ['-y', '-i', framePattern, '-vf', `scale=480:-1,tile=${columns}x${rows}:padding=8:margin=8`, '-frames:v', '1', '-c:v', 'libwebp', contactSheetPath],
  };
}

export function buildVideoIngestPlan(inputPath: string, outputDir: string): VideoIngestPlan {
  validateVideoInput(inputPath);
  const resolvedInput = path.resolve(inputPath);
  const resolvedOutput = path.resolve(outputDir);
  const durableRoot = path.resolve('docs/tickets');
  if (!isInside(durableRoot, resolvedOutput)) {
    throw new Error('Video output must be inside docs/tickets/');
  }

  const framesDir = path.join(resolvedOutput, 'frames');
  const framePattern = path.join(framesDir, 'frame-%04d.webp');
  const contactSheetPath = path.join(resolvedOutput, 'contact-sheet.webp');
  return {
    inputPath: resolvedInput,
    outputDir: resolvedOutput,
    timelinePath: path.join(resolvedOutput, 'timeline.md'),
    contactSheetPath,
    framePattern,
    probe: {
      command: 'ffprobe',
      args: ['-v', 'error', '-show_format', '-show_streams', '-select_streams', 'v:0', '-of', 'json', resolvedInput],
    },
    extract: {
      command: 'ffmpeg',
      args: ['-i', resolvedInput, '-vf', `select='isnan(prev_selected_t)+gt(scene,${SCENE_THRESHOLD})+gte(t-prev_selected_t,${MAX_FRAME_INTERVAL_SECONDS})',showinfo`, '-vsync', 'vfr', '-c:v', 'libwebp', framePattern],
    },
    fallback: {
      command: 'ffmpeg',
      args: ['-i', resolvedInput, '-frames:v', '1', '-c:v', 'libwebp', path.join(framesDir, 'frame-0001.webp')],
    },
    contactSheet: buildContactSheetCommand(framePattern, contactSheetPath, 1),
  };
}

function run(command: VideoCommand): { stdout: string; stderr: string } {
  const result = spawnSync(command.command, command.args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  if ((result.error as NodeJS.ErrnoException | undefined)?.code === 'ENOENT') {
    throw new Error(`${command.command} is required. Install FFmpeg and ensure it is available on PATH.`);
  }
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr || `${command.command} failed`);
  return { stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
}

export function parseShowinfoTimestamps(output: string): number[] {
  return [...output.matchAll(/pts_time:([0-9]+(?:\.[0-9]+)?)/g)].map((match) => Number(match[1]));
}

function formatTimestamp(seconds: number): string {
  const milliseconds = Math.round(seconds * 1000);
  const hours = Math.floor(milliseconds / 3_600_000);
  const minutes = Math.floor((milliseconds % 3_600_000) / 60_000);
  const remainder = milliseconds % 60_000;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(Math.floor(remainder / 1000)).padStart(2, '0')}.${String(remainder % 1000).padStart(3, '0')}`;
}

export function buildTimeline(plan: VideoIngestPlan, metadata: string, timestamps: number[]): string {
  const parsed = JSON.parse(metadata) as { format?: { duration?: string }; streams?: Array<{ width?: number; height?: number; codec_name?: string }> };
  const stream = parsed.streams?.[0] ?? {};
  const rows = timestamps.map((timestamp, index) => `| \`frames/frame-${String(index + 1).padStart(4, '0')}.webp\` | \`${formatTimestamp(timestamp)}\` | Unreviewed |  |  |  |  |`).join('\n') || '| `frames/frame-0001.webp` | `00:00:00.000` | Unreviewed (fallback first frame) |  |  |  |  |';
  return `# Video timeline\n\n**Source:** \`${path.basename(plan.inputPath)}\`  \n**Duration:** ${parsed.format?.duration ?? 'Unknown'} seconds  \n**Video:** ${stream.codec_name ?? 'Unknown'}, ${stream.width ?? '?'}x${stream.height ?? '?'}\n\n## Contact sheet\n\n![Contact sheet](contact-sheet.webp)\n\n## Timeline\n\n| Frame | Timestamp | Review status | Environment | Role | Visual observation | Evidence |\n|---|---:|---|---|---|---|---|\n${rows}\n\nFrame timestamps are technical extraction aids. Record \`Observed\` only after visual review adds environment, role, observation and evidence reference.\n\n## Open questions\n\n- Review each frame before using it as requirement evidence.\n\n## Tester notes\n\n[Protected area]\n`;
}

export function ingestVideo(inputPath: string, outputDir: string): VideoIngestPlan {
  if (!existsSync(inputPath)) throw new Error(`Video not found: ${inputPath}`);
  const plan = buildVideoIngestPlan(inputPath, outputDir);
  if (existsSync(plan.timelinePath) && !readFileSync(plan.timelinePath, 'utf8').includes('## Tester notes')) {
    throw new Error(`Protected timeline missing final ## Tester notes: ${plan.timelinePath}`);
  }
  const protectedNotes = existsSync(plan.timelinePath)
    ? readFileSync(plan.timelinePath, 'utf8').slice(readFileSync(plan.timelinePath, 'utf8').lastIndexOf('## Tester notes'))
    : '## Tester notes\n\n[Protected area]\n';
  const framesDir = path.dirname(plan.framePattern);
  mkdirSync(framesDir, { recursive: true });
  for (const file of readdirSync(framesDir)) if (/^frame-\d{4}\.webp$/.test(file)) rmSync(path.join(framesDir, file));
  const metadata = run(plan.probe).stdout;
  const extraction = run(plan.extract);
  let timestamps = parseShowinfoTimestamps(extraction.stderr);
  if (!existsSync(path.join(framesDir, 'frame-0001.webp'))) {
    run(plan.fallback);
    timestamps = [];
  }
  const frameCount = readdirSync(framesDir).filter((file) => /^frame-\d{4}\.webp$/.test(file)).length;
  if (!frameCount) throw new Error(`No frames extracted: ${plan.inputPath}`);
  run(buildContactSheetCommand(plan.framePattern, plan.contactSheetPath, frameCount));
  writeFileSync(plan.timelinePath, `${buildTimeline(plan, metadata, timestamps).split('## Tester notes')[0]}${protectedNotes}`, 'utf8');
  return plan;
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  const [inputPath, outputDir] = process.argv.slice(2);
  if (!inputPath || !outputDir) {
    throw new Error('Usage: npm run video:ingest -- <input.mp4|input.webm> <docs/tickets/<ticket>/video>');
  }
  ingestVideo(inputPath, outputDir);
}
