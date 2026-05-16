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
   * * Architectural Rationale:
   * 1. File Locks Conflict Mitigation: The underlying MetaMask browser extension persistent cache data structure 
   * is file-system bound. Multi-threaded worker invocation will trigger structural database lock errors within Chromium.
   * 2. Transaction Sequence Integrity: Mempool broadcasts must preserve explicit, sequential cryptographic Nonce orderings.
   * 3. Shared State Mutation Prevention: Account states (ETH balance, ERC-20 allowances) are mutated live on-chain. 
   * Parallel pipelines introduce volatile test data pollution.
   */
  workers: 1,

  /**
   * ⏱️ Comprehensive Test Lifecycle Timeout Bounds (Configured at 120,000ms)
   * * Engineering Constraints:
   * - EVM execution relies on decentralized consensus block packaging. Average block ingestion timelines
   * hover around ~12 seconds on Ethereum/Sepolia testnets, excluding mempool gas underpricing surges.
   * - Retries and multi-stage block explorer node DOM sync loops require expansive scheduling budgets.
   */
  timeout: 120000,

  /**
   * ⚖️ Global Reactive Expectation Assertions Latency Ceiling (Configured at 10,000ms)
   * * Engineering Constraints:
   * - Tailored to absorb front-end data synchronization delays caused by latency lag between 
   * the client DApp state engine, localized state management hooks, and remote JSON-RPC nodes.
   */
  expect: {
    timeout: 10000,
  },

  use: {
    headless: false,
    baseURL: process.env.BASE_URL || 'https://app.uniswap.org',
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