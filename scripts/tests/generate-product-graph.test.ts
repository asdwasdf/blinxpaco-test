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

const relationshipView = view.replace('status: Confirmed', 'status: Observed').replace('last_observed: 2026-09-19', `last_observed: 2026-09-19
relationships:
  - id: R2
    from: quick-send
    destination_hint: sent-messages
    trigger: Send
    relationship: workflow
    context: [selected patient]
    classification: Inferred
    mutation_boundary: true
    evidence: [E1]
  - id: R1
    from: quick-send
    to: patient-search
    trigger: "Back \\"search\\""
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence: [E1]`);

test('keeps legacy graph fields and adds typed relationships deterministically', () => {
  const patient = parseSurveyView(view.replace('id: quick-send', 'id: patient-search').replace('routes: [patient-search]', 'routes: []'), 'patient.md');
  const graph = buildProductGraph([parseSurveyView(relationshipView, 'quick.md'), patient]);
  assert.deepEqual(graph.edges, [{ from: 'patient-search', to: 'quick-send', kind: 'route' }]);
  assert.deepEqual(graph.relationships.map((item) => item.id), ['R1', 'R2']);
  assert.equal(parseSurveyView(view, 'legacy.md').relationships.length, 0);
});

test('mutation boundaries never render as verified destinations', () => {
  const graph = buildProductGraph([parseSurveyView(relationshipView, 'quick.md')]);
  const mermaid = renderMermaid(graph);
  assert.doesNotMatch(mermaid, /--> .*sent-messages/);
  assert.match(mermaid, /-\.->\|boundary: Send\|/);
  assert.match(mermaid, /&quot;search&quot;/);
});

test('rejects relationships without provenance or with unproven verification', () => {
  assert.throws(() => parseSurveyView(relationshipView.replace('evidence: [E1]', 'evidence: []'), 'bad.md'), /evidence/);
  assert.throws(() => parseSurveyView(relationshipView.replace('classification: Observed', 'classification: Verified-by-Mutation'), 'bad.md'), /reservation_id/);
  assert.throws(() => parseSurveyView(relationshipView.replace('destination_hint: sent-messages', 'to: sent-messages'), 'bad.md'), /boundary/);
});
