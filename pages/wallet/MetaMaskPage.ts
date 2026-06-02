/**
 * MetaMaskPage - Web3 Provider Sandbox Operations & Security Page Object
 * @module MetaMaskPage
 * @description Encapsulates standard cryptographical wallet interaction patterns for the MetaMask browser extension.
 * Provides critical defenses against transient context unmounting, elastic gas injection management, and robust on-chain transaction hash extraction hooks.
 * * Architectural Paradigms:
 * 1. Target Closed Armor: Implements forced pointer dispatches and speculative click tracking to digest rapid panel self-destruction.
 * 2. Window Resuscitator Loops: Deploys proactive context scanning to re-acquire transient extension popup hooks.
 * 3. Blind Signing Optimization: Prefers reactive visibility checks over blocking layout expectations to secure critical path interaction speeds.
 */

import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';
import { CONFIG } from '../../config/config';
import { logger } from '../../utils/logger';

export class MetaMaskPage extends BasePage {
    // ==================================================
    // 🔐 Authentication & Credential Locators
    // ==================================================
    private readonly unlockPasswordInput = (handle: Page) => handle.getByTestId('unlock-password');
    private readonly unlockSubmitButton = (handle: Page) => handle.getByTestId('unlock-submit');

    // ==================================================
    // 🔗 Authorization & Connection Locators
    // ==================================================
    private readonly confirmButton = (handle: Page) => handle.getByTestId('confirm-btn');

    // ==================================================
    // 🔄 Transaction Interaction & Sign Locators
    // ==================================================
    private readonly sendAmountPill = (handle: Page) => handle.getByTestId('simulation-rows-outgoing').getByTestId('simulation-details-amount-pill');
    private readonly receiveAssetPill = (handle: Page) => handle.getByTestId('simulation-rows-incoming').getByTestId('simulation-details-asset-pill');
    private readonly interactingWithRow = (handle: Page) => handle.getByTestId('transaction-details-recipient-row');
    private readonly nativeCurrencyGasFee = (handle: Page) => handle.getByTestId('native-currency');
    private readonly confirmSwapButton = (handle: Page) => handle.getByTestId('confirm-footer-button');
    private readonly cancelConfirmSwapButton = (handle: Page) => handle.getByTestId('confirm-footer-cancel-button');

    // ==================================================
    // 📊 Activity & Historical Ledger Locators
    // ==================================================
    private readonly activityTabButton = (handle: Page) => handle.getByRole('button', { name: 'Activity' });
    private readonly firstTransactionItem = (handle: Page) => handle.getByTestId('activity-list-item').first();
    private readonly transactionStatusLabel = (parent: Locator) => parent.locator('.transaction-status-label');
    private readonly walletBalanceDisplay = (handle: Page) => handle.getByTestId('account-value-and-suffix');
    private readonly blockExplorerLink = (handle: Page) => handle.getByRole('button', { name: 'View on block explorer' });

    // ==================================================
    // ⛽ Gas Fee Orchestration Locators
    // ==================================================
    private readonly editGasFeeButton = (handle: Page) => handle.getByTestId('edit-gas-fee-icon');
    private readonly advancedGasButton = (handle: Page) => handle.getByTestId('edit-gas-fee-item-custom');
    private readonly baseFeeInput = (handle: Page) => handle.getByTestId('base-fee-input');
    private readonly priorityFeeInput = (handle: Page) => handle.getByTestId('priority-fee-input');
    private readonly saveGasButton = (handle: Page) => handle.getByRole('button', { name: 'Save' });

    // =========================================================================
    // 🎯 Declarative Locator Registries (Decoupled MetaMask DOM Targets)
    // =========================================================================

    // --- Multichain Permission Interception Form ---
    protected readonly networkCardContainer = (handle: Page) => handle.locator('.multichain-connection-list-item, [data-testid="site-cell-connection-list-item"]');
    protected readonly networkEditBtn = (handle: Page) => this.networkCardContainer(handle).filter({ hasText: 'Use your enabled networks' }).getByTestId('edit');
    protected readonly selectAllToggle = (handle: Page) => handle.locator('label').filter({ hasText: 'Select all' });

