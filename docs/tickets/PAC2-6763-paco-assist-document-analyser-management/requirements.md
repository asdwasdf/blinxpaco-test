# Requirements: PAC2-6763

**Input Revision:** 1
**Generated:** 2026-09-28T09:55:33.689Z
**Status:** Active

## Source Summary

Ticket gốc mô tả inbox tài liệu/file theo organisation và `Document Intelligence`. Tester đã xác nhận run scope hẹp hơn: kiểm thử upload document trên feature branch `PAC2-6763-send-key`; ticket gốc chỉ cung cấp context. Chưa có acceptance criteria chi tiết cho upload ngoài việc document/file phải vào inbox và được xử lý.

## Video Coverage

**Timeline:** N/A
**Contact Sheet:** N/A

Ticket không có video hoặc attachment.

## Atomic Requirements

### REQ-PAC2-6763-001

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Central organisational document/file inbox
**Search Terms/Aliases:** `PACO Assist`, `Document Intelligence`, `Document Analyser`, `Document Analyzer`, document management, document inbox, file inbox, `S3`, `MESH`
**Known Location:** Unknown
**Actor/Role:** Organisation user; exact role/permissions Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Present in Description; Jira `Acceptance criteria` field is Missing

**Preconditions:**
- Organisation exists.
- `S3` and `MESH` mailbox integrations are configured and available.

**Expected Behavior:**
A central document/file inbox exists for each organisation and is linked to that organisation's `S3` and `MESH` mailboxes.

**Provenance:**
- **Source:** `ticket/PAC2-6763-paco-assist-document-analyser-management/ticket.md:13`
- **Input Revision:** 1
- **First Recorded:** 2026-09-28
- **Last Verified:** 2026-09-28

**Evidence:** Ticket description and embedded checklist
**Related Tests:** TBD
**Notes:** Exact ingestion trigger, supported formats, mailbox configuration and organisation-isolation behavior are unspecified.

---

### REQ-PAC2-6763-002

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Automatic inbound document processing
**Search Terms/Aliases:** `Document Intelligence`, inbound documents, process document, analyse document, analyze document
**Known Location:** Unknown
**Actor/Role:** Healthcare Professional (`HP`) oversight; exact PACO role Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Present in Description; Jira `Acceptance criteria` field is Missing

**Preconditions:**
- An inbound document/file is available in the organisation inbox.

**Expected Behavior:**
`Document Intelligence` automatically processes inbound documents while retaining appropriate HP oversight.

**Provenance:**
- **Source:** `ticket/PAC2-6763-paco-assist-document-analyser-management/ticket.md:13`
- **Input Revision:** 1
- **First Recorded:** 2026-09-28
- **Last Verified:** 2026-09-28

**Evidence:** Ticket description and embedded checklist
**Related Tests:** TBD
**Notes:** “Automatically”, processing state/error behavior and HP oversight controls are not defined.

---

### REQ-PAC2-6763-003

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Source and author identification
**Search Terms/Aliases:** source, author, hospital, GP practice, consultant, system
**Known Location:** Unknown
**Actor/Role:** Healthcare Professional (`HP`); exact PACO role Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Present in Description; Jira `Acceptance criteria` field is Missing

**Preconditions:**
- An inbound document has been processed.

**Expected Behavior:**
The system identifies and surfaces the source and author of each inbound document/file.

**Provenance:**
- **Source:** `ticket/PAC2-6763-paco-assist-document-analyser-management/ticket.md:13`
- **Input Revision:** 1
- **First Recorded:** 2026-09-28
- **Last Verified:** 2026-09-28

**Evidence:** Ticket description and embedded checklist
**Related Tests:** TBD
**Notes:** Confidence, manual correction and unknown-value behavior are unspecified.

---

### REQ-PAC2-6763-004

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Patient identification
**Search Terms/Aliases:** patient identification, patient match, patient record
**Known Location:** Unknown
**Actor/Role:** Healthcare Professional (`HP`); exact PACO role Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Present in Description; Jira `Acceptance criteria` field is Missing

**Preconditions:**
- An inbound document has been processed.
- Matching patient records may exist within the organisation.

**Expected Behavior:**
The system matches the document to the correct patient record within the organisation and surfaces the identified patient to the HP.

**Provenance:**
- **Source:** `ticket/PAC2-6763-paco-assist-document-analyser-management/ticket.md:13`
- **Input Revision:** 1
- **First Recorded:** 2026-09-28
- **Last Verified:** 2026-09-28

**Evidence:** Ticket description and embedded checklist
**Related Tests:** TBD
**Notes:** No-match, ambiguous match, cross-organisation isolation, confidence and HP correction behavior are unspecified. Testing requires safe synthetic patient data.

---

