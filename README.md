# Web3 DApp E2E Testing Framework
### Automated E2E testing and on-chain verification framework for decentralized applications

---

## 🏛️ Project Overview

This is an end-to-end automated testing project designed for decentralized applications, targeting Uniswap V3. Built on **Playwright (TypeScript)**, the framework addresses common engineering challenges in Web3 automation, including MetaMask interaction, asynchronous blockchain state confirmation, and forensic reconciliation between UI states and on-chain data.

Unlike traditional UI testing that relies solely on DOM status, this framework integrates browser-based user actions with back-end JSON-RPC verifications to ensure transaction integrity.

```text
       [ Playwright Execution Sandbox ]
                      |
        (Storage State / Extension Context)
                      V
 [ DApp Interface Host ]    [ MetaMask Wallet Extension ]
   (Uniswap Front-End)        (Isolated Provider Sandbox)
        \                          /
         \---(Transaction Flow)---/
                      |
        [ Decentralized Ledger (RPC) ] <--- (On-chain balance verification using ethers.js)
```

---

## 🛠️ Engineering Challenges & Solutions

### 1. Handling Asynchronous Input State Updates
Under high-frequency automated input, modern DApp front-ends (like Uniswap) often miss UI events, preventing the underlying RPC quote engine from activating.
* **Solution:** Instead of standard `.fill()`, the framework uses `pressSequentially` with simulated keystroke delays. This ensures the React state machine captures the input change fully, significantly improving the stability of quote generation.

### 2. On-chain Balance Verification
Validating a "Transaction Submitted" UI toast is insufficient for financial integrity.
* **Solution:** Integration with `ethers.js` and Sepolia RPC nodes. After broadcasting a transaction, the framework polls the RPC node for the transaction receipt and uses `BigInt` to calculate the delta of asset changes (BalanceBefore - BalanceAfter - ActualGas), ensuring precise balance reconciliation.

### 3. Extension State Management
MetaMask LevelDB caches often trigger read-write lock conflicts during concurrent testing.
* **Solution:** Execution is configured with `workers: 1` in `playwright.config.ts` for serial execution, paired with robust Context teardown and Global Timeout management. This approach reduced resource contention and improved execution consistency across the test suite.

---

## ⚙️ Project Structure

```text
├── config/
│   └── config.ts                 # Global environment thresholds & RPC settings
├── extension/
│   └── metamask/                 # Unpacked MetaMask extension binary
├── pages/                        # Page Object Model (POM) layer
│   ├── BasePage.ts               # Atomic Playwright primitive abstractions
│   ├── dapp/
│   │   ├── DAppSwapPage.ts       # Swap form, quote engine, & input logic
│   │   └── WalletConnectPage.ts  # Handshake protocols & network switching
│   └── wallet/
│       └── MetaMaskPage.ts       # Vault decryption & transaction signature controls
├── tests/                        # Testing matrix
│   ├── fixtures/                 # Dependency injection (DI) & env initialization
│   ├── env-setup.spec.ts         # Environment onboarding & storage state persistence
│   ├── anti-duplicate.spec.ts    # Debounce mechanism & click-spam stress testing
│   ├── transaction-status.spec.ts# Swap flow & JSON-RPC ledger reconciliation
│   └── transaction-actions.spec.ts # Simulated stalled-transaction (Pending) behavior
└── utils/
    └── ChainHelper.ts            # Ethers.js based RPC ledger analytical tools
```

---

## 🚀 Execution Guide

> ⚠️ **Disclaimer**: This project is intended for educational and testing purposes on Sepolia testnet only.

---
## 📊 Test Execution Dashboard
The following dashboard represents a successful audit matrix run against the Uniswap V3 integration. It validates critical security guardrails, including duplicate transmission prevention, pending session anomaly handling, and end-to-end on-chain reconciliation.

[Test Execution Summary]
<img width="1402" height="871" alt="image" src="https://github.com/user-attachments/assets/75fb860e-9e47-447d-8097-a007c1bb5544" />

*(Note: Each test case is designed as an atomic security audit point, ensuring zero regression risk for high-frequency transaction flows.)*

### 1. Environment Setup
Create a `.env` file in the root directory with the following parameters:
```env
WALLET_ADDRESS="0xYourAddress..."
MNEMONIC="your twelve word secret mnemonic pass phrase here"
WALLET_PASSWORD="your_password"
ALCHEMY_API_KEY="your_rpc_key"
```

### 2. Running the Tests
Initialize the environment (Wallet import & state caching):
```bash
npx playwright test env-setup.spec.ts --headed
```
Execute the core audit matrix:
```bash
npx playwright test --grep-invert "setup"
```

### 3. Reviewing Reports
The framework uses the native Playwright HTML reporter. After execution, view the detailed logs and snapshots:
```bash
npx playwright show-report
```

---

## 📊 Observations & Investigation Notes

This framework covers both Happy Path flows and complex edge cases.

### Covered Scenarios
1. **Duplicate Click Protection:** High-frequency Swap button spamming (5 clicks/sec) to verify the UI debounce mechanism triggers only one MetaMask signature window.
2. **Ledger Invariance:** Verifying the full `Connect -> Quote -> Sign -> Broadcast -> Mined` lifecycle with BigInt balance reconciliation.
3. **Mempool Stalling (Pending Transactions):** Simulating network congestion by manipulating Priority/Base fees to minimal values (`0.00...02 gwei`) and auditing DApp UI behavior during long-pending states.

### Engineering Observations on Instability
During the "Mempool Stalling" scenario (`transaction-actions.spec.ts`), the framework occasionally encounters `Target page, context or browser has been closed` errors.

**Initial Analysis & Investigation Directions:**
1. **Automation Lifecycle:** Extreme transaction pending times may trigger Playwright’s underlying timeout or context cleanup mechanisms.
2. **Extension Memory:** Long-standing stalled transactions cause continuous RPC polling by MetaMask, potentially impacting the Service Worker process stability.
3. **DApp Client Behavior:** The DApp's front-end state management may encounter lifecycle-related issues (e.g., unhandled timer/callback cleanups) when attempting to reconcile stalled transaction status for extended durations.

*Future plans include capturing Chrome DevTools Protocol (CDP) logs to further correlate these browser-level events.*