    // --- Target Network Identification (Sepolia Row) ---
    protected readonly sepoliaRowItem = (handle: Page) => handle.locator('.multichain-network-list-item').filter({ has: handle.getByTestId('Sepolia') });
    protected readonly sepoliaCheckbox = (handle: Page) => this.sepoliaRowItem(handle).locator('input[type="checkbox"]');
    protected readonly networkUpdateBtn = (handle: Page) => handle.locator('button:has-text("Update"), [data-testid="update"]');

    // --- Outbound Handshake Finalization Handlers (Fallback Array) ---
    protected readonly handshakeSubmitSelectors = (handle: Page) => [
        handle.getByTestId('page-container-footer-next'),
        handle.locator('button:has-text("Connect")'),
        handle.locator('button:has-text("Done")'),
        handle.getByTestId('confirm-btn')
    ];

    constructor(page: Page) {
        super(page);
    }

    /**
     * Unlocks the MetaMask wallet vault instance.
     * @param {Page} handle - Target extension window handle (Popup or full-screen dashboard page).
     * @param {string} [password] - Decryption credentials passphrase (Defaults to process.env.WALLET_PASSWORD).
     */
    async unlockWallet(handle: Page, password?: string) {
        logger.info('WALLET_FLOW', 'VAULT_UNLOCK', 'Initiating provider decryption sequence...');
        const walletPassword = password || process.env.WALLET_PASSWORD || '';

        if (!walletPassword) {
            throw new Error('Cryptographic credentials absent. Configure WALLET_PASSWORD variables or supply parameter parameters.');
        }

        try {
            await this.waitElemVisible(this.unlockPasswordInput(handle), 'Credentials password input field');
            await this.elemFill(this.unlockPasswordInput(handle), walletPassword, 'Inject credentials payload');
            await this.elemPress(this.unlockPasswordInput(handle), 'Enter', 'Dispatch enter key stroke sequence');

            // Soft-Armor Armor: Enter key stroke occasionally forces auto-submission, bypassing the submit button click
            try {
                await this.waitElemVisible(this.unlockSubmitButton(handle), 'Decryption submission trigger');
                if (await this.unlockSubmitButton(handle).isVisible() && await this.unlockSubmitButton(handle).isEnabled()) {
                    await this.elemClick(this.unlockSubmitButton(handle), 'Click decryption submit button');
                }
            } catch (e) {
                logger.info('WALLET_FLOW', 'VAULT_BYPASS', 'Decryption submission handled via input hooks; submission button bypassed safely.');
            }

            logger.info('WALLET_FLOW', 'VAULT_SUCCESS', 'Extension decryption complete; sandbox unlocked.');
        } catch (error) {
            logger.error('WALLET_FLOW', 'VAULT_ERROR', 'Extension decryption failed: ' + error);
            throw error;
        }
    }

