import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { buildContactSheetCommand, buildTimeline, buildVideoIngestPlan, parseShowinfoTimestamps, validateVideoInput } from '../video-ingest.js';

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
  assert.ok(!plan.probe.args.includes('-show_frames'));
  assert.deepEqual(plan.extract.command, 'ffmpeg');
  assert.ok(plan.extract.args.some((arg) => arg.includes('gt(scene')));
  assert.ok(plan.extract.args.some((arg) => arg.includes('gte(t-prev_selected_t,2)')));
  assert.deepEqual(plan.contactSheet.command, 'ffmpeg');
});

test('uses a numbered frame sequence for contact sheets', () => {
  const plan = buildVideoIngestPlan(
    path.resolve('ticket/PAC2-999-demo/demo.mp4'),
    path.resolve('docs/tickets/PAC2-999-demo/video'),
  );

  assert.ok(plan.contactSheet.args.includes(path.join(plan.outputDir, 'frames', 'frame-%04d.webp')));
  assert.ok(plan.contactSheet.args.includes('-y'));
  assert.ok(!plan.contactSheet.args.includes('-stream_loop'));
  assert.ok(!plan.contactSheet.args.includes('-pattern_type'));
});

test('uses the static WebP encoder for image outputs', () => {
  const plan = buildVideoIngestPlan(
    path.resolve('ticket/PAC2-999-demo/demo.mp4'),
    path.resolve('docs/tickets/PAC2-999-demo/video'),
  );

  for (const command of [plan.extract, plan.fallback, plan.contactSheet]) {
    assert.ok(command.args.includes('-c:v'));
    assert.equal(command.args[command.args.indexOf('-c:v') + 1], 'libwebp');
  }
});

test('parses selected frame timestamps from showinfo', () => {
  assert.deepEqual(
    parseShowinfoTimestamps('[Parsed_showinfo_1 @ x] n: 0 pts: 0 pts_time:0.000000\n[Parsed_showinfo_1 @ x] n: 1 pts: 47500 pts_time:1.900000\n'),
    [0, 1.9],
  );
});

test('builds an unreviewed timestamped timeline', () => {
  const plan = buildVideoIngestPlan(
    path.resolve('ticket/PAC2-999-demo/demo.mp4'),
    path.resolve('docs/tickets/PAC2-999-demo/video'),
  );
  const markdown = buildTimeline(plan, '{"format":{"duration":"2"},"streams":[{"codec_name":"h264","width":1920,"height":1080}]}', [1.9]);

  assert.match(markdown, /\| `frames\/frame-0001\.webp` \| `00:00:01\.900` \| Unreviewed/);
  assert.doesNotMatch(markdown, /\| Observed \|/);
});

test('builds a non-looping contact sheet for actual frames', () => {
  const command = buildContactSheetCommand('/tmp/frames/frame-%04d.webp', '/tmp/contact-sheet.webp', 1);

  assert.ok(!command.args.includes('-stream_loop'));
  assert.ok(command.args.includes('scale=480:-1,tile=1x1:padding=8:margin=8'));
});

test('rejects output outside docs/tickets', () => {
  assert.throws(
    () => buildVideoIngestPlan(path.resolve('ticket/PAC2-999-demo/demo.mp4'), path.resolve('test-results/video')),
    /docs\/tickets/,
  );
});
