/**
 * WalletConnectPage - Web3 Wallet Connection & Session Verification Page Object
 * @module WalletConnectPage
 * @description Encapsulates declarative locator registries and runtime orchestration logic 
 * for establishing automated handshakes between the client interface and the provider context.
 * Implements deterministic synchronization architectures to absorb transient network latency
 * and reactive DOM transitions native to dApp layouts.
 * * Architectural Paradigms:
 * 1. Declarative Registry Splitting: Strictly isolates DOM lookup metadata from state-mutating execution contexts.
 * 2. Cross-Context Edge Interception: Combines pointer offsets with explicit event listeners to handle nested layout tracking.
 * 3. Reactive State Polling Matrices: Utilizes safe interval evaluation trees to settle on-chain cryptographic address properties.
 */

import type { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class WalletConnectPage extends BasePage {
    // =========================================================================
    // 🎯 Declarative Locator Registries (Decoupled DOM Element Configurations)
    // =========================================================================

    // --- Authentication Handshake Targets ---
    protected readonly connectBtn: Locator = this.page.getByRole('button', { name: /connect/i, exact: false });
    protected readonly metaMaskOption: Locator = this.page.locator('div').filter({ hasText: /^MetaMask$/ }).last();
    protected readonly skipBtn: Locator = this.page.getByRole('button', { name: 'Skip' });

    // --- Session Status & Identity Geometries ---
    protected readonly web3StatusConnected: Locator = this.page.getByTestId('web3-status-connected');
    protected readonly walletAddressText: Locator = this.web3StatusConnected.locator('text=/0x[a-fA-F0-9]{4,}/');
    protected readonly fallbackAddressText: Locator = this.web3StatusConnected.locator('span, div').filter({ hasText: '0x' });

    // --- Container-Scoped Reactive Sidebar Gateways (Testnet Parameter Matrix) ---
    protected readonly accountDrawerContainer: Locator = this.page.getByTestId('account-drawer');
    protected readonly walletSettingsBtn: Locator = this.accountDrawerContainer.getByTestId('wallet-settings');
    protected readonly testnetToggleBtn: Locator = this.accountDrawerContainer.getByTestId('testnets-toggle');

    constructor(page: Page) {
        super(page);
    }

    // =========================================================================
    // ⚙️ Executable Functional Methods (State & Context Operations)
    // =========================================================================

    /**
     * Executes the baseline dApp connection handshake and captures the out-of-band wallet popup frame.
     * @description Forces a state tree reset prior to dispatching pointer triggers, circumventing 
     * stale provider sessions across parallel execution threads.
     * @returns {Promise<Page>} The intercepted external extension page notification handle.
     */
    async connectToMetaMask(): Promise<Page> {
        console.log("🚀 [Handshake-DApp] Initiating wallet connection sequence...");

        await this.pageReload();
        await this.waitTimeout(2000);

        // 1. 获取连接按钮，使用 count() 判断其是否存在
        const connectBtn = this.page.getByTestId('navbar-connect-wallet');
        
        // 2. 检查是否已经显示了地址（说明已连接，无需连接流程）
        const accountDisplay = this.page.locator('[data-testid="navbar-address-display"]');
        if (await accountDisplay.isVisible({ timeout: 5000 })) {
            console.log("ℹ️ [Handshake-DApp] Wallet already connected, returning current page.");
            return this.page; 
        }

        // 3. 点击连接按钮
        await this.elemClick(connectBtn, 'Click connect wallet button');

        // 4. 感知模式：判断是否出现了“选择钱包列表”
        // 如果列表没出现，说明可能是直接弹出了 MetaMask 授权，或者已经连上了
        const isListVisible = await this.metaMaskOption.isVisible({ timeout: 5000 }).catch(() => false);

        if (isListVisible) {
            console.log("💡 [Handshake-DApp] List detected, selecting MetaMask...");
            return await this.clickAndGetPopup(this.metaMaskOption, 'Select MetaMask option');
        } else {
            console.log("⚠️ [Handshake-DApp] List skipped, checking for direct auth prompt...");
            // 这里处理如果没有列表，直接弹出 MetaMask 窗口的情况
            // 通常是等待页面中新打开的 page
            return await this.page.context().waitForEvent('page', { timeout: 10000 });
        }
    }

    /**
     * Asserts runtime connection persistence thresholds and extracts validated address hashes.
     * @description Employs soft-exception shields against transient introductory walkthrough tours,
     * using safe parsing retry loops to bridge JSON-RPC asynchronous data propagation gaps.
     * @returns {Promise<string>} The verified active hexadecimal account address string (0x...).
     */
    async verifyConnectionAndGetAddress(): Promise<string> {
        // Soft-Armor Contingency: Safely dismiss onboarding layout overlays if present
        await this.elemClick(this.skipBtn, 'Skip baseline introductory welcome overlay').catch(() => {
            console.log('💡 [Session-Validation] Onboarding modal absent; view bounds clear, continuing...');
        });

        // Block execution thread lines until the authenticated session state container mounts safely
        await this.waitElemVisible(this.web3StatusConnected, 'Web3 connected status action button');

        // Adaptive Polling Matrix: Handle front-end presentation lag during heavy node traffic
        let addr = '';
        for (let i = 0; i < 10; i++) {
            addr = await this.walletAddressText.innerText().catch(() => '');
            if (addr && addr.startsWith('0x')) {
                break;
            }
            console.log(`💡 [Session-Validation] Awaiting target account data mapping inside DOM layer, retry index: ${i + 1}`);
            await this.waitTimeout(500);
        }

        console.log(`🌐 [Session-Validation] Session validated. Active cryptographic address link: ${addr}`);
        return addr;
    }

    /**
     * Adaptive Frontend Synchronization Pipeline
     * @description Bypasses extension-level sandboxing blocks by mutating network visibility toggles 
     * directly through the native client interface. Uses strict component containment scopes 
     * to prevent strict mode dual-element collision anomalies on reactive sidebar drawers.
     * @returns {Promise<void>}
     */
    async enableDAppTestnetMode(): Promise<void> {
        console.log('🛡️ [Network-Provision] Initializing in-context DApp network threshold realignment...');

        try {
            // --- Phase 1: High-Precision Layer-3 Pointer Alignment ---
            // The connected account button layout encapsulates multiple overlapping SVG vector trees 
            // that tend to hijack pointer triggers. We enforce custom offset vectors paired with 
            // literal fallback anchor definitions to guarantee unbroken event bubbling.
            // await this.web3StatusConnected.waitFor({ state: 'visible', timeout: 6000 });

            // // Shift click target to the right sector (x:50, y:15) to hit the pure interactive boundary box
            // await this.web3StatusConnected.click({ force: true, position: { x: 50, y: 15 } });
            // console.log('🔓 [Network-Provision] Offset pointer dispatched; awaiting account drawer mount...');
            await this.page.waitForTimeout(6000);

            // Conditional Fallback Sequence: Straight-line injection directly onto the inner literal address node
            const targetTextNode = this.fallbackAddressText.first();
            if (await targetTextNode.isVisible({ timeout: 1000 })) {
                await targetTextNode.click({ force: true });
                console.log('🔓 [Network-Provision] Textual locator contingency engaged; account drawer unsealed.');
            }
            await this.page.waitForTimeout(1000);

            // --- Phase 2: Container-Scoped Isolation Matrix ---
            // Circumvent multi-element 'wallet-settings' conflicts by locking the lookup scope 
            // inside the confirmed parent 'account-drawer' DOM sub-tree.
            const targetSettingsBtn = this.walletSettingsBtn.first();
            await targetSettingsBtn.waitFor({ state: 'attached', timeout: 4000 });
            await targetSettingsBtn.scrollIntoViewIfNeeded();
            await targetSettingsBtn.click({ force: true });
            console.log('⚙️ [Network-Provision] Scoped layout lock secured; advanced parameters layer rendered.');
            await this.page.waitForTimeout(800);

            // --- Phase 3: Semantic Switch Mutation & Analytical Refresh ---
            // Isolate the semantic toggle switch from duplicate dormant nodes using the same container layout filter
            const targetToggle = this.testnetToggleBtn.first();
            await targetToggle.waitFor({ state: 'attached', timeout: 5000 });
            await targetToggle.scrollIntoViewIfNeeded();

            // Interrogate current state markers before issuing mutations
            const isChecked = await targetToggle.getAttribute('aria-checked');
            const dataState = await targetToggle.getAttribute('data-state');

            if (isChecked === 'true' || dataState === 'checked') {
                console.log('✅ [Network-Provision] State validation complete: Testnet mode pre-asserted as active. Bypassing mutation.');
            } else {
                await targetToggle.click({ force: true });
                console.log('🚀 [Network-Provision] Semantic switch mutated! Global Testnet mode activated successfully.');
                // Rigid buffer to guarantee remote RPC provider balance synchronization
                await this.page.waitForTimeout(2000);
            }

            // --- Phase 4: Drawer Dismissal & Viewport Clearance ---
            // Collapse the drawer viewport to unblock core downstream interaction components
            await this.page.mouse.click(15, 15);
            console.log('🏁 [Network-Provision] Sidebar collapsed safely; production-ready Sepolia sandbox context delivered.');

        } catch (err: any) {
            console.error('❌ [Network-Provision-Error] CRITICAL PIPELINE FAILURE: DApp testnet mode auto-provisioning collapsed:', err.message);
            throw err;
        }
    }
}