    /**
     * Confirms handshake authorization between the host application and provider.
     * @description Orchestrates granular multi-chain permission realignments on incoming popups.
     * Employs structured defensive fallback iterations during finalization to guarantee 
     * cross-version architectural compatibility with mutated MetaMask DOM rollouts.
     * @param {Page} handle - The active, sandboxed extension popup context handle.
     * @returns {Promise<void>} Resolves once peer channel handshake status consolidates at EVM level.
     */
    async connectWallet(handle: Page): Promise<void> {
        logger.info('WALLET_FLOW', 'HANDSHAKE_INIT', 'Active popup frame trapped. Realigning multichain threshold matrices...');

        // Yield execution thread line to ensure React virtual layout components render completely
        await handle.waitForLoadState('networkidle').catch(() => { });
        await handle.waitForTimeout(1500);

        try {
            // --- Phase 1: Isolated Network Mutation Interception ---
            const editBtn = this.networkEditBtn(handle).first();

            if (await editBtn.isVisible({ timeout: 4000 })) {
                await editBtn.click({ force: true });
                logger.info('WALLET_FLOW', 'HANDSHAKE_STEP1', 'Target multi-instance collision bypassed. Entered network modifier array.');
                await handle.waitForTimeout(800);

                // --- Phase 2: Inverted Ledger Selection Cleanups ---
                const selectAllLabel = this.selectAllToggle(handle).first();
                await selectAllLabel.scrollIntoViewIfNeeded();
                await selectAllLabel.click({ force: true });
                logger.info('WALLET_FLOW', 'HANDSHAKE_STEP2', 'Universal multi-chain inversion triggered. Active check states cleared.');
                await handle.waitForTimeout(800);

                // --- Phase 3: Cryptographic Target Pinning (Sepolia Injection) ---
                logger.info('WALLET_FLOW', 'HANDSHAKE_STEP3', 'Pinning targeted Sepolia node coordinates inside layout list...');
                const targetCheckbox = this.sepoliaCheckbox(handle).first();

                // Enforce rigid registration bounds to absorb asynchronous DOM append latency
                await targetCheckbox.waitFor({ state: 'attached', timeout: 5000 });
                await targetCheckbox.scrollIntoViewIfNeeded();
                await targetCheckbox.click({ force: true });
                logger.info('WALLET_FLOW', 'HANDSHAKE_STEP3_PIN', 'Target checkbox successfully forced to checked state: Sepolia Network pinned.');
                await handle.waitForTimeout(800);

                // --- Phase 4: State Serialization Matrix Save ---
                const updateBtn = this.networkUpdateBtn(handle).first();
                await updateBtn.click({ force: true });
                logger.info('WALLET_FLOW', 'HANDSHAKE_STEP4', 'Mutated layout parameters serialized. Transmitting state to extension DB...');
                await handle.waitForTimeout(1200);
            } else {
                logger.info('WALLET_FLOW', 'HANDSHAKE_SHIELD', 'Multichain permission shield absent; network threshold pre-cached or configuration bypassed.');
            }
        } catch (err: any) {
            logger.error('WALLET_FLOW', 'HANDSHAKE_ERROR', 'CRITICAL AUTOPROVISIONING FAILURE: Multi-chain interception pipeline collapsed: ' + err.message);
            throw err;
        }

        // --- Phase 5: Downstream Handshake Finalization (Connect Bombardment) ---
        logger.info('WALLET_FLOW', 'HANDSHAKE_STEP5', 'Launching fallback handler matrix to dispatch transaction channel permission...');

        let connected = false;
        const potentialTriggers = this.handshakeSubmitSelectors(handle);

        for (const selector of potentialTriggers) {
            try {
                if (await selector.isVisible({ timeout: 2000 })) {
                    await selector.click({ force: true });
                    connected = true;
                    logger.info('WALLET_FLOW', 'HANDSHAKE_SUCCESS', 'Peer channel authorized! Handshake successfully established with Client DApp.');
                    break;
                }
            } catch (e) {
                // Gracefully fall back to query the next candidate signature trigger inside the array matrix
            }
        }

        if (!connected) {
            throw new Error('❌ FATAL ARCHITECTURAL BLOCK: Handshake steps finalized but final connection buttons eluded standard selector capture loops.');
        }
    }

    /**
     * Mounts and establishes an explicit full-page MetaMask dashboard tab context.
     * @returns {Promise<Page>} The active full-page home dashboard context.
     */
    async openMetaMaskFullPage() {
        const context = this.page.context();
        let fullPage = context.pages().find(p => p.url().includes('home.html'));

        if (!fullPage) {
            fullPage = await context.newPage();
            await fullPage.goto(`chrome-extension://${CONFIG.METAMASK.EXTENSION_ID}/home.html`);
            await fullPage.waitForLoadState('networkidle');
        }

        await fullPage.bringToFront();
        return fullPage;
    }

    /**
     * Samples baseline transaction attributes from the provider extension screen.
     * @param {Page} handle - Target extension window handle.
     * @returns {Promise<{ originWalletBalance: string, sendAmount: string, gasPrice: string }>} Initial transaction metrics.
     */
    async initiateSwap(handle: Page) {
        logger.info('WALLET_FLOW', 'SIMULATION_INIT', 'Awaiting transaction parameters to compile inside provider UI...');

        await this.sendAmountPill(handle).waitFor({ state: 'visible', timeout: 30000 });
        await this.receiveAssetPill(handle).waitFor({ state: 'visible', timeout: 30000 });
        await this.confirmSwapButton(handle).waitFor({ state: 'visible', timeout: 30000 });

        const sendAmount = await this.sendAmountPill(handle).innerText();
        const gasPrice = await this.nativeCurrencyGasFee(handle).innerText();

        let originWalletBalance = '';
        try {
            originWalletBalance = await this.walletBalanceDisplay(handle).innerText();
        } catch (e) {
            logger.warn('WALLET_FLOW', 'SIMULATION_WARN', 'Current active balance inaccessible inside standard signature panels');
            originWalletBalance = 'N/A';
        }

        logger.debug('WALLET_FLOW', 'SIMULATION_DATA', 'Baseline Balance: ' + originWalletBalance);
        logger.debug('WALLET_FLOW', 'SIMULATION_DATA', 'Outbound Payload Amount: ' + sendAmount);
        logger.debug('WALLET_FLOW', 'SIMULATION_DATA', 'Network Gas Premium: ' + gasPrice);

        return { originWalletBalance, sendAmount, gasPrice };
    }

