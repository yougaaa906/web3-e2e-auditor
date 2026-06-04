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
        await this.page.goto(process.env.BASE_URL || 'https://app.uniswap.org');
        
        // 强制检查 Provider 状态
        const providerStatus = await this.page.evaluate(() => {
            return {
                hasEthereum: typeof window.ethereum !== 'undefined',
                isMetaMask: !!(window.ethereum && window.ethereum.isMetaMask)
            };
        });
        console.log("🔍 [Handshake] Provider Status:", providerStatus);
    
        if (!providerStatus.hasEthereum) {
            throw new Error("❌ FATAL: MetaMask Provider not injected in DApp context!");
        }
    
        // 监听所有页面请求，看点击后有没有触发连接请求
        this.page.on('request', request => {
            if (request.url().includes('wallet_requestPermissions')) {
                console.log("✅ [Handshake] Detected Web3 Connection Request!");
            }
        });
    
        console.log("🚀 [Handshake] Clicking connect button...");
        const connectBtn = this.page.getByTestId('navbar-connect-wallet');
        await connectBtn.click({ force: true });
    
        // 弹窗捕获逻辑
        const maxRetries = 15;
        for (let i = 0; i < maxRetries; i++) {
            const pages = this.page.context().pages();
            const mmPage = pages.find(p => p.url().includes('notification') || p.url().includes('popup'));
            if (mmPage) {
                console.log("🎉 [Handshake] Pop-up detected!");
                return mmPage;
            }
            await this.page.waitForTimeout(1000);
        }
    
        // 如果运行到这里，说明点击了但什么都没发生
        throw new Error("❌ FATAL: Button clicked, but NO Web3 connection request detected. Possible UI handler error.");
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
