import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { defineConfig, devices } from '@playwright/test';
import { getDefaultEnvironment, loadConfig } from './scripts/load-config.js';

if (existsSync('.env')) loadEnvFile();

const config = loadConfig();
const baseURL = getDefaultEnvironment(config).baseUrl;

export default defineConfig({
  testDir: './playwright/tests',
  fullyParallel: false, // Serial execution for auth-dependent tests
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker để avoid auth conflicts
  reporter: 'html',

  use: {
    baseURL,
    launchOptions: { slowMo: Number(process.env.PACO_SLOW_MO_MS ?? 0) },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],

  outputDir: 'test-results/',
});
