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

    constructor(page: Page) {
        super(page);
    }

    /**
     * Unlocks the MetaMask wallet vault instance.
     * @param {Page} handle - Target extension window handle (Popup or full-screen dashboard page).
     * @param {string} [password] - Decryption credentials passphrase (Defaults to process.env.WALLET_PASSWORD).
     */
    async unlockWallet(handle: Page, password?: string) {
        console.log('🔓 Initiating provider decryption sequence...');
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
                console.log('💡 Info: Decryption submission handled via input hooks; submission button bypassed safely.');
            }

            console.log('✅ Extension decryption complete; sandbox unlocked.');
        } catch (error) {
            console.error('❌ Extension decryption failed:', error);
            throw error;
        }
    }

    /**
     * Confirms handshake authorization between the host application and provider.
     * @param {Page} handle - Active extension popup context.
     */
    async connectWallet(handle: Page) {
        await this.confirmButton(handle).click({ force: true, timeout: 5000 });
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
        console.log('⏳ Awaiting transaction simulation parameters to compile inside provider UI...');

        // Leverage raw native driver expectations to eliminate logging noise
        await this.sendAmountPill(handle).waitFor({ state: 'visible', timeout: 30000 });
        await this.receiveAssetPill(handle).waitFor({ state: 'visible', timeout: 30000 });
        await this.confirmSwapButton(handle).waitFor({ state: 'visible', timeout: 30000 });

        const sendAmount = await this.sendAmountPill(handle).innerText();
        const gasPrice = await this.nativeCurrencyGasFee(handle).innerText();

        // Soft-Armor Check: Vault parameters occasionally omit base balance properties inside rapid signature views
        let originWalletBalance = '';
        try {
            originWalletBalance = await this.walletBalanceDisplay(handle).innerText();
        } catch (e) {
            console.log('⚠️ Current active balance inaccessible inside standard signature panels');
            originWalletBalance = 'N/A';
        }

        console.log(`💰 Baseline Balance: ${originWalletBalance}`);
        console.log(`📤 Outbound Payload Amount: ${sendAmount}`);
        console.log(`⛽ Network Gas Premium: ${gasPrice}`);

        return { originWalletBalance, sendAmount, gasPrice };
    }

    /**
     * Confirms transactional signature requests with high structural mitigation defenses.
     * @param {Page} handle - Target extension window handle.
     */
    async confirmSwap(handle: Page) {
        console.log('🔄 Positioning pointers over final signature components...');

        let targetPage = handle;

        // Defensive Scanning: Evaluate if context unmounted prematurely; re-acquire if active
        if (!handle || handle.isClosed()) {
            console.log('⚠️ Signature handle destroyed. Attempting context reconstruction loops...');
            const pages = handle.context().pages();
            const walletPage = pages.find(p => p.url().includes('chrome-extension://') && p.url().includes('confirm-transaction'));

            if (walletPage) {
                targetPage = walletPage;
                console.log('✅ Successfully re-acquired provider context hooks');
            } else {
                throw new Error('❌ Critical: Provider signature context destroyed; recovery array exhausted.');
            }
        }

        try {
            // Force Dispatch Click: Bypasses transparent overlay blockades or front-end element intercept locks
            await this.confirmSwapButton(targetPage).click({ force: true, timeout: 10000 });

            // Structural Anticipation: Await explicit unmounting events before the test driver reports failure
            await targetPage.waitForEvent('close', { timeout: 3000 }).catch(() => { });

            console.log('✅ Signature click dispatched successfully; transaction broadcasted.');
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            // Intercept Target Closed False Failures: Rapid popup panel self-destruction registers as runtime failures
            if (errorMessage.includes('Target closed') || errorMessage.includes('Session closed')) {
                console.log('💡 Info: Provider window successfully completed self-destruction routines.');
            } else {
                console.error('❌ Critical failure dispatched upon final confirmation click:', e);
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
        console.log('⏳ Executing high-resilience signature pipeline combo (Armor Edition)...');
        let targetPage = handle;

        // ==========================================
        // 🛡️ Armor Layer 1: Popup Window Resuscitator
        // ==========================================
        if (!handle || handle.isClosed()) {
            console.log('⚠️ Active panel context unmounted. Launching reconstructor tracking loops...');
            let walletPage: Page | undefined;
            const context = this.page.context();

            // Execute 20 iterations (10s scheduling budget) at 500ms step-bounds
            for (let i = 0; i < 20; i++) {
                walletPage = context.pages().find(p => {
                    const url = p.url();
                    return url.includes('chrome-extension://') &&
                        (url.includes('notification.html') || url.includes('confirm-transaction'));
                });

                if (walletPage) {
                    targetPage = walletPage;
                    console.log(`✅ Recovery loop index ${i + 1}: Intercepted active recreated popup context context.`);
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
        console.log('🔍 Locating signature dispatch components quickly...');
        await this.confirmSwapButton(targetPage).waitFor({ state: 'visible', timeout: 15000 });

        let sendAmount = 'N/A';
        let gasPrice = 'N/A';
        let originWalletBalance = 'N/A';

        // Blind-signing Optimization: Use reactive .isVisible() probes instead of blocking layout expectations.
        // If data fails parsing extraction, drop gracefully to preserve execution speed.
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
            console.log('💡 Info: Asset parameters extraction bypassed to mitigate transaction payload expiration risks.');
        }

        console.log(`💰 Baseline Balance: ${originWalletBalance}`);
        console.log(`📤 Outbound Payload Amount: ${sendAmount}`);
        console.log(`⛽ Network Gas Premium: ${gasPrice}`);

        console.log('🔍 Executing critical velocity signature clicks...');

        // ==========================================
        // 👊 Armor Layer 3: Forced Dispatches & False Failure Traps
        // ==========================================
        try {
            await this.confirmSwapButton(targetPage).click({ force: true, timeout: 5000 });
            await targetPage.waitForEvent('close', { timeout: 3000 }).catch(() => { });
            console.log('✅ Signature click dispatched successfully; transaction broadcasted.');

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            if (errorMessage.includes('Target closed') || errorMessage.includes('Session closed')) {
                console.log('✅ Info: Provider window completed standard clean self-destruction loops.');
            } else {
                console.error('❌ Critical failure dispatched upon global transaction sign:', e);
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
        console.log('⛽ Modifying execution context gas parameters...');

        const baseFeeValue = options?.baseFee || CONFIG.GAS.LOW_BASE_FEE;
        const priorityFeeValue = options?.priorityFee || CONFIG.GAS.LOW_PRIORITY_FEE;

        try {
            await this.waitElemVisible(this.editGasFeeButton(handle), 'Gas fee customizer configuration trigger');
            await this.elemClick(this.editGasFeeButton(handle), 'Open custom gas configurations overlay');

            await this.waitElemVisible(this.advancedGasButton(handle), 'Custom advanced specifications option');
            await this.elemClick(this.advancedGasButton(handle), 'Enter manual fee configuration panels');

            // ⚠️ Mandatory Ordering Constraints: Priority Fee properties must be cleared and populated BEFORE Base Fees.
            // MetaMask UI validators dynamically evaluate Base Fee minimum bounds directly against Priority Fees.
            await this.waitElemVisible(this.priorityFeeInput(handle), 'Priority fee (miner tip) input node');
            await this.elemClear(this.priorityFeeInput(handle), 'Wipe placeholder tip value');
            await this.elemFill(this.priorityFeeInput(handle), priorityFeeValue, 'Inject underpriced priority tip properties');

            await this.waitElemVisible(this.baseFeeInput(handle), 'Base fee input node');
            await this.elemClear(this.baseFeeInput(handle), 'Wipe baseline placeholder configuration values');
            await this.elemFill(this.baseFeeInput(handle), baseFeeValue, 'Inject underpriced network base parameters');

            await this.elemClick(this.saveGasButton(handle), 'Commit custom gas modifications');
            console.log('✅ Fee properties saved and updated successfully inside wallet.');

            return this;
        } catch (error) {
            console.error('❌ Failed to override transaction gas parameters matrix:', error);
            throw error;
        }
    }

    /**
     * Extracts the complete 66-character hexadecimal transaction hash ledger signature from active history tabs.
     * Resolves via block explorer external redirection parameters to safeguard data fidelity against brittle front-end DOM states.
     */
    async getLatestTransactionHash(handle: Page): Promise<string> {
        console.log('🔍 Initializing hash query protocols across local transaction logs...');

        try {
            await this.elemClick(this.activityTabButton(handle), 'Switch focus parameters to Activity ledger tab');

            const firstTransaction = this.firstTransactionItem(handle);
            await firstTransaction.waitFor({ state: 'visible', timeout: 10000 });

            await firstTransaction.click({ timeout: 5000 });

            const newPage = await this.clickAndGetPopup(this.blockExplorerLink(handle), 'Trigger block explorer popup redirection redirection');

            const fullUrl = newPage.url();
            console.log(`🌍 Intercepted third-party explorer context coordinates: ${fullUrl}`);

            // Parse valid 66-character hexadecimal string hashes matching transaction regex parameters
            const txHashMatch = fullUrl.match(/0x[a-fA-F0-9]{64}/);

            if (!txHashMatch) {
                throw new Error(`❌ Failed to parse cryptographic hash string structure from target path link: ${fullUrl}`);
            }

            const txHash = txHashMatch[0];
            console.log(`✅ Cryptographic tx hash extracted cleanly: ${txHash}`);

            await newPage.close();
            return txHash;

        } catch (error) {
            console.error('❌ Failed to reconcile transaction hash log blocks:', error);
            throw error;
        }
    }

    /**
     * Orchestrated multi-tier operation combining custom underpriced gas injection with sudden signature clicks.
     * Deployed specifically to stall items in the mempool during pending security audits.
     */
    async updateGasFeeAndConfirmSwap(handle: Page) {
        console.log('⏳ Dispatching micro-gas transaction execution combo sequence...');
        let targetPage = handle;

        // ==========================================
        // 🛡️ Armor Layer 1: Popup Window Resuscitator
        // ==========================================
        if (!handle || handle.isClosed()) {
            console.log('⚠️ Active panel context unmounted. Launching reconstructor tracking loops...');
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
                    console.log(`✅ Recovery loop index ${i + 1}: Intercepted active recreated popup context context.`);
                    break;
                }
                await this.page.waitForTimeout(500);
            }

            if (!walletPage) {
                throw new Error('❌ Context recovery exhausted: Failed to capture live provider popups within 10s.');
            }
        }

        // ==========================================
        // ⚡ Armor Layer 2: Blind Sign Speed Capture
        // ==========================================
        console.log('🔍 Locating signature dispatch components quickly...');
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
            console.log('💡 Info: Asset parameters extraction bypassed to mitigate transaction payload expiration risks.');
        }

        console.log(`💰 Baseline Balance: ${originWalletBalance}`);
        console.log(`📤 Outbound Payload Amount: ${sendAmount}`);
        console.log(`⛽ Network Gas Premium: ${gasPrice}`);

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
            console.log('✅ Underpriced transaction sequence successfully pushed into mempool.');

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            if (errorMessage.includes('Target closed') || errorMessage.includes('Session closed')) {
                console.log('✅ Info: Provider window completed standard clean self-destruction loops.');
            } else {
                console.error('❌ Critical failure dispatched upon customized underpriced gas sign:', e);
                throw e;
            }
        }

        return { originWalletBalance, sendAmount, gasPrice };
    }
}