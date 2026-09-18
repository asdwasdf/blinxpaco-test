# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke/dashboard.spec.ts >> Paco dashboard is accessible in read-only mode
- Location: playwright/tests/smoke/dashboard.spec.ts:6:1

# Error details

```
Error: Blocked: expected one authenticated dashboard tab, found 0
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - img "Blinx Logo" [ref=e4]
    - generic [ref=e5]:
      - generic [ref=e6]:
        - heading "Welcome Back" [level=2] [ref=e7]
        - paragraph [ref=e8]: Welcome back to Communications Hub.
      - generic [ref=e9]:
        - button "Sign In" [ref=e10] [cursor=pointer]
        - generic [ref=e11] [cursor=pointer]: Username and Password -->
        - generic [ref=e14]:
          - link "Terms & Conditions" [ref=e15] [cursor=pointer]:
            - /url: "#"
          - text: "|"
          - link "Privacy Policy" [ref=e16] [cursor=pointer]:
            - /url: /commshub/privacy-policy
  - generic [ref=e18]:
    - text: Powered by
    - img "Blinx Logo" [ref=e19]
```

# Test source

```ts
  1  | import { chromium, test as base, type BrowserContext, type Page } from '@playwright/test';
  2  | import { getDefaultEnvironment, loadConfig } from '../../scripts/load-config.js';
  3  | import {
  4  |   cdpEndpoint,
  5  |   isAuthenticationUrl,
  6  |   isDashboardUrl,
  7  |   PACO_CDP_PORT,
  8  | } from '../../scripts/playwright-login.js';
  9  | 
  10 | const environment = getDefaultEnvironment(loadConfig());
  11 | 
  12 | type AuthFixtures = {
  13 |   authenticatedContext: BrowserContext;
  14 |   authenticatedPage: Page;
  15 | };
  16 | 
  17 | export const test = base.extend<AuthFixtures>({
  18 |   authenticatedContext: async ({}, use) => {
  19 |     let browser;
  20 |     try {
  21 |       browser = await chromium.connectOverCDP(cdpEndpoint(PACO_CDP_PORT));
  22 |     } catch {
  23 |       throw new Error('Blocked: Login browser not running. Run npm run auth:login and keep it open.');
  24 |     }
  25 | 
  26 |     const contexts = browser.contexts();
  27 |     if (contexts.length !== 1) {
  28 |       throw new Error(`Blocked: expected one login browser context, found ${contexts.length}`);
  29 |     }
  30 | 
  31 |     await use(contexts[0]);
  32 |   },
  33 |   authenticatedPage: async ({ authenticatedContext }, use) => {
  34 |     const dashboardPages = authenticatedContext.pages().filter((page) =>
  35 |       isDashboardUrl(page.url(), environment.baseUrl, environment.dashboardPath));
  36 |     if (dashboardPages.length !== 1) {
> 37 |       throw new Error(`Blocked: expected one authenticated dashboard tab, found ${dashboardPages.length}`);
     |             ^ Error: Blocked: expected one authenticated dashboard tab, found 0
  38 |     }
  39 | 
  40 |     const page = dashboardPages[0];
  41 |     if (isAuthenticationUrl(page.url())) {
  42 |       throw new Error('Blocked: Authentication expired');
  43 |     }
  44 |     await use(page);
  45 |   },
  46 | });
  47 | 
  48 | export { expect } from '@playwright/test';
  49 | 
```