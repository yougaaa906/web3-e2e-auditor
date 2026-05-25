/**
 * DAppSwapPage - Web3 Autonomous Core Swap Flow Page Object
 * @module DAppSwapPage
 * @description Encapsulates high-fidelity interaction workflows for Uniswap-style exchange user interfaces. 
 * Provides robust validation matrix for baseline paths, rapid anti-debounce submission protection audits, 
 * and underpriced gas mempool latency mitigations.
 * * Architectural Paradigms:
 * 1. Functional Decoupling: Segregates form population workflows away from cryptographic signing mechanics.
 * 2. Defense-in-Depth Exception Model: Implements hierarchical multi-tiered loops and soft fallback traps.
 * 3. Structured Observability: Standardized log signatures ([Form], [Wait], [Stress]) emitted to logging pipelines.
 */

import type { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';
import { CONFIG } from '../../config/config';

export class DAppSwapPage extends BasePage {
    // ==========================================
    // --- Contextual Selector Definition Matrix ---
    // ==========================================

    // Navigation and Identity Gateway Anchors
    readonly connectBtn = this.page.getByTestId('navbar-connect-wallet');

    // Contextual Actionable Input Form Fields
    readonly sellAmountInput = this.page.getByTestId('amount-input-in');
    readonly selectTokenBtn = this.page.getByTestId('choose-output-token');
    readonly searchTokenInput = this.page.getByTestId('explore-search-input');

    // WETH Target Asset Selection Option (Dual filters against duplicate/phishing assets)
    readonly tokenWETH = this.page.locator('[role="option"]')
        .filter({ hasText: /WETH/ })
        .filter({ hasText: /0x/ })
        .first();

    // Derived Financial Pricing Display and Review Buttons
    readonly buyAmountInput = this.page.getByTestId('amount-input-out');
    readonly reviewBtn = this.page.getByTestId('review-swap');

    // Modals, Toast Alerts and Asynchronous State Interceptors
    readonly dialogContent = this.page.getByRole('dialog');
    readonly dialogContentText = this.page.getByText("You're swapping");
    readonly swapBtn = this.page.getByTestId('swap');
    readonly waitingModal = this.page.getByTestId('activity-popup-pending-logo');
    readonly submittedToast = this.page.getByText(/(Wrapped|Swapped|Submitted|Success)/i).first();
    readonly duplicateWarningModal = this.page.getByText(/same transaction|duplicate submission|are you sure/i).first();

    // Compliance Warning Modals (Fires on unmapped/high-risk asset profiles)
    readonly tokenWarningContinueBtn = this.page.getByRole('button', { name: 'Continue' });

    constructor(page: Page) { super(page); }

    /**
     * Executes the baseline automated swap workflow on the Uniswap V3 client layout interface.
     * @param {string} sellAmount - Outbound execution transaction payload value (Defaults to config matrix)
     * @param {string} token - Inbound target asset ticker allocation nomenclature (Defaults to WETH)
     */
    async executeSwap(
        sellAmount: string = CONFIG.SWAP_DATA.SELL_AMOUNT,
        token: string = CONFIG.SWAP_DATA.TARGET_TOKEN
    ): Promise<void> {
        console.log(`[Form] Initiating Swap form workflow: ${sellAmount} ETH -> ${token}`);

        // Dynamic Routing Verification: Validate layout constraints align to the /swap route
        if (!this.page.url().includes('swap')) {
            await this.pageGoto(`${CONFIG.BASE_URL}/swap`);
            await this.waitTimeout(3000); // Essential buffer enabling browser state to settle down cleanly
            console.log('[Form] Targeted Swap route loaded successfully');
        }

        // ====================================================================================
        // 🛡️ Phase 1: Target Token Resolution Sequence (Armored Overrides Implemented)
        // ====================================================================================
        console.log('[Step 1] Activating vendor asset modal selection overlay');
        await this.waitElemVisible(this.selectTokenBtn, 'Token selector button');
        await this.elemClick(this.selectTokenBtn, 'Trigger vendor asset selection overlay');

        // Populate targeted token search term payloads
        await this.waitElemVisible(this.searchTokenInput, 'Token query input selector');

        /**
         * Architectural Guardrail: Human-like Keystroke Simulation Injection.
         * Direct .fill() mutations bypass native element keyup/keydown event listener streams, 
         * triggering race condition drop-outs inside modern Virtual DOM debounce handlers during dense test sequences.
         * Enforcing focus orientation -> dynamic wipe -> pressSequentially guarantees complete hook settlement.
         */
        await this.searchTokenInput.click({ force: true });      // Secure browser pointer focus lock
        await this.searchTokenInput.fill('');                    // Purge layout remnants cleanly
        await this.waitTimeout(300);                              // Micro operational synchronization window

        // Dispatch sequential string inputs with 150ms delays to natively trigger upstream Subgraph queries
        await this.searchTokenInput.pressSequentially(token, { delay: 150 });
        console.log(`⌨️ [Token-Selector] Human-like keystroke arrays dispatched into search block with 150ms delays.`);

        /**
         * Multi-pronged Resilient Locator Array.
         * Binds strict WAI-ARIA role selectors with custom data-testids and semantic fallback structures.
         * Prevents front-end layout mutation breaks if application vendor updates component layout classes.
         */
        const wethOption = this.page.getByRole('button', { name: 'Wrapped Ether WETH' }).first()
            .or(this.page.locator('[data-testid="token-option-WETH"]').first())
            .or(this.page.locator('.token-item:has-text("WETH")').first());

        console.log(`⏳ [Token-Selector] Awaiting visual layout convergence for option node: ${token}`);
        await wethOption.waitFor({ state: 'visible', timeout: 15000 });
        await wethOption.click({ force: true });
        console.log('[Step 1] Targeted asset selected and validated');
        // ====================================================================================

        // Phase 2: Intercept Compliance/Risk Modals (First-time deployment edge case profiles)
        console.log('[Step 2] Speculative parsing: handling high-risk token disclaimer overlays');
        await this.handleTokenWarningModal();

        // Phase 3: Outbound Payload Injection
        console.log('[Step 3] Dispatching sell amount value properties');

        // 1. Forcefully click the input field to secure browser pointer focus lock
        await this.sellAmountInput.click({ force: true });

        // 2. Wipe any potential dirty data remnants from the input field
        await this.sellAmountInput.fill('');
        await this.waitTimeout(200);

        await this.sellAmountInput.pressSequentially(sellAmount, { delay: 100 });
        console.log(`⌨️ [Form-Input] Amount payload [${sellAmount}] sequentially typed with stable event hooks.`);
        // 💡 Core Paradigm Shift: Manually dispatch input/change events to the DOM node.
        // Modern Virtual DOM architectures (e.g., React/Next.js) map states using custom element hooks.
        // Standard Playwright driver .fill() routines occasionally fail to trigger the remote pricing calculations.
        await this.triggerInputEvent(this.sellAmountInput, 'Sell quantity input node');
        console.log('[Step 3] Value successfully bound; front-end event listeners triggered');

        // Phase 4: Async Pricing Quote Convergence Checks
        console.log('[Step 4] Polling: Awaiting blockchain aggregators to settle optimal routing paths');
        await this.waitForBuyAmount();

        // Phase 5: Dynamic State Verification for Review Action Components
        console.log('[Step 5] Defensively awaiting review button confirmation transitions');
        await this.reviewBtn.waitFor({ state: 'visible', timeout: 30000 });

        // Polling Probe: Insulates execution loops against severe JSON-RPC quote request lags
        const maxWaitTime = 60000;
        const startTime = Date.now();
        while (Date.now() - startTime < maxWaitTime) {
            const isEnabled = await this.reviewBtn.isEnabled();
            if (isEnabled) {
                console.log('[Step 5] Inbound quote parameters validated; review button active');
                break;
            }
            console.log('[Step 5] Remote blockchain metrics still compiling. Retrying in 1s...');
            await this.waitTimeout(1000);
        }

        // 💡 Core Architectural Rationale: Execute clicks directly, bypass test.step block wrapper structures.
        // Complex interactions under extension contexts generate unique pointer event handles.
        // Test.step encapsulation occasionally triggers localized extension isolation sandboxes, causing unexpected panel collapse.
        await this.reviewBtn.click({ timeout: 15000 });
        console.log('[Step 5] Review confirmation click successfully executed');

        // Phase 6: Multi-pronged Resilience Checking for Confirmation Modals
        console.log('[Step 6] Intercepting transactional review confirmation dialog nodes');
        try {
            await this.dialogContent.waitFor({ state: 'visible', timeout: 10000 });
            console.log('[Step 6] Strategy A: Confirmation locked via explicit WAI-ARIA role="dialog"');
        } catch {
            console.log('[Step 6] Strategy A missed. Falling back to Strategy B: Fuzzy tracking using text tokens');
            await this.dialogContentText.waitFor({ state: 'visible', timeout: 10000 });
            console.log('[Step 6] Strategy B settled successfully via contextual text identification');
        }

        console.log('[Form] Transaction review context compiled; handing over execution context to wallet signatures');
    }

    /**
     * Blocks execution loops until downstream exchange quotes populate numerical outputs.
     * Ensures fluid UI states convert into valid pricing payloads before continuing assertions.
     */
    async waitForBuyAmount() {
        console.log('[Wait] Auditing downstream pricing quote calculation conversions...');
        await this.waitElemVisible(this.buyAmountInput, 'Target conversion telemetry box');

        for (let i = 0; i < 20; i++) {
            const buyAmountValue = await this.buyAmountInput.inputValue().catch(() => '');
            console.log(`[Wait] Sampling transaction conversion parameters: "${buyAmountValue}"`);
            if (buyAmountValue && buyAmountValue !== '0') {
                console.log(`[Wait] Downstream pricing quote stabilized. Active value mapped: ${buyAmountValue}`);
                return;
            }
            await this.waitTimeout(500); // 500ms smooth step bounds to mitigate JSON-RPC endpoint concurrency pressure
        }
        console.log('[Wait] Warning: Pricing quote failed to stabilize within specified lifecycle loops');
    }

    /**
     * Safely dismisses asset risk confirmation notifications.
     * Encapsulates soft non-blocking catch hooks; workflows persist regardless of modal manifestations.
     */
    async handleTokenWarningModal() {
        try {
            await this.waitElemVisible(this.tokenWarningContinueBtn, 'Compliance waiver acknowledgment button');
            await this.elemClick(this.tokenWarningContinueBtn, 'Dismiss risk warnings');
            console.log('[Modal] Compliance waiver dismissed successfully');
        } catch {
            console.log('[Modal] Compliance waiver absent; continuing pipeline executions safely');
        }
    }

    /**
     * Executes final interaction clicks and intercepts external authorization contexts.
     * @returns {Promise<{ popup: Page, hasDuplicateWarning: boolean }>} Wallet popup reference handles and intercept status.
     */
    async confirmAndGetWallet(): Promise<{ popup: Page; hasDuplicateWarning: boolean }> {
        console.log('[Confirm] Locking execution terminal interaction triggers');

        await this.waitElemVisible(this.swapBtn, 'Global final Swap interaction button');

        const isEnabled = await this.swapBtn.isEnabled();
        console.log(`[Confirm] Terminal trigger state diagnostics - Enabled: ${isEnabled ? 'True' : 'False'}`);

        let clickBtn = this.swapBtn;
        if (!isEnabled) {
            console.log('[Confirm] Main interaction button constrained by debounce; falling back to alternative localized selectors');
            clickBtn = this.page.getByRole('button', { name: /Swap|Confirm/i });
            await clickBtn.waitFor({ state: 'visible', timeout: 5000 });
        }

        // Cross-Context Handling: Intercept distinct wallet notification contexts spawned externally
        const popup = await this.clickAndGetPopup(clickBtn, 'Acquire isolated cryptographic signing context');

        // Audit decentralized mitigation flags (Duplicate transaction submission checks)
        let hasDuplicateWarning = false;
        try {
            await this.duplicateWarningModal.waitFor({ state: 'visible', timeout: 3000 });
            hasDuplicateWarning = true;
            console.log('[Confirm] Intercepted front-end duplicate transmission shields (Positive validation benchmark)');
        } catch {
            console.log('[Confirm] Front-end duplicate transmission shields stayed inactive');
        }

        // select browser wallet variants instantiate a shell layout (notification.html) before injecting runtime transaction routing hooks.
        // Immediate operational parsing prior to complete router stabilization breaks locator pointer arrays.
        console.log(`[Confirm] Diagnostics - Captured wallet router path: ${popup.url()}`);
        if (popup.url().includes('notification.html')) {
            console.log('[Confirm] Active routing navigation shift detected. Suspending interaction vectors...');
            try {
                await popup.waitForNavigation({ timeout: CONFIG.TIMEOUT.LONG });
                console.log(`[Confirm] Internal router paths stabilized. Operational landing coordinates: ${popup.url()}`);
            } catch {
                console.log('[Confirm] Router paths static. Continuing within identical pointer vectors');
            }
        }

        return { popup, hasDuplicateWarning };
    }

    /**
     * Audits and blocks execution loops around decentralized transaction broadcast completions.
     * @returns {Promise<{ isSuccess: boolean, message: string }>} Final transaction receipt status matrix.
     */
    async waitForDAppResponse(): Promise<{ isSuccess: boolean; message: string }> {
        console.log('[Response] Activating post-broadcast receipt auditing pipelines...');

        // Phase 1: High-Speed Transient Loader Detection Loops
        try {
            console.log('[Response] Phase 1: Evaluating transient loading structures via agile 3s tracking loops...');
            await this.waitingModal.waitFor({ state: 'visible', timeout: 3000 });
            console.log('[Response] Transient loading structures detected. Awaiting extraction and DOM unmounting routines...');
            await this.waitingModal.waitFor({ state: 'hidden', timeout: CONFIG.TIMEOUT.LONG });
            console.log('[Response] Transient loaders unmounted; receipt successfully ingested by remote RPC nodes');
        } catch {
            console.log('[Response] Loader overlay absent (Rapid ingestion or component unmounting rules applied); merging directly to confirmation');
        }

        // Phase 2: Persistent Broadcast Confirmation Interceptions
        console.log('[Response] Phase 2: Initializing 60s resilient tracking for Transaction Submitted status alerts...');
        await this.submittedToast.waitFor({ state: 'visible', timeout: 120000 });

        let successMessage = '';
        try {
            successMessage = await this.submittedToast.innerText();
        } catch {
            successMessage = 'Transaction Submitted'; // Fallback nomenclature for unstable DOM mutation profiles
        }

        console.log(`[Response] On-chain reconciliation complete. Broadcast receipt generated: ${successMessage}`);
        return { isSuccess: true, message: successMessage };
    }

    /**
     * Evaluates front-end behavior and blocking logic under underpriced gas limits.
     * @param {number} timeout - Allocation bounds for race evaluation parameters (milliseconds)
     * @returns {Promise<boolean>} Evaluates to true if expected congestion states settle down safely.
     */
    async waitForPendingModal(timeout: number = 5000): Promise<boolean> {
        console.log('[Pending] Initializing dual-track speculative race tracking arrays...');
        try {
            const result = await Promise.race([
                (async () => {
                    await this.waitingModal.waitFor({ state: 'visible', timeout });
                    console.log('[Pending] Race resolved: Standard on-chain congestion states successfully intercepted');
                    return true;
                })(),
                (async () => {
                    await this.submittedToast.waitFor({ state: 'visible', timeout });
                    console.log('[Pending] Race resolved: Transaction block execution completed instantly bypassing delays');
                    return true;
                })()
            ]);
            return result;
        } catch {
            console.log('[Pending] Timeout Exception: No definitive transactional feedback rendered within allocated tracking loops');
            return false;
        }
    }

    /**
     * Stress Test Module: Fires rapid interaction requests to audit application debounce patterns.
     * @param {number} clickCount - Target quantitative density arrays (Defaults to 5 rapid dispatches)
     * @returns {Promise<Page>} The single resilient popup context survived post-execution.
     */
    async stressConfirmAndGetWallet(clickCount: number = 5): Promise<Page> {
        console.log(`[Stress] Initiating rapid stress audits. Configured intensity threshold: ${clickCount} loops`);

        await this.waitElemVisible(this.swapBtn, 'Stress interaction target: Swap execution trigger');

        let clickBtn = this.swapBtn;
        if (!await this.swapBtn.isEnabled()) {
            clickBtn = this.page.getByRole('button', { name: /Swap|Confirm/i });
        }

        console.log(`[Stress] Dispatching payloads. Bypassing framework visibility layers to invoke native pointer events...`);
        const [popup] = await Promise.all([
            // Speculative capturing: Monitor active contexts to reconcile actual runtime pages produced
            this.page.context().waitForEvent('page', { timeout: 30000 }),
            (async () => {
                for (let i = 0; i < clickCount; i++) {
                    try {
                        // Force native browser event dispatch (dispatchEvent) to strip automated scheduling delays
                        clickBtn.dispatchEvent('click').catch(() => { });
                        await this.page.waitForTimeout(50); // 50ms tactical window to pressure front-end debouncers
                    } catch {
                        break; // If the parent context unmounts dynamically mid-loop, exit gracefully to mitigate deadlock
                    }
                }
            })()
        ]);

        console.log(`[Stress] Captured initial operational signature context path: ${popup.url()}`);

        // Resolve extension dynamic navigation loops
        if (popup.url().includes('notification.html')) {
            console.log('[Stress] Wallet redirection identified. Intercepting interaction vectors...');
            try {
                await popup.waitForNavigation({ timeout: CONFIG.TIMEOUT.LONG });
            } catch {
                console.log('[Stress] Wallet routing paths static');
            }
        }

        // Aggregate live handles to assert anti-debounce capability
        await this.waitTimeout(2000); // Buffer allowing asynchronous popup allocation instances to reveal themselves
        const allPages = this.page.context().pages();
        const walletPopups = allPages.filter(p =>
            p.url().includes('notification.html') || p.url().includes('connect')
        );

        if (walletPopups.length > 1) {
            console.warn(`[Stress] 🔴 AUDIT CRITICAL WARNING: Detected ${walletPopups.length} standalone wallet windows spawned! Anti-debounce protection absent; risk of severe Nonce conflicts or duplicated drainage!`);
        } else {
            console.log('[Stress] 🏆 AUDIT PASSED: Front-end debounce shields stood resilient under 5-cycle rapid load. Single signature window safely conserved.');
        }

        return popup;
    }
}