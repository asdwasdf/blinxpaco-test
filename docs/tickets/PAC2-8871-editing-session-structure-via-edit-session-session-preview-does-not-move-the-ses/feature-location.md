# PAC2-8871 Feature Location

## Location

| Field | Value |
|-------|-------|
| **Feature Branch URL** | `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-8871/configuration` |
| Dev Main URL | `https://blinx.dev.blinxpaco-np.com/paco-connect/configuration` |
| HTTP Status | 404 (document), SPA renders |
| Environment | dev (feature branch) |
| Role | Super Admin GB |
| Entry Path | `/paco/dashboard` → sidebar `Appointment Book` → `Appointment Settings` |

## Entry Flow

1. Navigate to `/paco/dashboard`
2. Click `Appointment Book` in sidebar → submenu appears
3. Click `Appointment Settings` → redirects to `/paco-connect/configuration`
4. Wait for "Loading sessions" to disappear (~15s)
5. Session grid loads with 20,730 rows

## Landmark Elements

| Element | Description |
|---------|-------------|
| Heading | `Configuration` (h1) |
| Search | `textbox "Search Session..."` |
| Actions | `button` in Actions column |
| Folder indicator | `` icon = expanded, `` = collapsed |
| Folder naming | `<name> (Template — <n> sessions)` |

## Session Grid Structure

- **Header row**: `Session Name` | `Actions`
- **Folder rows**: Expandable/collapsible, icon `` / ``
- **Session rows**: Individual sessions within folder
- **Standalone sessions**: Sessions not belonging to any folder
- **Row count**: 20,730 total rows

## Related Routes

| Route | Status | Notes |
|-------|--------|-------|
| `/paco-connect/configuration` | ✅ Confirmed | Main session configuration page |
| `/paco-connect/appointment-book` | ❌ 404 | Not available via direct navigation |

## Feature Actions

| Action | Location | Trigger |
|--------|----------|---------|
| Expand/Collapse folder | Click folder row icon ``/`` | Session Name column |
| Open Preview Session | Actions button → Preview | Per session row |
| Open Edit Session | Actions button → Edit | Per session row |
| Add Session | `Add` menu item | Session grid toolbar |

## Route Sync

- **Route**: `/paco-connect/configuration`
- **Classification**: Observed
- **Last verified**: 2026-10-07
- **Source**: PAC2-8871/feature-location.md

## Tester notes

[Protected area]
