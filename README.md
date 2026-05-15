# 🚀 Web3 DApp E2E Automation Framework

![Playwright](https://img.shields.io/badge/Playwright-1.40+-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Web3](https://img.shields.io/badge/Web3-Ready-8A2BE2?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

A high-fidelity, enterprise-grade End-to-End (E2E) automation framework specifically engineered for Web3 Decentralized Applications (DApps). 

This framework seamlessly orchestrates complex interactions between the **DApp UI**, the **MetaMask Browser Extension**, and the **Ethereum Blockchain (JSON-RPC)**, featuring absolute financial reconciliation and front-end security vulnerability audits.

---

## 🌟 Core Architecture & Capabilities

* **On-Chain Financial Reconciliation:** Bypasses brittle UI assertions by cross-referencing expenditure deltas directly against RPC nodes using zero-loss `BigInt` Wei-level calculations (`Balance Delta === Payload + Gas Used`).
* **Extension Sandboxing:** Injects MetaMask dynamically into Playwright's Persistent Contexts, solving LevelDB/File System locking issues via strict `workers: 1` serialization.
* **Concurrency & Debounce Audits:** Bypasses standard framework actionability checks using raw DOM `dispatchEvent` to stress-test front-end Anti-Double-Spend mechanisms.
* **Mempool Stalling Simulation:** Manipulates Gas priorities to artificially stall transactions, auditing DApp resilience during asynchronous block ingestions.
* **Blind-Signing Optimization:** Utilizes reactive visibility hooks over rigid structural delays to drastically reduce execution bottlenecks during cryptographic signing.

---

## 🏗️ Directory Structure

```text
├── config/              
│   └── config.ts        # Global variables, timeouts, RPC endpoints, Gas parameters
├── fixtures/            
│   ├── walletFixtures.ts    # Root Chromium sandboxing & extension injection
│   └── connectedWalletFixtures.ts # Auto-authentication & session initialization
├── pages/
│   ├── BasePage.ts      # Foundation PO (Event wrappers, cross-context traps)
│   ├── dapp/            # DApp specific layouts (Swap form, Status monitoring)
│   └── wallet/          # MetaMask isolated contexts (Blind-signing hooks, Gas edits)
├── utils/
│   └── ChainHelper.ts   # Native JSON-RPC fetch wrappers (Stateless balance/receipt queries)
└── tests/               
    ├── wallet-auth.spec.ts       # Baseline extension authorization audits
    ├── transaction-status.spec.ts # End-to-End Wei-level financial reconciliation
    ├── transaction-actions.spec.ts # Underpriced gas stalling & pending state mitigation
    └── anti-duplicate.spec.ts    # High-velocity debounce shielding & concurrent bombardment
```

---

## ⚙️ Prerequisites & Setup

**1. System Requirements**
* Node.js (v18.0 or higher)
* NPM or Yarn
* A valid Sepolia Testnet RPC URL (e.g., Infura, Alchemy)

**2. Installation**
Clone the repository and install the required dependencies:
```bash
git clone <your-repository-url>
cd playwright-web3
npm install
```

**3. Environment Configuration**
Create a `.env` file in the root directory and populate it with your cryptographic credentials and target endpoints. Do not commit this file to version control.
```env
WALLET_PASSWORD=your_metamask_unlock_password
WALLET_ADDRESS=0xYourEthereumPublicAddress
BASE_URL=[https://app.uniswap.org](https://app.uniswap.org)
```

**4. MetaMask Extension Payload**
Ensure the unzipped MetaMask extension payload is located at the path specified in `config.ts` (default: `extension/metamask`).

---

## 🚀 Execution & CLI Commands

Due to Chromium file-locking mechanisms on the MetaMask extension `USER_DATA_PATH`, all Web3 test pipelines must strictly enforce the `workers: 1` parameter. This constraint is pre-configured in `playwright.config.ts`.

**Run the complete audit suite (Headed Mode):**
```bash
npx playwright test --grep-invert "env-setup" --headed
```

**Run the complete audit suite (Headless CI Mode):**
```bash
npx playwright test --grep-invert "env-setup"
```

**Run a specific security audit:**
```bash
npx playwright test tests/anti-duplicate.spec.ts --headed
```

**View HTML Test Reports:**
```bash
npx playwright show-report
```

---

## 🛡️ Engineering Safeguards & CI/CD Notes

* **Target Closed Exception Armor:** Rapid self-destruction of wallet notification popups can trigger false-negative `Target closed` errors in standard Playwright runs. This framework implements localized `catch` traps to absorb these specific exit codes safely.
* **Smart Polling vs. Network Idle:** DApps and Web3 extensions rely on perpetual JSON-RPC block-polling loops. The framework uses `load` and custom `waitForLocator` mechanisms instead of `networkidle` to prevent infinite timeout hangs.
* **BigInt Invariance:** All financial delta assertions are strictly executed using native `BigInt` primitives. Standard JavaScript `Number` types will truncate EVM 18-decimal configurations and silently invalidate test accuracy.

---

**Built with resilience for the Decentralized Web.** 💎
