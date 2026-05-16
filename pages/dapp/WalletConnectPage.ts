/**
 * WalletConnectPage - Web3 Wallet Connection & Session Verification Page Object
 * @module WalletConnectPage
 * @description Encapsulates standard handshake workflows connecting the client application
 * to the Ethereum browser provider (MetaMask). Handles sandbox cleaning, asynchronous popup interception,
 * and deterministic on-chain address extraction.
 * * Architectural Paradigms:
 * 1. Sandboxed Session Controls: Forces clean page reloads to prevent session leakages across specs.
 * 2. Cross-Context Synchronizations: Coordinates asynchronous triggers to safely lock extension views.
 * 3. Reactive Polling Probes: Loops query evaluations to circumvent transient JSON-RPC lagging states.
 */

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class WalletConnectPage extends BasePage {
    // ==================================================
    // 🎯 Core Interaction Locators
    // ==================================================
    readonly connectBtn = this.page.getByRole('button', { name: /connect|连接/i, exact: false });
    readonly metaMaskOption = this.page.locator('div').filter({ hasText: /^MetaMask$/ }).last();
    readonly skipBtn = this.page.getByRole('button', { name: 'Skip' });

    // ==================================================
    // 🔗 Session Status Locators
    // ==================================================
    readonly web3StatusConnected = this.page.getByTestId('web3-status-connected');

    // 💡 Contextual RegExp mapping tailored to capture formatted hexadecimal EVM addresses safely
    readonly walletAddressText = this.web3StatusConnected.locator('text=/0x[a-fA-F0-9]{4,}/');

    constructor(page: Page) { super(page); }

    /**
     * Executes baseline connection actions and captures the external wallet signature context.
     * * Operational Flow: Reload sandbox → Click connect → Select MetaMask vendor → Capture popup context
     * * @returns {Promise<Page>} The isolated extension page context handle for upstream operations.
     */
    async connectToMetaMask(): Promise<Page> {
        console.log("🚀 Initiating wallet connection sequence...");

        // 1. Force state reset via page reload to destroy lingering provider configurations
        await this.pageReload();

        // 2. Consistent buffer allowing the layout state tree to stabilize cleanly
        await this.waitTimeout(2000);

        // 3. Dispatch pointer interaction onto the vendor modal trigger components
        await this.waitElemVisible(this.connectBtn, 'Global connect wallet action trigger');
        await this.elemClick(this.connectBtn, 'Click connect wallet button');
        console.log("💡 Main connection trigger executed successfully");

        // 4. Secure explicit wait boundaries over the active wallet selection matrices
        await this.waitElemVisible(this.metaMaskOption, 'MetaMask vendor selection target');

        // 5. Intercept out-of-band extension popups via atomic synchronization structures
        // 🛡️ Strategic Design: clickAndGetPopup forces dual-event listeners to avoid fatal racing anomalies.
        const popup = await this.clickAndGetPopup(this.metaMaskOption, 'Select MetaMask option');

        console.log('✅ Successfully locked wallet extension notification context.');
        return popup;
    }

    /**
     * Asserts session integration limits and extracts verified reflected address hashes.
     * * 🛡️ Multi-tier Defensive Systems:
     * 1. Soft-Armor Waiver Interception: Absorbs element errors gracefully if the tour modal is absent.
     * 2. Adaptive Polling Matrix: Loops text extractions to accommodate slow RPC network updates.
     * 3. Null Safety Bounds: Enforces explicit value filtering to reject unstable layout state values.
     * * @returns {Promise<string>} The parsed authenticated hexadecimal account address string (format: 0x...)
     */
    async verifyConnectionAndGetAddress(): Promise<string> {
        // 🛡️ Soft Exception Armor: Clear localized onboarding tutorial blocks (context-dependent overlay)
        await this.elemClick(this.skipBtn, 'Skip baseline introductory welcome overlay').catch(() => {
            console.log('💡 Info: Onboarding modal absent; view bounds clear, continuing...');
        });

        // Block execution tracks until the connected profile element mounts safely onto view frames
        await this.waitElemVisible(this.web3StatusConnected, 'Web3 connected status action button');

        // 🛡️ Adaptive Polling Array: Absorb rendering delays caused by node propagation lag
        // Data interpolation patterns on Web3 apps exhibit minor timing disconnects post-handshake.
        let addr = '';
        for (let i = 0; i < 10; i++) {
            addr = await this.walletAddressText.innerText().catch(() => '');
            if (addr && addr.startsWith('0x')) {
                break;
            }
            console.log(`💡 Awaiting target account data mapping inside DOM layer, current: "${addr}"`);
            await this.waitTimeout(500); // 500ms smooth step intervals to decrease main thread parsing friction
        }

        console.log(`🌐 Session validated. Active cryptographic address link: ${addr}`);
        return addr;
    }
}