import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { buildVideoIngestPlan, validateVideoInput } from '../video-ingest.js';

test('accepts mp4 and webm inputs', () => {
  assert.equal(validateVideoInput('ticket/PAC2-999-demo/demo.mp4'), '.mp4');
  assert.equal(validateVideoInput('ticket/PAC2-999-demo/demo.WEBM'), '.webm');
});

test('rejects unsupported video inputs', () => {
  assert.throws(() => validateVideoInput('demo.mov'), /Only \.mp4 and \.webm/);
});

test('builds safe ffmpeg argument arrays under durable ticket output', () => {
  const output = path.resolve('docs/tickets/PAC2-999-demo/video');
  const plan = buildVideoIngestPlan(path.resolve('ticket/PAC2-999-demo/demo.mp4'), output);
  assert.equal(plan.timelinePath, path.join(output, 'timeline.md'));
  assert.equal(plan.contactSheetPath, path.join(output, 'contact-sheet.webp'));
  assert.equal(plan.framePattern, path.join(output, 'frames', 'frame-%04d.webp'));
  assert.deepEqual(plan.probe.command, 'ffprobe');
  assert.ok(plan.probe.args.includes('-show_frames'));
  assert.deepEqual(plan.extract.command, 'ffmpeg');
  assert.ok(plan.extract.args.some((arg) => arg.includes('gt(scene')));
  assert.deepEqual(plan.contactSheet.command, 'ffmpeg');
});

test('rejects output outside docs/tickets', () => {
  assert.throws(
    () => buildVideoIngestPlan(path.resolve('ticket/PAC2-999-demo/demo.mp4'), path.resolve('test-results/video')),
    /docs\/tickets/,
  );
});
