import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env if it exists, otherwise rely on process.env (GitHub Secrets)
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export default defineConfig({
  testDir: './tests',
  // Workers set to 1 in CI to prevent persistent data lock conflicts
  workers: process.env.CI ? 1 : undefined,
  fullyParallel: false,

  timeout: 120000,
  expect: { timeout: 20000 },

  reporter: [
    ['line'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],

  use: {
    // Enable headless in CI for stability, headed locally for debugging
    headless: !!process.env.CI,
    baseURL: process.env.BASE_URL || 'https://app.uniswap.org',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'setup',
      testMatch: 'tests/env-setup.spec.ts',
      use: { headless: !!process.env.CI },
    },
    {
      name: 'chromium-tests',
      use: { 
        ...devices['Desktop Chrome'],
        // Automatically injects the pre-authenticated storage state from setup
        storageState: 'playwright/.auth/state.json',
      },
      dependencies: ['setup'], // Ensures setup finishes before running audits
    },
  ],
});
