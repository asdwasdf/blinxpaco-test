# Case Load Management - Deep Dive

**Date:** 2026-10-06  
**Role:** Super Admin GB  
**Environment:** dev  
**URL:** `/paco/unallocated`

---

## Case Load Management Overview

### Navigation (4 tabs)
1. **My Case** - Cases assigned to current user
2. **Unallocated** - Cases awaiting assignment (778 cases)
3. **Case Workboards** - Custom workboards
4. **Task Workboards** - Task management

---

## Unallocated Board

### Header
- Title: "Unallocated (778)"
- Breadcrumb: Back to Dashboard

### Controls
- Search: "Search this board"
- View: List View button
- Actions: "Create new case" button
- Sort: "Breaching (high to low)" dropdown
- Filters button

### Priority Filters
| Filter | Count |
|--------|-------|
| All | 778 |
| white | 1 |
| Emergency | 68 |
| Mid Priority | 671 |
| Low Priority | 21 |
| High Priority | 17 |

### PDS Status Legend
- PDS Validated
- PDS Validation Pending
- PDS Not Matched

---

## Case Card Structure

Each unallocated case shows:

```
┌─────────────────────────────────────────────┐
│ Priority: [Priority Badge]                   │
│ ─────────────────────────────────────────── │
│ [PDS Icon] Patient Name                    │
│              [Flag icon if flagged]         │
│ Age: 36  Gender: male                     │
│ Phone: +44                                  │
│ Active Time: 01 hours, 57 mins, 39 secs   │
│ Address: SW1A 1AA                          │
│ ─────────────────────────────────────────── │
│ Pathway: Not set                            │
│ ─────────────────────────────────────────── │
│ [Request info] [Add to Board]               │
└─────────────────────────────────────────────┘
```

### Case Card Fields
| Field | Description |
|-------|-------------|
| Priority | Over 72 hour, 12 Hours OOH, Emergency, High, Mid, Low |
| PDS Status | Validated, Validation pending, Not matched |
| Patient Name | Generated test names (e.g., Autoqa Testerbhjbcgjgbaeghaabbjhajb) |
| Age | Patient age |
| Gender | male, M, female, F |
| Phone | Contact number or "Not provided" |
| Active Time | Time in queue (hours, mins, secs) |
| Address | Postcode or blank |
| Pathway | Care pathway or "Not set" |
| Case Flagged | Visual indicator if flagged |
| Actions | Request info, Add to Board |

---

## Priority Levels

1. **Over 72 hour** (red) - Most urgent, SLA breach
2. **12 Hours OOH** - Out of hours priority
3. **Emergency** - Emergency cases
4. **High Priority** - High priority cases
5. **Mid Priority** - Medium priority cases
6. **Low Priority** - Low priority cases
7. **white** - Unclassified/white cases

---

## Actions Available

### On Case Card
1. **Request info** - Request additional information
2. **Add to Board** - Add case to a workboard

### Case Actions Menu
- **Open case actions menu** - Opens dropdown with more actions

---

## Real Case Example

```
Priority: Over 72 hour
Patient: Cuthbert Jump
Age: 83
Gender: female
Phone: Not provided
Active Time: 4697 hours, 34 mins, 05 secs (extreme backlog)
Pathway: Bites and Stings - "The bite was caused by a human"
```

---

## Observations

1. **High volume**: 778 unallocated cases
2. **SLA tracking**: Active time shows how long cases have been waiting
3. **Priority tiers**: Multiple priority levels for triage
4. **PDS integration**: Patient Demographics Service validation status shown
5. **Pathway tracking**: Care pathway associated with each case
6. **Batch actions**: Bulk assignment capabilities
7. **Test data visible**: Many auto-generated test patient names

---

## My Cases Tab

Cases specifically assigned to the logged-in user.

---

## Case Workboards

Customizable kanban-style boards for case management.

---

## Task Workboards

Task-specific workboards separate from case management.

---

## URL Structure

- PACO OS: `/paco/case-load-management`
- Unallocated: `/paco/unallocated`
- My Cases: `/paco/my-cases`
- Case Workboards: `/paco/case-workboards`
- Task Workboards: `/paco/task-workboards`