    /**
     * Confirms transactional signature requests with high structural mitigation defenses.
     * @param {Page} handle - Target extension window handle.
     */
    async confirmSwap(handle: Page) {
        logger.info('WALLET_FLOW', 'SIGNATURE_INIT', 'Positioning pointers over final signature components...');
        let targetPage = handle;

        if (!handle || handle.isClosed()) {
            logger.warn('WALLET_FLOW', 'SIGNATURE_WARN', 'Signature handle destroyed. Attempting context reconstruction loops...');
            const pages = handle.context().pages();
            const walletPage = pages.find(p => p.url().includes('chrome-extension://') && p.url().includes('confirm-transaction'));

            if (walletPage) {
                targetPage = walletPage;
                logger.info('WALLET_FLOW', 'SIGNATURE_RECOVER', 'Successfully re-acquired provider context hooks');
            } else {
                throw new Error('❌ Critical: Provider signature context destroyed; recovery array exhausted.');
            }
        }

        try {
            await this.confirmSwapButton(targetPage).click({ force: true, timeout: 10000 });
            await targetPage.waitForEvent('close', { timeout: 3000 }).catch(() => { });
            logger.info('WALLET_FLOW', 'SIGNATURE_SUCCESS', 'Signature click dispatched successfully; transaction broadcasted.');
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            if (errorMessage.includes('Target closed') || errorMessage.includes('Session closed')) {
                logger.info('WALLET_FLOW', 'SIGNATURE_CLOSED', 'Provider window successfully completed self-destruction routines.');
            } else {
                logger.error('WALLET_FLOW', 'SIGNATURE_ERROR', 'Critical failure dispatched upon final confirmation click: ' + e);
                throw e;
            }
        }

        return { originWalletBalance: '', sendAmount: '', gasPrice: '' };
    }

    /**
     * Fully comprehensive transaction sign workflow fitted with a multi-layered armoring matrix.
     * Handles transient window resuscitations, blind-signing speed optimizations, and error interceptions.
     */
    async initiateAndConfirmSwap(handle: Page) {
        logger.info('WALLET_FLOW', 'PIPELINE_INIT', 'Executing high-resilience signature pipeline combo (Armor Edition)...');
        let targetPage = handle;

        // ==========================================
        // 🛡️ Armor Layer 1: Popup Window Resuscitator
        // ==========================================
        if (!handle || handle.isClosed()) {
            logger.warn('WALLET_FLOW', 'PIPELINE_WARN', 'Active panel context unmounted. Launching reconstructor tracking loops...');
            let walletPage: Page | undefined;
            const context = this.page.context();

            for (let i = 0; i < 20; i++) {
                walletPage = context.pages().find(p => {
                    const url = p.url();
                    return url.includes('chrome-extension://') &&
                        (url.includes('notification.html') || url.includes('confirm-transaction'));
                });

                if (walletPage) {
                    targetPage = walletPage;
                    logger.info('WALLET_FLOW', 'PIPELINE_RECOVER', 'Recovery loop index ' + (i + 1) + ': Intercepted active recreated popup context.');
                    break;
                }
                await this.page.waitForTimeout(500);
            }

            if (!walletPage) {
                throw new Error('❌ Context recovery exhausted: Failed to capture live provider popups within 10s.');
            }
        }

        // ==========================================
        // ⚡ Armor Layer 2: Speed Optimization (Blind Sign Probe)
        // ==========================================
        logger.info('WALLET_FLOW', 'PIPELINE_FIND', 'Locating signature dispatch components quickly...');
        await this.confirmSwapButton(targetPage).waitFor({ state: 'visible', timeout: 15000 });

        let sendAmount = 'N/A';
        let gasPrice = 'N/A';
        let originWalletBalance = 'N/A';

        try {
            if (await this.sendAmountPill(targetPage).isVisible()) {
                sendAmount = await this.sendAmountPill(targetPage).innerText();
            }
            if (await this.nativeCurrencyGasFee(targetPage).isVisible()) {
                gasPrice = await this.nativeCurrencyGasFee(targetPage).innerText();
            }
            if (await this.walletBalanceDisplay(targetPage).isVisible()) {
                originWalletBalance = await this.walletBalanceDisplay(targetPage).innerText();
            }
        } catch (e) {
            logger.info('WALLET_FLOW', 'PIPELINE_BYPASS', 'Asset parameters extraction bypassed to mitigate transaction payload expiration risks.');
        }

        logger.debug('WALLET_FLOW', 'PIPELINE_DATA', 'Baseline Balance: ' + originWalletBalance);
        logger.debug('WALLET_FLOW', 'PIPELINE_DATA', 'Outbound Payload Amount: ' + sendAmount);
        logger.debug('WALLET_FLOW', 'PIPELINE_DATA', 'Network Gas Premium: ' + gasPrice);
        logger.info('WALLET_FLOW', 'PIPELINE_EXEC', 'Executing critical velocity signature clicks...');

        // ==========================================
        // 👊 Armor Layer 3: Forced Dispatches & False Failure Traps
        // ==========================================
        try {
            await this.confirmSwapButton(targetPage).click({ force: true, timeout: 5000 });
            await targetPage.waitForEvent('close', { timeout: 3000 }).catch(() => { });
            logger.info('WALLET_FLOW', 'PIPELINE_SUCCESS', 'Signature click dispatched successfully; transaction broadcasted.');
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            if (errorMessage.includes('Target closed') || errorMessage.includes('Session closed')) {
                logger.info('WALLET_FLOW', 'PIPELINE_CLOSED', 'Provider window completed standard clean self-destruction loops.');
            } else {
                logger.error('WALLET_FLOW', 'PIPELINE_ERROR', 'Critical failure dispatched upon global transaction sign: ' + e);
                throw e;
            }
        }

        return { originWalletBalance, sendAmount, gasPrice };
    }