### REQ-PAC2-6763-005

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Addressee identification
**Search Terms/Aliases:** addressee, addressed to, clinician, admin user
**Known Location:** Unknown
**Actor/Role:** Healthcare Professional (`HP`); exact PACO role Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Present in Description; Jira `Acceptance criteria` field is Missing

**Preconditions:**
- An inbound document has been processed.
- The document contains addressee information where applicable.

**Expected Behavior:**
Where appropriate, the system identifies and surfaces the clinician or admin user to whom the document is addressed.

**Provenance:**
- **Source:** `ticket/PAC2-6763-paco-assist-document-analyser-management/ticket.md:13`
- **Input Revision:** 1
- **First Recorded:** 2026-09-28
- **Last Verified:** 2026-09-28

**Evidence:** Ticket description and embedded checklist
**Related Tests:** TBD
**Notes:** “Where appropriate”, missing/ambiguous addressee behavior and correction flow are unspecified.

---

### REQ-PAC2-6763-006

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Structured content summary
**Search Terms/Aliases:** summary, structured summary, summarisation, summarization, document content
**Known Location:** Unknown
**Actor/Role:** Healthcare Professional (`HP`); exact PACO role Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Present in Description; Jira `Acceptance criteria` field is Missing

**Preconditions:**
- An inbound document has been processed.

**Expected Behavior:**
The system generates and surfaces a concise, structured summary of the document content for rapid triage and review.

**Provenance:**
- **Source:** `ticket/PAC2-6763-paco-assist-document-analyser-management/ticket.md:13`
- **Input Revision:** 1
- **First Recorded:** 2026-09-28
- **Last Verified:** 2026-09-28

**Evidence:** Ticket description and embedded checklist
**Related Tests:** TBD
**Notes:** Required structure, fidelity, editability, length and acceptable quality threshold are unspecified.

---

### REQ-PAC2-6763-007

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** `SNOMED CT` suggestions with HP decision
**Search Terms/Aliases:** `SNOMED`, `SNOMED CT`, code suggestions, accept code, decline code
**Known Location:** Unknown
**Actor/Role:** Healthcare Professional (`HP`); exact PACO role Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Present in Description; Jira `Acceptance criteria` field is Missing

**Preconditions:**
- An inbound document has been processed.
- Relevant coding suggestions can be derived from its content.

**Expected Behavior:**
The system presents relevant `SNOMED CT` code suggestions. Each suggestion must be accepted or declined by the HP before any code is applied.

**Provenance:**
- **Source:** `ticket/PAC2-6763-paco-assist-document-analyser-management/ticket.md:13`
- **Input Revision:** 1
- **First Recorded:** 2026-09-28
- **Last Verified:** 2026-09-28

**Evidence:** Ticket description and embedded checklist
**Related Tests:** TBD
**Notes:** Bulk/per-code decisions, editing/search, mandatory rationale and behavior when no codes are suggested are unspecified.

---

### REQ-PAC2-6763-008

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Document and accepted-code write-back
**Search Terms/Aliases:** write-back, patient record, consultation entry, admin entry, accepted coding
**Known Location:** Unknown
**Actor/Role:** Healthcare Professional (`HP`); exact PACO role and permission Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Present in Description; Jira `Acceptance criteria` field is Missing

**Preconditions:**
- Correct patient has been identified and reviewed.
- Any codes to apply have been accepted by the HP.
- The user is authorised to write to the patient record.

**Expected Behavior:**
The document and accepted coding can be written to the patient record as part of either a consultation entry or an `Admin entry`.

**Provenance:**
- **Source:** `ticket/PAC2-6763-paco-assist-document-analyser-management/ticket.md:13`
- **Input Revision:** 1
- **First Recorded:** 2026-09-28
- **Last Verified:** 2026-09-28

**Evidence:** Ticket description and embedded checklist
**Related Tests:** TBD
**Notes:** Persistent patient-record mutation. Safe synthetic data, exact permissions, confirmation behavior and cleanup constraints must be defined before execution.

---

### REQ-PAC2-6763-009

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** `Admin entry` dependency gate
**Search Terms/Aliases:** `Admin entry`, write-back, `PAC2-7193`, dependency
**Known Location:** Unknown
**Actor/Role:** Healthcare Professional (`HP`); exact PACO role Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Present in Description; Jira `Acceptance criteria` field is Missing

**Preconditions:**
- `Admin entry` write-back is selected or evaluated.

**Expected Behavior:**
`Admin entry` write-back is gated on completion of `PAC2-7193`.

**Provenance:**
- **Source:** `ticket/PAC2-6763-paco-assist-document-analyser-management/ticket.md:13`
- **Input Revision:** 1
- **First Recorded:** 2026-09-28
- **Last Verified:** 2026-09-28

**Evidence:** Ticket dependency statement and embedded checklist
**Related Tests:** TBD
**Notes:** Current status of `PAC2-7193` and expected unavailable-state UI are not supplied.

