import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCENE_THRESHOLD = 0.2;

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
      args: ['-v', 'error', '-show_format', '-show_streams', '-show_frames', '-select_streams', 'v:0', '-of', 'json', resolvedInput],
    },
    extract: {
      command: 'ffmpeg',
      args: ['-i', resolvedInput, '-vf', `select='gt(scene,${SCENE_THRESHOLD})',showinfo`, '-vsync', 'vfr', framePattern],
    },
    fallback: {
      command: 'ffmpeg',
      args: ['-i', resolvedInput, '-frames:v', '1', path.join(framesDir, 'frame-0001.webp')],
    },
    contactSheet: {
      command: 'ffmpeg',
      args: ['-pattern_type', 'glob', '-i', path.join(framesDir, 'frame-*.webp'), '-vf', 'scale=480:-1,tile=3x0:padding=8:margin=8', '-frames:v', '1', contactSheetPath],
    },
  };
}

function run(command: VideoCommand): string {
  try {
    return execFileSync(command.command, command.args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`${command.command} is required. Install FFmpeg and ensure it is available on PATH.`);
    }
    throw error;
  }
}

function timeline(plan: VideoIngestPlan, metadata: string): string {
  const parsed = JSON.parse(metadata) as { format?: { duration?: string }; streams?: Array<{ width?: number; height?: number; codec_name?: string }> };
  const stream = parsed.streams?.[0] ?? {};
  return `# Video timeline\n\n**Source:** \`${path.basename(plan.inputPath)}\`  \n**Duration:** ${parsed.format?.duration ?? 'Unknown'} seconds  \n**Video:** ${stream.codec_name ?? 'Unknown'}, ${stream.width ?? '?'}x${stream.height ?? '?'}\n\n## Contact sheet\n\n![Contact sheet](contact-sheet.webp)\n\n## Timeline\n\n| Frame | Timestamp | Observation | Provenance | Requirement/Test |\n|---|---:|---|---|---|\n| \`frames/frame-0001.webp\` | Review with frame metadata |  | Observed |  |\n\n## Open questions\n\n- None recorded.\n\n## Tester notes\n\n[Protected area]\n`;
}

export function ingestVideo(inputPath: string, outputDir: string): VideoIngestPlan {
  if (!existsSync(inputPath)) throw new Error(`Video not found: ${inputPath}`);
  const plan = buildVideoIngestPlan(inputPath, outputDir);
  if (existsSync(plan.timelinePath) && readFileSync(plan.timelinePath, 'utf8').includes('## Tester notes')) {
    throw new Error(`Protected timeline exists: ${plan.timelinePath}`);
  }
  mkdirSync(path.dirname(plan.framePattern), { recursive: true });
  const metadata = run(plan.probe);
  run(plan.extract);
  if (!existsSync(path.join(plan.outputDir, 'frames', 'frame-0001.webp'))) run(plan.fallback);
  run(plan.contactSheet);
  writeFileSync(plan.timelinePath, timeline(plan, metadata), 'utf8');
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