    /**
     * Custom environment Gas manipulation (Advanced Fee Customization controls).
     * @note Cryptographic constraints require Priority Fees to be committed BEFORE Base Fees to dodge valuation rule errors.
     */
    async updateGasFee(handle: Page, options?: { baseFee?: string; priorityFee?: string }) {
        logger.info('WALLET_FLOW', 'GAS_INIT', 'Modifying execution context gas parameters...');

        const baseFeeValue = options?.baseFee || CONFIG.GAS.LOW_BASE_FEE;
        const priorityFeeValue = options?.priorityFee || CONFIG.GAS.LOW_PRIORITY_FEE;

        try {
            await this.waitElemVisible(this.editGasFeeButton(handle), 'Gas fee customizer configuration trigger');
            await this.elemClick(this.editGasFeeButton(handle), 'Open custom gas configurations overlay');

            await this.waitElemVisible(this.advancedGasButton(handle), 'Custom advanced specifications option');
            await this.elemClick(this.advancedGasButton(handle), 'Enter manual fee configuration panels');

            // ⚠️ Mandatory Ordering Constraints: Priority Fee properties must be cleared and populated BEFORE Base Fees.
            await this.waitElemVisible(this.priorityFeeInput(handle), 'Priority fee (miner tip) input node');
            await this.elemClear(this.priorityFeeInput(handle), 'Wipe placeholder tip value');
            await this.elemFill(this.priorityFeeInput(handle), priorityFeeValue, 'Inject underpriced priority tip properties');

            await this.waitElemVisible(this.baseFeeInput(handle), 'Base fee input node');
            await this.elemClear(this.baseFeeInput(handle), 'Wipe baseline placeholder configuration values');
            await this.elemFill(this.baseFeeInput(handle), baseFeeValue, 'Inject underpriced network base parameters');

            await this.elemClick(this.saveGasButton(handle), 'Commit custom gas modifications');
            logger.info('WALLET_FLOW', 'GAS_SUCCESS', 'Fee properties saved and updated successfully inside wallet.');

            return this;
        } catch (error) {
            logger.error('WALLET_FLOW', 'GAS_ERROR', 'Failed to override transaction gas parameters matrix: ' + error);
            throw error;
        }
    }

