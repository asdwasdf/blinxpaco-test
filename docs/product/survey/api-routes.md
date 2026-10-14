---
id: api-routes
title: PACO API Routes (Discovered)
environment: dev
status: Observed
last_observed: 2026-10-06
---

# PACO API Routes (Discovered)

## Base API URL
- **PACO API:** https://dev-paco-api.blinxhealthcare.com/api/

## API Endpoints Discovered

### Users & Authentication
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/users/me` | GET | Current user info |
| `/api/users/dexie-encryption-key` | GET | Encryption key |
| `/api/users/prescriber-prof-reg` | GET | Prescriber professional registration |
| `/api/users/provider-roles` | GET | Provider roles by org |
| `/api/users/organisation-locations` | GET | Organisation locations |
| `/api/provider-shift-status/me` | GET | Current shift status |
| `/api/provider-shift-status/me/leave` | GET | Leave status |
| `/api/provider-shift-status/me/heartbeat` | POST | Shift heartbeat |
| `/api/shift-activity-status-type?activityState=active` | GET | Activity status types |

### Patients
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/patients/search` | GET | Patient search (pagination, includes) |
| `/api/patient-cases/current-provider-cases` | GET | Current provider cases |

### Communications
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/pacomms/conversations` | GET | PACO conversations |
| `/api/pacomms/invites` | GET | PACO invites |
| `/api/nhs/user-info` | POST | NHS user info |

### Organisation
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/organisation/registration-types` | GET | Registration types |

### Connectivity
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/connectivity` | GET | Connection check (204) |

## Notes
- Patient search supports pagination and includes
- Shift status has heartbeat mechanism
- Multiple 204 responses indicate successful operations with no content

## Gaps
- Workboards API
- Health Forms API
- Analytics API
- NHS Comms Hub API (separate domain)

---

## Workboards API

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/workboards/` | GET | List workboards | 200 |
| `/api/workboards/stats` | GET | Workboards stats | 200 |
| `/api/workboards/{id}` | GET | Specific workboard | 200 |
| `/api/workboards/{id}/columns` | GET | Columns for workboard | 200 |
| `/api/task-status-types` | GET | Task status types | 200 |
| `/api/tasks/task-priority-types` | GET | Task priority types | 200 |
| `/api/priority-groups` | GET | Priority groups | **403 Forbidden** |
| `/api/patient-cases/groups` | GET | Patient case groups | **403 Forbidden** |

## Key Finding - 403 Permission Denied

**Root cause of Create Task blocker discovered!**

APIs returning 403:
- `/api/priority-groups` - requires permissions for case data
- `/api/patient-cases/groups` - requires permissions for case groups

**Impact:** Task creation blocked because:
1. Priority groups (columns) not accessible - explains "No available options"
2. Patient case groups not accessible - may be required for task linking

**This is a permission/role configuration issue, not a code bug.**
