# Paco Playwright

- Chromium-only v1, one worker.
- Manual browser authentication state: `playwright/.auth/user.json`.
- Tạo state bằng `npm run auth:login`; tester tự nhập credential trong browser.
- Missing/expired authentication is `Blocked`, not product failure.
- Default run scope is read-only.
- Mutation requires explicit scoped approval and runtime guards.
- Raw artifacts stay under ignored `test-results/`; docs store redacted references only.

Setup: `scripts/manual-login.md`. List tests safely with `rtk npx playwright test --list`.