---

### REQ-PAC2-6763-010

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Clinical and administrative action identification
**Search Terms/Aliases:** actions, clinical action, administrative action, onward referral, medication adjustment
**Known Location:** Unknown
**Actor/Role:** Healthcare Professional (`HP`); exact PACO role Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Present in Description; Jira `Acceptance criteria` field is Missing

**Preconditions:**
- An inbound document has been processed.

**Expected Behavior:**
The system identifies and surfaces clinical or administrative actions required by the document, including onward referrals and medication adjustments.

**Provenance:**
- **Source:** `ticket/PAC2-6763-paco-assist-document-analyser-management/ticket.md:13`
- **Input Revision:** 1
- **First Recorded:** 2026-09-28
- **Last Verified:** 2026-09-28

**Evidence:** Ticket description and embedded checklist
**Related Tests:** TBD
**Notes:** Action taxonomy, priority, state, false-positive handling and meaning of “flag and initiate” are unspecified.

---

### REQ-PAC2-6763-011

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Medication-related draft prescription
**Search Terms/Aliases:** draft prescription, medication change, medication adjustment, `Quick Scribe`, `PACO Talk`
**Known Location:** Unknown
**Actor/Role:** Healthcare Professional (`HP`); exact PACO role and prescribing permission Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Present in Description; Jira `Acceptance criteria` field is Missing

**Preconditions:**
- The processed document identifies a medication-related action.
- An authorised HP reviews the action.

**Expected Behavior:**
The system generates a draft prescription through `PACO Assist`, consistent with the existing `Quick Scribe` flow in `PACO Talk`.

**Provenance:**
- **Source:** `ticket/PAC2-6763-paco-assist-document-analyser-management/ticket.md:13`
- **Input Revision:** 1
- **First Recorded:** 2026-09-28
- **Last Verified:** 2026-09-28

**Evidence:** Ticket description and embedded checklist
**Related Tests:** TBD
**Notes:** “Consistent” behavior is not enumerated. This may create sensitive clinical draft data; safe synthetic patient/medication data and exact mutation boundary are required.

---

### REQ-PAC2-6763-012

**Classification:** Confirmed
**Lifecycle:** Candidate
**Feature/Scope:** Conversation reset label
**Search Terms/Aliases:** `Start new chat`, `Clear`, new chat, reset conversation
**Known Location:** Unknown
**Actor/Role:** PACO Assist user; exact role Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Ambiguous comment-only requirement

**Preconditions:**
- A PACO Assist conversation is open.

**Expected Behavior:**
The former `Clear` control is labelled `Start new chat`.

**Provenance:**
- **Source:** `ticket/PAC2-6763-paco-assist-document-analyser-management/ticket.md:43-51`
- **Input Revision:** 1
- **First Recorded:** 2026-09-28
- **Last Verified:** 2026-09-28

**Evidence:** Jira comment by lucas.ngo, 2026-08-12
**Related Tests:** TBD
**Notes:** Comment says “Update from Gareth feedbacks”; inclusion in this ticket's current test scope is not explicitly confirmed.

---

### REQ-PAC2-6763-013

**Classification:** Confirmed
**Lifecycle:** Candidate
**Feature/Scope:** Agent document investigation behavior
**Search Terms/Aliases:** find documents, finding documents, dive deeper, agent response
**Known Location:** Unknown
**Actor/Role:** PACO Assist user; exact role Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Ambiguous comment-only requirement

**Preconditions:**
- The agent is asked to find or analyse documents.

**Expected Behavior:**
When finding documents, the agent investigates the document content more deeply instead of asking the user to supply that information.

**Provenance:**
- **Source:** `ticket/PAC2-6763-paco-assist-document-analyser-management/ticket.md:43-51`
- **Input Revision:** 1
- **First Recorded:** 2026-09-28
- **Last Verified:** 2026-09-28

**Evidence:** Jira comment by lucas.ngo, 2026-08-12
**Related Tests:** TBD
**Notes:** Trigger, depth, stopping condition and expected answer content are unspecified.

---

### REQ-PAC2-6763-014

**Classification:** Confirmed
**Lifecycle:** Candidate
**Feature/Scope:** Agent response formatting
**Search Terms/Aliases:** agent response, response format, formatting
**Known Location:** Unknown
**Actor/Role:** PACO Assist user; exact role Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Ambiguous comment-only requirement

**Preconditions:**
- The agent returns a response.

**Expected Behavior:**
The agent uses an improved response format.

**Provenance:**
- **Source:** `ticket/PAC2-6763-paco-assist-document-analyser-management/ticket.md:43-51`
- **Input Revision:** 1
- **First Recorded:** 2026-09-28
- **Last Verified:** 2026-09-28

**Evidence:** Jira comment by lucas.ngo, 2026-08-12
**Related Tests:** TBD
**Notes:** Not testable until the required format or reference example is supplied.

