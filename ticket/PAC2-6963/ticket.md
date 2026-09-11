# Patients not being sent campaigns as marked as "Deleted" in Comms Hub

## Key details

### Description

#### User story

As a practice user, when a Comms Hub campaign is sent, I want all
eligible patients in Analytics Reports and Comms Hub to match so that
patients marked as deleted are handled consistently.

### Context

Several sites have reported differences between patients shown in
Analytics Reports and patients who get sent in Comms Hub.

**Example from Myrtle Practice:**

-   Comms campaign: *"PCN Spring COVID Invites - 2026 Reminders
    (email)"*
-   379 patients failed to send and appear in the Outbox with status
    *"Not Sent - Patient Deleted or Inactive"*.
-   These patients were extracted and uploaded into Analytics under
    patient details as a Practice Report in the Covid 2026 folder called
    *"Spring COVID 2026 Not Invited 1/5/2026"*.
-   In Advanced Search, setting **Deleted Patient Included** returns the
    404 imported patients.
-   Setting **Deleted Patient Excluded** drops the result to 23
    patients.
-   This matches the 379 patients who were not contacted.
-   All patients are marked as Regular & There deleted status is
    "False".

This behaviour is not consistent each time the report is run.

### Acceptance criteria

-   Patients marked as deleted are handled consistently between
    Analytics Reports and Comms Hub.
-   Campaign sends reflect the same patient set shown in Analytics
    Reports.
-   Outbox status for patients not sent includes *"Not Sent - Patient
    Deleted or Inactive"* where applicable.
-   Advanced Search returns consistent results for:
    -   **Deleted Patient Included**
    -   **Deleted Patient Excluded**
-   The patient counts in the report and the campaign send should align
    consistently.

### Other information

-   There are several linked tickets related to this issue from
    Vauxhall, Oaklands and I suspect it is happening in other campaigns
    at sites.
