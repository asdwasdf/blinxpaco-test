# PAC2-8931 Feature Location

**Ticket:** PAC2-8931  
**Phase:** LOCATE  
**Updated:** 2026-10-07

## Route

- **Entry:** `/paco/dashboard` → sidebar `Configuration` → tree `Appointment Books` → `Appointment Books` (leaf)
- **Route:** `/paco-connect/feature-branch/pac2-8931/configuration/#appointment-books`
- **Classification:** `Observed`
- **Role:** `Super Admin GB`
- **Environment:** `dev` (feature branch `pac2-8931`)
- **Source:** `PAC2-8931/feature-location.md`
- **Last verified:** `2026-10-07`

## Aliases

- `Appointment Books listing`, `Edit Appointment Book panel`, `Edit AB`

## Landmark & Entry Path

1. Navigate to: `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-8931/configuration/#appointment-books`
2. Wait for grid to load (433 rows visible)
3. Find row by `Appointment Book Name` column (e.g., `111 PC24`)
4. Click row to select
5. Click `Actions` button in row → menu `Edit` / `View Audit` / `Archive`

## Edit Panel

- **Trigger:** Menu item `Edit` on selected row
- **Type:** Right-side drawer/panel
- **Header:** `Edit Appointment Book`
- **Fields:**
  - `Name` — textbox
  - `Shared Organisations` — combobox + removable pills
- **Actions:** `Cancel`, `Save`

## Entry Point Landmarks

- Sidebar: `Configuration` icon
- Left nav tree: `Appointment Books` → `Appointment Books` (leaf)
- Grid columns: `Appointment Book Name`, `Organisations`
- Row action: `Actions` button → menu

## Route Sync

Sync to `docs/product/feature-map.md` — entry:

```yaml
#### Configuration — Appointment Books (edit)
- Entry: `Configuration` → tree `Appointment Books` → `Appointment Books` (leaf)
- Route: `/paco-connect/configuration/#appointment-books` (feature-branch: `/paco-connect/feature-branch/<ticket-branch>/configuration/#appointment-books`)
- Aliases: `Appointment Books listing`, `Edit Appointment Book panel`, `Edit AB`
- Role observed: `Super Admin GB`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-8931` (`feature-location.md`)
- Last verified: `2026-10-07`
- Note: Grid listing → select row → `Actions` → `Edit` → right-side drawer `Edit Appointment Book` with `Name` textbox and `Shared Organisations` combobox + pills. Dừng trước `Save`.
```

## Budget

- Views: 4 (login → dashboard → configuration → appointment-books section → edit panel)
- Time: ~15 min
- Mode: read-only (no Save, no mutation)

## Tester Notes

*(Protected — do not overwrite)*
