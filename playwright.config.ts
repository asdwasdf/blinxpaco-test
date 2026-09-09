import { defineConfig, devices } from '@playwright/test';
import { loadConfig } from './scripts/load-config.js';

const config = loadConfig();
const baseURL = config.environments.dev.baseUrl;

export default defineConfig({
  testDir: './playwright/tests',
  fullyParallel: false, // Serial execution for auth-dependent tests
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker để avoid auth conflicts
  reporter: 'html',

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  outputDir: 'test-results/',
});
