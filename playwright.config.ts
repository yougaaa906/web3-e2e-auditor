/**
 * Global Test Runner Configurations Matrix for Web3 Playwright Framework
 * @module GlobalPlaywrightConfig
 * @description Establishes foundational orchestration bounds for localized environment variable ingestion,
 * strict worker thread serialization bounds, localized browser sandboxing, and blockchain execution timeouts.
 */

import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// ES Module pathname injection for deterministic resolution across local directory nodes
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicit resolution for local cryptographic credentials file (.env)
const envPath = path.resolve(__dirname, '.env');
console.log(`📁 Loading framework execution context profiles from: ${envPath}`);
dotenv.config({ path: envPath });

// Infrastructure diagnostic checks for pipeline bootloader sanity
console.log(`🔐 Cryptographic context validation - WALLET_PASSWORD declared: ${process.env.WALLET_PASSWORD ? 'Yes' : 'No'}`);
console.log(`🔗 Target gateway node bound - BASE_URL: ${process.env.BASE_URL}`);

export default defineConfig({
  testDir: './tests',

  /**
   * 🔒 Absolute Concurrency Control Isolation (Mandatory for Web3/EVM Testing profiles)
   */
  workers: 1,

  /**
   * ⏱️ 超时改成 5 分钟，足够钱包启动 + 链上交互
   */
  timeout: 300000, // 5分钟

  /**
   * ⚖️ Global Reactive Expectation Assertions Latency Ceiling
   */
  expect: {
    timeout: 30000, // 30秒
  },

  // 👉 全局浏览器启动参数（GitHub Actions 必备）
  use: {
    headless: true, // 必须改成 true！GitHub 无界面
    baseURL: process.env.BASE_URL || 'https://app.uniswap.org',
    launchOptions: {
      args: [
        '--no-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
      ],
    },
  },

  projects: [
    {
      name: 'chrome',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