    /**
     * Extracts the complete 66-character hexadecimal transaction hash ledger signature from active history tabs.
     * Resolves via block explorer external redirection parameters to safeguard data fidelity against brittle front-end DOM states.
     */
    async getLatestTransactionHash(handle: Page): Promise<string> {
        logger.info('WALLET_FLOW', 'TX_HASH_INIT', 'Synchronizing unsealed MetaMask active view states...');

        try {
            /**
             * Architectural Guardrail 1: Await core network and DOM synchronization.
             * Since this page is invoked programmatically POST-transaction broadcast, the React frontend 
             * experiences a brief hydration lag while fetching backend state logs from the Service Worker.
             * Enforcing 'networkidle' ensures local state ledger alignment before driving downstream UI events.
             */
            await handle.waitForLoadState('networkidle', { timeout: 10000 })
                .catch(() => logger.warn('WALLET_FLOW', 'TX_HASH_WARN', 'Network not fully idle within window thresholds; forcing continuation pipeline.'));

            /**
             * Architectural Guardrail 2: Defensive interception for probability-triggered security modals.
             * Evaluates whether the MetaMask 'Protect your funds' security/educational overlay is obstructing the layout viewport.
             * If visible, dispatches an omni-channel pointer override event to prevent layout intersection blockages.
             */
            const gotItButton = handle.getByRole('button', { name: /^got it$/i }).first();
            if (await gotItButton.isVisible({ timeout: 1500 }).catch(() => false)) {
                logger.info('WALLET_FLOW', 'TX_HASH_GUARD', 'Intercepted native security overlay. Dispatching dynamic click bypass...');
                await gotItButton.click({ force: true });
                logger.info('WALLET_FLOW', 'TX_HASH_GUARD_SUCCESS', 'Overlay dismissed safely. Pipeline execution loop restored.');
            }

            // 1. Pivot to Activity Stream Tab View
            const activityTab = handle.locator('[data-testid="home__activity-tab"]').or(handle.locator('text=Activity')).or(handle.locator('text=活动'));
            await activityTab.first().waitFor({ state: 'visible', timeout: 5000 });
            await activityTab.first().click({ force: true });

            // 2. Expand Primary Ledger Row Card Context
            const firstTxItem = handle.locator('[data-testid="activity-list-item"]').first()
                .or(handle.locator('.activity-list-item').first());
            await firstTxItem.waitFor({ state: 'visible', timeout: 5000 });
            await firstTxItem.click({ force: true, position: { x: 40, y: 15 } });
            logger.info('WALLET_FLOW', 'TX_HASH_EXPAND', 'Drawer row expanded.');

            /**
             * Architectural Guardrail 3: State-Driven DOM Content Convergence Verification.
             * Enforces absolute DOM lifecycle rendering checks prior to intercepting high-volatility 
             * block explorer hash strings. Evades race conditions between UI re-rendering and click handlers.
             */
            await handle.waitForLoadState('domcontentloaded');

            // 3. Pin Target Non-HREF Anchor Button Instance
            const explorerButton = handle.locator('text=View on block explorer').first();

            /**
             * Pure State Wait Bounds: Relies on visibility constraints to maximize throughput.
             * The 30s timeout behaves strictly as an upper bound defense window for blockchain node settlement; 
             * Playwright triggers instant execution progression the exact millisecond the element arrives in a paintable state.
             */
            await explorerButton.waitFor({ state: 'visible', timeout: 30000 });
            logger.info('WALLET_FLOW', 'TX_HASH_TARGET', 'Locked target: View on block explorer button.');

            // 4. Capture Inbound Navigation Targets via Core Event Loop Intercepts
            logger.info('WALLET_FLOW', 'TX_HASH_CAPTURE', 'Spawning browser context event trap...');
            const browserContext = handle.context();

            const [etherscanPage] = await Promise.all([
                browserContext.waitForEvent('page', { timeout: 20000 }),
                explorerButton.click({ force: true })
            ]);

            // 5. Instantly Mine Volatile URL Address Assets and Execute Forced Context Disposal
            const rawUrl = etherscanPage.url();
            logger.info('WALLET_FLOW', 'TX_HASH_URL', 'Captured raw URL address on first flight: ' + rawUrl);
            await etherscanPage.close().catch(() => { });

            // 6. Decode Cryptographic Payload 66-character Strings via Regex
            const hashMatch = rawUrl.match(/tx\/(0x[a-fA-F0-9]{64})/);
            if (!hashMatch || !hashMatch[1]) {
                throw new Error(`❌ Regulatory static analysis failed to parse cryptographic payload from browser URL: ${rawUrl}`);
            }

            return hashMatch[1];

        } catch (error: any) {
            logger.error('WALLET_FLOW', 'TX_HASH_ERROR', 'CRITICAL ENGINE EXCEPTION IN FRONT-ATTACK FLOW: ' + error.message);
            throw error;
        }
    }

