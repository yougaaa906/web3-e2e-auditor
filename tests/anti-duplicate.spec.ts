/**
 * anti-duplicate.spec.ts - Concurrent Bombardment & Anti-Double-Spend Security Audits
 * @module AntiDuplicateSpec
 * @description Conducts a highly advanced quantitative stress test triggering instantaneous concurrent interaction loops.
 * Audits the front-end application's structural debounce shields across a defined Three-Tier Defensive Assertions Matrix:
 * 1. Overlay Uniqueness: Assert that only a singular external wallet extension viewport resolves under pressure.
 * 2. Interaction Lockout: Assert that the localized trigger component switches state boundaries to disabled post-click.
 * 3. Forensic Balance Auditing: Assert on-chain transaction logs to ensure only a single payload debit settles across remote nodes.
 */

import { test, expect, chromium, type BrowserContext, type Page } from '@playwright/test';
import { MetaMaskPage } from "../pages/wallet/MetaMaskPage";
import { DAppSwapPage } from '../pages/dapp/DAppSwapPage';
import { WalletConnectPage } from "../pages/dapp/WalletConnectPage";
import { CONFIG } from '../config/config';
import { verifyTxStatusViaRPC, getBalanceViaRPC } from '../utils/ChainHelper';

test.describe('Uniswap V3 Anti-Duplicate Transmission Security Auditing Matrix', () => {
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
        await page.goto(CONFIG.BASE_URL);

        swapPage = new DAppSwapPage(page);
        mmPage = new MetaMaskPage(page);
        connectPage = new WalletConnectPage(page);
    });

    test.afterEach(async () => {
        await context.close();
    });

    /**
     * Test Case: High-Velocity Concurrent Trigger Stressing to Audit Debounce Shields & Balance Invariance
     * * Audit Strategy Verification Matrix:
     * - Harness BigInt mathematical primitives to isolate numerical precision errors. Standard JavaScript Number 
     * boundaries fail to maintain structural sorting logic above MAX_SAFE_INTEGER (~9x10^15), while EVM 18-decimal fields 
     * require precise evaluation parameters scaled up to 10^18 Orders of Wei.
     */
    test('High-Order Stress Test: Rapid Concurrent Bombardment to Validate Debounce Mechanisms and Fund Invariance', async () => {
        let mmFullPage: Page;
        const userAddress = process.env.WALLET_ADDRESS!;

        // 💡 Strategic Safeguard: Declare outbound transactional values explicitly in BigInt Wei
        const swapAmountWei = BigInt("5000000000000000"); // 0.005 ETH mock payload encoded inside a BigInt structure
        const CLICK_COUNT = CONFIG.TEST_DATA.VIOLENT_CLICK_COUNT; // Quantified bombardment threshold waves

        // --- Milestone 0: Record Pre-execution Baseline States ---
        console.log(`📡 [Audit-Pre] Sampling baseline remote RPC account balances for target user address: ${userAddress}`);
        const balanceBefore = await getBalanceViaRPC(userAddress);
        console.log(`💰 [Audit-Pre] Initial Balance Ledger: ${balanceBefore.toString()} Wei`);

        // --- Milestone 1: Identity Allocation & Session Ingestion ---
        const connectPopup = await connectPage.connectToMetaMask();
        try {
            await mmPage.unlockWallet(connectPopup);
            console.log('🔓 [Audit-Pre] Credentials verified; extension wallet decrypted.');
        } catch (error) {
            console.log('💡 [Audit-Pre] Provider session pre-unlocked previously; skipping input sequencing.');
        }
        await mmPage.connectWallet(connectPopup);

        // Populate baseline exchange configurations to slide page elements into review dialog overlay states
        await swapPage.executeSwap();

        // --- Milestone 2: Active Stress Injection Control Pipeline ---
        console.log(`🚀 [Stress-Test] Initializing instantaneous pressure bombardment wave across Swap click triggers... Target: ${CLICK_COUNT} fast dispatches.`);

        // ⚡ Tactical Design Shift: Leverages native browser dispatchEvent handlers inside the PO wrapper instead of blocking driver clicks.
        // Strips automated framework visual validation barriers to inject pure concurrent load speeds without thread lock anomalies.
        const swapPopup = await swapPage.stressConfirmAndGetWallet(CLICK_COUNT);

        // --- Tier 1 Defensive Assertion: Structural Overlay Uniqueness ---
        await page.waitForTimeout(2000); // Buffer allowing background thread instances to finish runtime routing allocations
        const allPages = context.pages();
        const walletPopups = allPages.filter(p => p.url().includes('notification.html') || p.url().includes('confirm-transaction'));

        console.log(`📊 [Tier-1 Audit] Live transaction signature window allocations count: ${walletPopups.length}`);
        expect(walletPopups.length, '❌ CRITICAL PROTECTION DEFEATED: High-speed concurrent loads spawned multiple signature window modules! Front-end debounce shield failure detected!').toBe(1);

        // --- Tier 2 Defensive Assertion: Action Component Interaction Lockout ---
        const swapBtn = page.getByRole('button', { name: /Swap|Confirm/i }).last();
        if (await swapBtn.isVisible()) {
            await expect(swapBtn).toBeDisabled();
        } else {
            console.log('✅ [Tier-2 Audit] Core interaction triggers unmounted automatically post-click; excellent debounce effectiveness.');
        }

        // --- Milestone 3: Process Standard In-Context Signing Sequences ---
        console.log('✅ [Spec-Audit] Frontend defensive shields verified successfully; handing context over to wallet signing arrays...');
        const result = await mmPage.initiateAndConfirmSwap(swapPopup);
        const dappResponse = await swapPage.waitForDAppResponse();
        expect(dappResponse.isSuccess, 'DApp interface layer must project standard broadcast confirmation receipts').toBe(true);

        // --- Milestone 4: Query Node Logs for Invariance Reconciliation ---
        mmFullPage = await mmPage.openMetaMaskHome();
        const txHash = await mmPage.getLatestTransactionHash(mmFullPage);
        const txStatus = await verifyTxStatusViaRPC(txHash);

        // --- Tier 3 Defensive Assertion: Absolute Ledger Balance Forensic Analysis ---
        const balanceAfter = await getBalanceViaRPC(userAddress);

        // Execute forensic billing equations across isolated BigInt parameters
        const actualSpent = balanceBefore - balanceAfter;
        const expectedSpent = swapAmountWei + txStatus.totalGasFee;

        console.log(`📊 --- Post-Stress Forensic Audit Invariance Report ---`);
        console.log(`💰 Forecasted Combined Invoice Bill (Payload + Gas): ${expectedSpent.toString()} Wei`);
        console.log(`💸 Absolute Live Account Balance Expenditure Delta:   ${actualSpent.toString()} Wei`);

        // ⚠️ CRITICAL CONCURRENCY SECURITY TRAP: Irrespective of 5-cycle loading, only a singular debit lifecycle must consolidate!
        expect(actualSpent, '❌ SYSTEMIC DOUBLE-SPEND FAILURE: Live account statement expenditure mismatches bill invoice projections! Re-submitted actions triggered duplicate ledger debits!').toBe(expectedSpent);
        expect(txStatus.receipt.status, 'Remote node transaction logs verification execution indicator code must settle at 0x1').toBe('0x1');

        console.log('🏆 [PASS] Quantitative pressure audits finalized with perfect alignment! UI debounce parameters, window routing control, and on-chain asset invariance metrics passed with top engineering marks!');
    });
});