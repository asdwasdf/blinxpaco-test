# Draft: Message to dev (English) — PAC2-8999 clarification

Hi team,

We're triaging **PAC2-8999 — PBT-332: Appointments not logging in patient Audit — regression of PBT-252** and need a few clarifications before we can run QA on our dev environments. The original ticket reports the issue on Production/Live, but our QA workflow is dev-only and we want to make sure we're looking at the right surface and the right build.

Could you confirm the following?

1. **Build / branch to test against**
   - Which dev host / feature branch should we use to verify the fix (or the regression)?
   - Is the fix already merged, or is it still on a feature branch (and if so, which one)?
   - Is there a target build / release date we should align with?

2. **Audit surface — patient profile vs appointment level**
   - The ticket says booking/cancelling an appointment is not logging against the **patient profile**. We want to confirm this means the **per-patient Audit tab** (e.g. opened from Patient Search → patient → Audit / History), and **not** the appointment-level audit on the Appointment Book calendar (which we already covered in PAC2-8381).
   - Could you share the exact navigation path to the relevant audit view in the current build (e.g. role + route + landmark)?

3. **Required role / permission**
   - What role is required to (a) book/cancel an appointment, and (b) view the patient profile audit?
   - Should QA test with `Super Admin GB` (as in PAC2-8381), or a more restricted role (Receptionist, Clinician, etc.) to better match production usage?

4. **Expected audit wording**
   - What exact entry should appear in the patient audit when an appointment is booked? (e.g. `<user> booked an appointment`, `<user> created appointment`, free-text, etc.)
   - Same question for **cancellation** — what entry should appear, and is it differentiated (e.g. `cancelled by <user>` vs `amended by <user>`)?

5. **Scope of the regression**
   - Does this also affect **amendments** (e.g. slot type, time, clinician), or only booking + cancellation?
   - Is the bug only in PACO Connect, or also in legacy PACO (`/paco/...`)?

6. **Test data**
   - Do you have a recommended safe test patient + slot we can reuse across runs (a `QA-AUTO-…` identifier is fine, or a non-PII patient already in dev)?
   - If not, we're happy to pick any non-PII patient + free slot on the configured dev host and document the audit entries we touch.

7. **Acceptance criteria**
   - The Jira ticket has no `Acceptance Criteria` section. Could you provide a short list of the conditions we should verify (e.g. "audit row present within X seconds of booking action", "actor == authenticated user", "action label == '<user> booked an appointment'", "visible in patient audit tab", etc.)?

Once we have answers to the above we can run a focused manual + automated verification on dev and report back.

Thanks,
QA