    /**
     * Orchestrated multi-tier operation combining custom underpriced gas injection with sudden signature clicks.
     * Deployed specifically to stall items in the mempool during pending security audits.
     */
    async updateGasFeeAndConfirmSwap(handle: Page) {
        console.log('⏳ [Pipeline-Combo-Gas] Dispatching micro-gas transaction execution combo sequence...');
        let targetPage = handle;

        // ==========================================
        // 🛡️ Armor Layer 1: Popup Window Resuscitator
        // ==========================================
        if (!handle || handle.isClosed()) {
            console.log('⚠️ [Pipeline-Combo-Gas] Active panel context unmounted. Launching reconstructor tracking loops...');
            let walletPage: Page | undefined;
            const context = this.page.context();

            for (let i = 0; i < 20; i++) {
                walletPage = context.pages().find(p => {
                    const url = p.url();
                    return url.includes('chrome-extension://') &&
                        (url.includes('notification.html') || url.includes('confirm-transaction'));
                });

                if (walletPage) {
                    targetPage = walletPage;
                    console.log(`✅ [Pipeline-Combo-Gas] Recovery loop index ${i + 1}: Intercepted active recreated popup context.`);
                    break;
                }
                await this.page.waitForTimeout(500);
            }

            if (!walletPage) {
                throw new Error('❌ Context recovery exhausted: Failed to capture live provider popups within 10s.');
            }
        }

        // ==========================================
        // ⚡ Armor Layer 2: Speed Optimization (Blind Sign Speed Capture)
        // ==========================================
        console.log('🔍 [Pipeline-Combo-Gas] Locating signature dispatch components quickly...');
        await this.confirmSwapButton(targetPage).waitFor({ state: 'visible', timeout: 15000 });

        let sendAmount = 'N/A';
        let gasPrice = 'N/A';
        let originWalletBalance = 'N/A';

        try {
            if (await this.sendAmountPill(targetPage).isVisible()) {
                sendAmount = await this.sendAmountPill(targetPage).innerText();
            }
            if (await this.nativeCurrencyGasFee(targetPage).isVisible()) {
                gasPrice = await this.nativeCurrencyGasFee(targetPage).innerText();
            }
            if (await this.walletBalanceDisplay(targetPage).isVisible()) {
                originWalletBalance = await this.walletBalanceDisplay(targetPage).innerText();
            }
        } catch (e) {
            console.log('💡 [Pipeline-Combo-Gas] Asset parameters extraction bypassed to mitigate transaction payload expiration risks.');
        }

        console.log(`💰 [Pipeline-Combo-Gas] Baseline Balance: ${originWalletBalance}`);
        console.log(`📤 [Pipeline-Combo-Gas] Outbound Payload Amount: ${sendAmount}`);
        console.log(`⛽ [Pipeline-Combo-Gas] Network Gas Premium: ${gasPrice}`);

        // ==========================================
        // ⛽ Injection Layer: Mutate Gas Thresholds Into Stall Limits
        // ==========================================
        await this.updateGasFee(targetPage);

        // ==========================================
        // 👊 Armor Layer 3: Forced Dispatches & False Failure Traps
        // ==========================================
        try {
            await this.confirmSwapButton(targetPage).click({ force: true, timeout: 5000 });
            await targetPage.waitForEvent('close', { timeout: 3000 }).catch(() => { });
            console.log('✅ [Pipeline-Combo-Gas] Underpriced transaction sequence successfully pushed into mempool.');
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            if (errorMessage.includes('Target closed') || errorMessage.includes('Session closed')) {
                console.log('✅ [Pipeline-Combo-Gas] Provider window completed standard clean self-destruction loops.');
            } else {
                console.error('❌ [Pipeline-Combo-Gas] Critical failure dispatched upon customized underpriced gas sign:', e);
                throw e;
            }
        }

        return { originWalletBalance, sendAmount, gasPrice };
    }
}