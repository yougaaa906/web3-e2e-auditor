import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

/**
 * Load environment variables from .env file.
 * In CI environments, these are expected to be injected via GitHub Secrets.
 */
const envPath = path。resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

export default defineConfig({
  testDir: './tests',
  
  /**
   * Sequential execution enforcement for DApp audits.
   * Workers are set to 1 in CI to prevent race conditions during 
   * wallet state manipulation and blockchain transaction simulation.
   */
  workers: process.env.CI ? 1 : undefined,
  fullyParallel: false,

  /**
   * Define global timeout for long-running blockchain transaction confirmations.
   */
  timeout: 120000,
  expect: {
    timeout: 20000,
  },

  reporter: [
    ['line'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],

  use: {
    // Enable headed mode locally for debugging, headless in CI for stability
    headless: !!process.env.CI,
    baseURL: process.env.BASE_URL || 'https://app.uniswap.org',
    trace: 'on-first-retry',
  },

  projects: [
    {
      /**
       * Setup project: Configures the browser context with the wallet state.
       * This must run before any auditing suites to ensure an authenticated environment.
       */
      name: 'setup',
      testMatch: 'tests/env-setup.spec.ts',
    },
    {
      /**
       * Main auditing suite: Dependent on 'setup' to ensure 
       * the wallet is already connected and unlocked.
       */
      name: 'chromium-tests',
      use: { 
        ...devices['Desktop Chrome'],
        // Automatically injects the pre-authenticated storage state from setup
        storageState: 'playwright/.auth/state.json',
      },
      dependencies: ['setup'],
    },
  ],
});
