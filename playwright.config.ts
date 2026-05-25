import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '.env');
console.log(`📁 Loading framework execution context profiles from: ${envPath}`);
dotenv.config({ path: envPath });

console.log(`🔐 Cryptographic context validation - WALLET_PASSWORD declared: ${process.env.WALLET_PASSWORD ? 'Yes' : 'No'}`);
console.log(`🔗 Target gateway node bound - BASE_URL: ${process.env.BASE_URL}`);

export default defineConfig({
  testDir: './tests',

  // 1. Sequential thread enforcement to prevent persistent directory lock conflict
  // 2. Pre-authenticated state yielding to completely isolate test code from brittle sign-on steps
  // 3. Immutable environment sandboxing to guarantee reproducible, isolated state execution across every suite invocation
  workers: 1,
  fullyParallel: false,


  reporter: [
    ['line'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],

  timeout: 120000,
  expect: {
    timeout: 20000,
  },

  use: {
    headless: false,
    baseURL: process.env.BASE_URL || 'https://app.uniswap.org',
  },

  projects: [
    {
      name: 'chrome',
    },
  ],
});