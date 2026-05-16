/**
 * transaction-status.spec.ts - End-to-End On-Chain Reconciliation & Financial Audit Suites
 * @module TransactionStatusSpec
 * @description Executes rigorous cryptographic audits verifying the baseline swap workflow on Uniswap V3.
 * Cross-references ephemeral browser interaction states with absolute, immutable blockchain ledger events
 * via JSON-RPC telemetry, ensuring zero-loss precision billing audits down to the single Wei.
 * * Architectural Paradigms & Isolation Constraints:
 * 1. Sequential Block Packager Execution: Restricts runtime profiles to workers = 1 to insulate database file locks.
 * 2. BigInt Precision Defense: Enforces strict JavaScript BigInt representations to capture 18-decimal EVM values.
 * 3. Atomic Sandbox Lifecycles: Mounts and tears down persistent custom browser extension modules per test script.
 */

import { test, expect, chromium, type BrowserContext, type Page } from '@playwright/test';
import { MetaMaskPage } from "../pages/wallet/MetaMaskPage";
import { DAppSwapPage } from '../pages/dapp/DAppSwapPage';
import { WalletConnectPage } from "../pages/dapp/WalletConnectPage";
import { CONFIG } from '../config/config';
import { verifyTxStatusViaRPC, getBalanceViaRPC } from '../utils/ChainHelper';
import { DAppStatusPage } from '../pages/dapp/DAppStatusPage';

test.describe('Uniswap V3 On-Chain Transaction Status Auditing Matrix', () => {
    let context: BrowserContext;
    let page: Page;
    let swapPage: DAppSwapPage;
    let mmPage: MetaMaskPage;
    let connectPage: WalletConnectPage;

    const METAMASK_PATH = CONFIG.METAMASK.EXTENSION_PATH;
    const USER_DATA_PATH = CONFIG.METAMASK.USER_DATA_PATH;

    test.beforeEach(async () => {
        context = await chromium.launchPersistentContext(USER_DATA_PATH, {
            headless: false,
            args: [
                `--disable-extensions-except=${METAMASK_PATH}`,
                `--load-extension=${METAMASK_PATH}`
            ]
        });

        page = await context.newPage();
        connectPage = new WalletConnectPage(page);
        swapPage = new DAppSwapPage(page);
        mmPage = new MetaMaskPage(page);
        const statusPage = new DAppStatusPage(page);
        await page.goto(CONFIG.BASE_URL);
    });

    test.afterEach(async () => {
        await context.close();
    });

    /**
     * Test Case: Baseline Exchange Workflow - Converting ETH to WETH Wrapped Liquidity
     * * Audit Strategy Verification Matrix:
     * 1. Identity Allocation: Connect wallet session and settle authorization layers.
     * 2. Transaction Setup: Ingest form payloads and populate price quote calculations dynamically.
     * 3. Inter-context Handshake: Force signature processing via armored window resuscitator handlers.
     * 4. Post-broadcast Telemetry: Intercept front-end confirmation toast configurations.
     * 5. Extraction Layer: Retrieve the unalterable 66-character block tx hash signature from logs.
     * 6. RPC Query Convergence: Evaluate receipt transaction codes directly across nodes.
     * 7. Absolute Financial Reconciliation: Assert delta equation balances out identically down to the single Wei.
     */
    test('Standard Transaction: Converting Native ETH to Wrapped WETH Liquidity', async () => {
        let mmFullPage: Page;

        // 💡 Strategic Safeguard: Harness BigInt primitives to armor numbers against catastrophic rounding issues.
        // Standard JavaScript Number boundaries break down at MAX_SAFE_INTEGER (~9x10^15), whereas native EVM financial 
        // parameters are calculated across 18-decimal fields reaching 10^18 orders of scale.
        let balanceBefore: bigint;
        let balanceAfter: bigint;
        const userAddress = process.env.WALLET_ADDRESS!;
        const swapAmountWei = BigInt("5000000000000000"); // Standard mock token payload: 0.005 ETH mapped in Wei

        // --- Milestone 0: Extract Pre-execution Baseline Ledger States ---
        console.log(`📡 [Spec-Audit] Querying initial RPC ledger account balance for target user address: ${userAddress}`);
        balanceBefore = await getBalanceViaRPC(userAddress);

        // Milestone 1: Cross-Context Identity Binding
        const connectPopup = await connectPage.connectToMetaMask();
        try {
            await mmPage.unlockWallet(connectPopup);
        } catch (error) {
            console.log('💡 [Spec-Audit] Provider session unlocked previously; skipping input sequencing.');
        }
        await mmPage.connectWallet(connectPopup);

        // Milestone 2: Form Payload Injection and Quote Stabilization Loops
        await swapPage.executeSwap();

        // Milestone 3: Intercept Active Context Triggers and Fetch Confirmation View Handle
        const { popup: swapPopup } = await swapPage.confirmAndGetWallet();

        // Milestone 4: Armored Critical Path Signature Click
        // 🛡️ Strategic Design: Deploys initiateAndConfirmSwap to shield process sequences from sudden Target Closed drops.
        const result = await mmPage.initiateAndConfirmSwap(swapPopup);

        // Milestone 5: Intercept Application UI Broadcast Acknowledgments
        const dappResponse = await swapPage.waitForDAppResponse();
        expect(dappResponse.isSuccess).toBe(true);

        // Milestone 6: Reconcile Structural Ledgers to Capture Unique Hash Signatures
        mmFullPage = await mmPage.openMetaMaskHome();
        const txHash = await mmPage.getLatestTransactionHash(mmFullPage);

        // Milestone 7: Direct Out-of-Band RPC Execution Check
        console.log('🔍 [Spec-Audit] Polling remote JSON-RPC nodes to parse receipt code states and extract gas billing details...');
        const txStatus = await verifyTxStatusViaRPC(txHash);

        // --- Milestone 8: Financial Forensic Audit & Complete Statement Reconciliation ---
        balanceAfter = await getBalanceViaRPC(userAddress);

        // Parse actual expenditure delta variables against mathematical ledger forecasts
        const actualSpent = balanceBefore - balanceAfter;
        const expectedSpent = swapAmountWei + txStatus.totalGasFee;

        console.log(`📊 --- Post-Execution Forensic Audit Statement Report ---`);
        console.log(`💰 Initial Balance Ledger: ${balanceBefore.toString()} Wei`);
        console.log(`💰 Final Balance Ledger:   ${balanceAfter.toString()} Wei`);
        console.log(`💸 Real Expenditure Delta: ${actualSpent.toString()} Wei`);
        console.log(`⛽ Expected Bill Invoice (Payload + Gas): ${expectedSpent.toString()} Wei`);

        // 🛡️ Critical Security Assertion Matrix: Three-way Cryptographic Reconciliation
        // 1. Transaction Confirmation Status: Settle blockchain state parameters confirm successful ingestion.
        expect(txStatus.isSuccess, 'Target transaction hash should finalize in a successful state on-chain').toBe(true);
        // 2. EVM Receipt Invariance: Assert machine receipt status code yields exact byte profiles (0x1).
        expect(txStatus.receipt.status, 'EVM execution receipt verification indicator must yield 0x1').toBe('0x1');
        // 3. Absolute Mathematical Balance: Ensure actual balance changes precisely match bill projections.
        expect(actualSpent, '❌ CRITICAL BILLING AUDIT ALARM: On-chain ledger balance changes mismatch expected billing statement invoice parameters!').toBe(expectedSpent);

        console.log('🏆 [Spec-Audit] SUCCESS! Front-end UI flows, decentralized ledger states, and forensic accounts are in absolute alignment!');
    });
});