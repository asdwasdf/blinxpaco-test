import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildProductGraph, parseSurveyView, renderMermaid } from '../generate-product-graph.js';

const view = `---
id: quick-send
title: Quick Send
roles: [Receptionist]
environment: dev
status: Confirmed
routes: [patient-search]
controls:
  - name: Send
    kind: mutation
verified_by: [PAC2-4700]
last_observed: 2026-09-19
---

# Quick Send
`;

test('parses strict survey view frontmatter', () => {
  const parsed = parseSurveyView(view, 'quick-send.md');
  assert.equal(parsed.id, 'quick-send');
  assert.equal(parsed.status, 'Confirmed');
  assert.deepEqual(parsed.controls, [{ name: 'Send', kind: 'mutation' }]);
});

test('rejects missing fields and invalid provenance', () => {
  assert.throws(() => parseSurveyView(view.replace('title: Quick Send\n', ''), 'missing.md'), /title/);
  assert.throws(() => parseSurveyView(view.replace('status: Confirmed', 'status: Certain'), 'bad.md'), /status/);
});

test('builds deterministic graph and reports dangling routes', () => {
  const patient = parseSurveyView(view.replace('id: quick-send', 'id: patient-search').replace('title: Quick Send', 'title: Patient Search').replace('routes: [patient-search]', 'routes: []'), 'patient.md');
  const quick = parseSurveyView(view, 'quick.md');
  const graph = buildProductGraph([quick, patient]);
  assert.deepEqual(graph.views.map((item) => item.id), ['patient-search', 'quick-send']);
  assert.deepEqual(graph.danglingRoutes, []);
  assert.match(renderMermaid(graph), /patient-search --> quick-send/);
});

test('rejects duplicate view ids', () => {
  const parsed = parseSurveyView(view, 'quick.md');
  assert.throws(() => buildProductGraph([parsed, parsed]), /Duplicate survey view id/);
});
