---
id: comms-template-manager
title: Communications Hub Template Manager
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - comms-hub-submenu
controls:
  - name: Show Org. Default Templates
    kind: filter
  - name: Create New Email
    kind: mutation
  - name: Create New SMS
    kind: mutation
  - name: Search Templates
    kind: search
  - name: Set Org. Defaults
    kind: mutation
verified_by: []
last_observed: 2026-09-21
---

# Communications Hub Template Manager

## Purpose and context

`Observed`: external Comms Hub dev exposes template management at `/commshub/template-builder`.

## Entry and transitions

Template grid groups `Non-Shared Templates` and `Shared Templates`. The `Viewing data for` selector exposed `Select All (2)`, two checkbox-backed organisation options, one current selection, and `Apply`; it was closed unchanged without applying. Organisation values are omitted. A synthetic no-match search retained only structural/group rows and was cleared. `Columns` and `Filters` panels exposed the documented grid fields and were closed unchanged. Grid headers cover sharing, name, type, communication type, creator organisation, shared organisations, created/updated dates, status, default-template flag and actions. Pagination exposes `First`, `Previous`, `Next`, and `Last`; observed state was page 1 of 1, so no page transition was available.

`Show Org. Default Templates` opened a read-only `Set Organisation Defaults` dialog. It presents `Email`/`SMS` choices across `Invite`, `Confirmation`, `Reminder`, `General News`, and `Guidance & Advice`, with `Cancel` and `Save`. One existing selector was opened without changing its current value: it exposed a searchable option list containing 875 rendered options; option names are omitted. `Escape` closed the list, then `Cancel` closed the dialog unchanged. No template value or default was selected.

With explicit approval for synthetic mutation excluding real sends, `Create New Email` exposed `Create a custom build` and `Use a pre-built template`. The empty custom editor at `/commshub/commshub/template-builder/email/create` exposes fixed dev `From Address`, language selection, required `Subject line`, required plain-text `Email Text`, dynamic fields, `Media Library`, and a visual email builder. Builder controls include components, preview, fullscreen, code view, template import, style/settings/layer/block managers, desktop/tablet/mobile modes, and section/text/image/link/button/organisation blocks. Device switching changed the empty canvas from desktop to tablet and mobile widths, then restored desktop. `Style Manager` and `Settings` each required selecting an element; no canvas element was selected. `Layer Manager` showed only `Body`; `Blocks` exposed the documented empty-builder block catalogue. `View code` opened a read-only `Export template` dialog with generated-code textbox and copy guidance; it was closed without copying or downloading. `Import template` opened a code textbox with `Import`; the dialog was closed without entering code or importing. Fullscreen was entered and exited with `Escape`. Empty `Save` remained disabled; preview mode was entered without adding content, then Browser Back restored Template Manager.

`Use a pre-built template` opened `Choose Design`, containing a searchable template catalogue, `Create without a Template`, `Back`, and `Next`. The chooser rendered 70 design cards and initially marked one catalogue card selected. Its search control opens a searchable dropdown rather than filtering the card carousel: a synthetic no-match query displayed `No Options available` while all 70 cards remained visible. The query was cleared, the dropdown dismissed with `Escape`, and selection remained unchanged. With expanded approval excluding real sends, `Next` opened `/commshub/commshub/template-builder/email/create?template=true` and loaded that pre-built design into the visual editor. The canvas contained pre-populated email content while required `Subject line` and plain-text `Email Text` remained empty; `Save` appeared enabled despite those empty required fields. Browser Back discarded the unsaved editor and restored Template Manager. No content was edited or saved. The chooser emitted multiple console errors while rendering, and the editor emitted one error; causes and user impact remain unverified.

`Create New SMS` opened `/commshub/commshub/template-builder/sms/create`. The empty editor exposes language selection, required `From Name`, reusable dynamic fields, required `Content` with a 160-character counter, preview, and `Media Library`; `Save` remained disabled. The language control showed only the current `English` state in accessibility output. `Media Library` opened `Upload Media`, offering `Drop files here to upload` or `Select existing media`; the modal was closed without opening a file chooser, dropping a file or selecting existing media.

The email editor exposes the same `Upload Media` modal. Its existing-media selector opened a searchable list of 31 current assets; names were treated as sensitive and are omitted. No asset was selected. `Escape` closed the selector/modal state; Browser Back restored the dashboard. No input, catalogue or media selection, component insertion, import, upload, template save or send occurred.

## Execution guidance

- Authenticate manually on approved external dev host.
- Treat template and organisation content as sensitive.
- Opening empty email/SMS creation UI is non-persistent; stop before entering content, selecting a pre-built template, uploading media, changing defaults or applying context without synthetic data and cleanup approval.

## Automation guidance

- Stable landmarks: route, group labels and exact primary controls.
- Do not assert template contents or counts without controlled data.

## Evidence

Accessibility observation, external Comms Hub dev, authenticated session associated with Paco `Super Admin GB`, 2026-09-21. `Viewing data for` exposed two checkbox contexts plus `Select All` and `Apply`, then closed unchanged without applying. Synthetic no-match search cleared; `Columns` and `Filters` inspected unchanged; organisation-default dialog and one searchable 875-option selector were inspected, then cancelled unchanged; pagination observed at page 1 of 1. Email creation chooser, empty custom email editor/preview, and empty SMS editor inspected; each `Save` stayed disabled and Browser Back restored Template Manager. Mutation: `None`; no input, component insertion, import, upload, organisation value or sensitive value retained.

## Open questions

- Mutation setup, cleanup and approved test organisation remain unspecified.
- Default-template persistence and validation remain unverified because dialog `Save` was not used.
- Pre-built `Next` now reaches a populated unsaved editor, but persistence validation remains unverified. `Save` appeared enabled while required subject/plain-text fields were empty; whether save-time validation blocks persistence is unknown. Chooser/editor console errors remain unexplained.

## Tester notes

[Protected area]
