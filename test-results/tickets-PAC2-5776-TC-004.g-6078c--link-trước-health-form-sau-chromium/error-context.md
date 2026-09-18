# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tickets/PAC2-5776-TC-004.guided.spec.ts >> PAC2-5776-TC-004 guided: booking link trước, health form sau
- Location: playwright/tests/tickets/PAC2-5776-TC-004.guided.spec.ts:26:1

# Error details

```
Error: Blocked: expected one authenticated dashboard tab, found 0
```

# Page snapshot

```yaml
- generic [active] [ref=f3e1]:
  - generic "Accessibility Menu":
    - button "Accessibility Menu" [ref=f3e3] [cursor=pointer]
  - generic [ref=f3e9]:
    - generic [ref=f3e11]:
      - paragraph [ref=f3e12]: Welcome
      - paragraph [ref=f3e15]:
        - generic [ref=f3e16]: Powered By
    - generic [ref=f3e17]:
      - img "Paco-24-icon" [ref=f3e19]
      - generic [ref=f3e20]:
        - status [ref=f3e21]: We couldn't confirm your session was still active, so you were signed out for security. Please sign in again.
        - generic [ref=f3e22]:
          - generic [ref=f3e23]: Log in
          - generic [ref=f3e24]:
            - generic [ref=f3e25]:
              - generic [ref=f3e26]:
                - generic [ref=f3e27]: User Name
                - textbox "User Name" [ref=f3e28]:
                  - /placeholder: Username
                  - text: blinx_daophuongnguyen28022003+2
              - generic [ref=f3e29]:
                - generic [ref=f3e30]: Password
                - textbox "Password" [ref=f3e31]: Nguyen28022003@
            - button "Log in" [ref=f3e34] [cursor=pointer]
        - generic [ref=f3e36]:
          - generic [ref=f3e37]: OR
          - button "Single Sign On" [ref=f3e39] [cursor=pointer]
          - generic [ref=f3e41]: OR
          - button "Log in with my Care Identity" [ref=f3e43] [cursor=pointer]:
            - generic [ref=f3e45]: Log in with my
            - text: Care Identity
        - generic [ref=f3e47]:
          - link "Forgot Password" [ref=f3e48] [cursor=pointer]:
            - /url: "#"
          - text: "|"
          - link "Privacy Policy" [ref=f3e49] [cursor=pointer]:
            - /url: "#"
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