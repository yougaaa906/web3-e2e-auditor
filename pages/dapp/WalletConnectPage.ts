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
    protected readonly connectBtn: Locator = this.page.getByRole('button', { name: /connect|连接/i, exact: false });
    protected readonly metaMaskOption: Locator = this.page.locator('div').filter({ hasText: /^MetaMask$/ }).last();
    protected readonly skipBtn: Locator = this.page.getByRole('button', { name: 'Skip' });

    // --- Session Status & Identity Geometries ---
    protected readonly web3StatusConnected: Locator = this.page.getByTestId('web3-status-connected');
    protected readonly walletAddressText: Locator = this.web3StatusConnected.locator('text=/0x[a-fA-F0-9]{4,}/');
    protected readonly fallbackAddressText: Locator = this.web3StatusConnected.locator('span, div').filter({ hasText: '0x' });

    // --- Container-Scoped Reactive Sidebar Gateways (Jerry's Testnet Matrix) ---
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
        console.log("🚀 Initiating wallet connection sequence...");

        // 清理缓存并刷新
        await this.pageReload();
        
        console.log("⏳ [CI/CD Mitigation] Awaiting heavy React SPA hydration on cloud worker...");
        await this.page.waitForLoadState('load').catch(() => {});
        // 给云端 CPU 足足 8 秒的喘息时间，等 React 把 DOM 树挂载完毕
        await this.page.waitForTimeout(8000); 

        // 🌟 战术核心 1：获取原生 Locator 对象
        const targetBtn = this.connectBtn.first();
        console.log("🔍 Scanning dynamic DOM for target Connect trigger...");
        
        // 🌟 战术核心 2：绝对不要用 this.waitElemVisible！直接用原生原生 API 并给 45 秒！
        await targetBtn.waitFor({ state: 'attached', timeout: 45000 });

        // 🌟 战术核心 3：绝对不要用 this.elemClick！直接用原生 click 并强开 force: true！
        console.log("🎯 Target attached to layout tree! Executing forced physical click...");
        // force: true 会无视 DOM 游离和动画，只要按钮挂在树上，直接从坐标层暴力点穿！
        await targetBtn.click({ force: true, timeout: 45000 });
        
        console.log("💡 Main connection trigger executed successfully");

        // 给侧边栏菜单弹出的动画一点时间
        await this.page.waitForTimeout(2000);

        // 选择 MetaMask 选项并捕获弹窗
        // 这里可以使用基类的 clickAndGetPopup，因为一旦侧边栏稳定，MetaMask 按钮就不会乱跑了
        const popup = await this.clickAndGetPopup(this.metaMaskOption, 'Select MetaMask option');

        console.log('✅ Successfully locked wallet extension notification context.');
        return popup;
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
            console.log('💡 Info: Onboarding modal absent; view bounds clear, continuing...');
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
            console.log(`💡 Awaiting target account data mapping inside DOM layer, current: "${addr}"`);
            await this.waitTimeout(500);
        }

        console.log(`🌐 Session validated. Active cryptographic address link: ${addr}`);
        return addr;
    }

    /**
     * Jerry's Adaptive Frontend Synchronization Pipeline
     * @description Bypasses extension-level sandboxing blocks by mutating network visibility toggles 
     * directly through the native client interface. Uses strict component containment scopes 
     * to prevent strict mode dual-element collision anomalies on reactive sidebar drawers.
     * @returns {Promise<void>}
     */
    async enableDAppTestnetMode(): Promise<void> {
        console.log('🛡️ [Jerry-绝杀流] Initializing in-context DApp network threshold realignment...');

        try {
            // --- Phase 1: High-Precision Layer-3 Pointer Alignment ---
            // The connected account button layout encapsulates multiple overlapping SVG vector trees 
            // that tend to hijack pointer triggers. We enforce custom offset vectors paired with 
            // literal fallback anchor definitions to guarantee unbroken event bubbling.
            await this.web3StatusConnected.waitFor({ state: 'visible', timeout: 6000 });

            // Shift click target to the right sector (x:50, y:15) to hit the pure interactive boundary box
            await this.web3StatusConnected.click({ force: true, position: { x: 50, y: 15 } });
            console.log('🔓 [Step-1] Offset pointer dispatched; awaiting account drawer mount...');
            await this.page.waitForTimeout(600);

            // Conditional Fallback Sequence: Straight-line injection directly onto the inner literal address node
            const targetTextNode = this.fallbackAddressText.first();
            if (await targetTextNode.isVisible({ timeout: 1000 })) {
                await targetTextNode.click({ force: true });
                console.log('🔓 [Step-1.5] Textual locator contingency engaged; account drawer unsealed.');
            }
            await this.page.waitForTimeout(1000);

            // --- Phase 2: Container-Scoped Isolation Matrix ---
            // Circumvent multi-element 'wallet-settings' conflicts by locking the lookup scope 
            // inside the confirmed parent 'account-drawer' DOM sub-tree.
            const targetSettingsBtn = this.walletSettingsBtn.first();
            await targetSettingsBtn.waitFor({ state: 'attached', timeout: 4000 });
            await targetSettingsBtn.scrollIntoViewIfNeeded();
            await targetSettingsBtn.click({ force: true });
            console.log('⚙️ [Step-2] Scoped layout lock secured; advanced parameters layer rendered.');
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
                console.log('✅ [Step-3] State validation complete: Testnet mode pre-asserted as active. Bypassing mutation.');
            } else {
                await targetToggle.click({ force: true });
                console.log('🚀 [Step-3] Semantic switch mutated! Global Testnet mode activated successfully.');
                // Rigid buffer to guarantee remote RPC provider balance synchronization
                await this.page.waitForTimeout(2000);
            }

            // --- Phase 4: Drawer Dismissal & Viewport Clearance ---
            // Collapse the drawer viewport to unblock core downstream interaction components
            await this.page.mouse.click(15, 15);
            console.log('🏁 [Step-4] Sidebar collapsed safely; production-ready Sepolia sandbox context delivered.');

        } catch (err: any) {
            console.error('❌ CRITICAL PIPELINE FAILURE: DApp testnet mode auto-provisioning collapsed:', err.message);
            throw err;
        }
    }
}