---

### REQ-PAC2-6763-015

**Classification:** Confirmed
**Lifecycle:** Candidate
**Feature/Scope:** Chat cost estimate
**Search Terms/Aliases:** cost estimate, cost estimation, chat cost, usage cost
**Known Location:** Unknown
**Actor/Role:** PACO Assist user; exact role Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Ambiguous comment-only requirement

**Preconditions:**
- A PACO Assist chat exists.

**Expected Behavior:**
A cost estimate is available per chat.

**Provenance:**
- **Source:** `ticket/PAC2-6763-paco-assist-document-analyser-management/ticket.md:43-51`
- **Input Revision:** 1
- **First Recorded:** 2026-09-28
- **Last Verified:** 2026-09-28

**Evidence:** Jira comment by lucas.ngo, 2026-08-12
**Related Tests:** TBD
**Notes:** Currency, calculation basis, precision, update timing and visibility are unspecified.

---

### REQ-PAC2-6763-016

**Classification:** Confirmed
**Lifecycle:** Candidate
**Feature/Scope:** Conversation history
**Search Terms/Aliases:** conversation history, chat history, previous chats
**Known Location:** Unknown
**Actor/Role:** PACO Assist user; exact role Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Ambiguous comment-only requirement

**Preconditions:**
- The user has one or more PACO Assist conversations.

**Expected Behavior:**
PACO Assist provides conversation history.

**Provenance:**
- **Source:** `ticket/PAC2-6763-paco-assist-document-analyser-management/ticket.md:43-51`
- **Input Revision:** 1
- **First Recorded:** 2026-09-28
- **Last Verified:** 2026-09-28

**Evidence:** Jira comment by lucas.ngo, 2026-08-12
**Related Tests:** TBD
**Notes:** Persistence, organisation/user isolation, retention, naming, ordering and restore behavior are unspecified.

---

### REQ-PAC2-6763-017

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Feature-branch document upload smoke
**Search Terms/Aliases:** `Upload document`, `Upload file`, document upload, file upload, inbox, documents
**Known Location:** Unknown; tester-confirmed target branch `https://pac2-6763-send-key.dev.blinxpaco-np.com`
**Actor/Role:** Current authenticated tester; exact enabling permission/context Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Tester-confirmed scope; detailed expected result Missing

**Preconditions:**
- Authenticated feature-branch session.
- A safe synthetic, non-clinical document with no PII is available.
- Upload feature is enabled for the active role/organisation.

**Expected Behavior:**
The user can select and upload a safe synthetic document through the branch's document-upload flow; the system exposes an observable upload result. Exact success state and downstream processing assertions remain open until observed or confirmed.

**Provenance:**
- **Source:** Tester instruction in current QA session: “test upload document”
- **Input Revision:** 1
- **First Recorded:** 2026-09-28
- **Last Verified:** 2026-09-28

**Evidence:** Tester-confirmed run scope; branch name from tester screenshot/context
**Related Tests:** TBD
**Notes:** Upload is a side effect. Execution-first authorization covers the exact dev branch/case with a safe synthetic file, mutation ledger and cleanup where supported. Do not assert full Document Intelligence correctness from upload success alone.

---

## Ambiguities and Conflicts

- Jira's dedicated `Acceptance criteria` section says “Not provided”, while the Description contains an inline checklist labelled Acceptance Criteria. This artifact treats observable checklist statements as `Confirmed` ticket-source requirements but records the field mismatch.
- The 2026-08-12 comment adds five requirements without precise acceptance criteria or explicit confirmation that all remain in current scope. They stay `Candidate`.
- Ticket gốc có scope end-to-end rộng; tester đã thu hẹp run hiện tại còn document upload trên branch `PAC2-6763-send-key`. Các requirement khác giữ làm context, không tự động thuộc run scope.
- `Admin entry` write-back depends on `PAC2-7193`; its current completion state is unknown.
- `S3`/`MESH` integration is stated as required, but no configured dev inbox, ingest method or safe source document is supplied.
- “Consistent with `Quick Scribe`” does not enumerate the behaviors to compare.
- No directly matching product workflow or feature-map entry was found; route remains `Unknown` pending browser location.

## Open Questions

1. Where is the document-upload entry for the active role/organisation on branch `PAC2-6763-send-key`?
2. Which file types and maximum size are supported?
3. What visible state definitively means upload succeeded, failed or is still processing?
4. Does upload create a deletable inbox record, and which safe cleanup action is supported?
5. Which PACO role/permission or organisation feature flag enables document upload?
6. Are downstream analysis results in scope, or is this run limited to upload submission and observability?
7. For broader ticket context only: is `PAC2-7193` complete, and what are the required matching, summary, coding, action and write-back details?

## Tester notes

[Protected area]
