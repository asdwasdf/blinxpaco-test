# Manual Login Guide

## Setup Authentication State

Playwright tests require manual login to create auth state.

### Steps

1. **Run headed browser:**
```bash
npx playwright codegen https://blinx.dev.blinxpaco-np.com/paco/dashboard
```

2. **Login manually:**
   - Enter credentials
   - Complete SSO/MFA if required
   - Verify dashboard loads

3. **Save auth state:**
```bash
# In Playwright Inspector, after login:
# Tools > Save Storage State > playwright/.auth/user.json
```

4. **Verify state saved:**
```bash
ls -lh playwright/.auth/user.json
```

### Security

- `playwright/.auth/` is Git ignored
- Never commit auth state files
- Never copy auth state into docs/reports
- Auth state is local-only

### Expiration

If tests fail with "Authentication expired":
1. Delete old state: `rm playwright/.auth/user.json`
2. Repeat manual login steps
3. Save new auth state

### Role-Specific States

Create separate states for different roles:
- `user.json` - default user role
- `admin.json` - admin role (if needed)

Tests specify which state via fixture.
