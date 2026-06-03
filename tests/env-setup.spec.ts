/**
 * env-setup.spec.ts - Out-of-Band Cloud-Native Provisioning Engine
 * @module EnvSetupSpec
 * @description Executes deterministic zero-state wallet environment provisioning.
 * Orchestrates linear onboarding matrices directly onto the raw web3 provider extension context
 * without injecting unsafe evaluation hooks or generating phantom browser tabs.
 * * Architectural Paradigms & Anti-Friction Tactics:
 * 1. Reactive Topology Mitigation: Forces rigid 1080P viewports and hard maximized window limits 
 * to flatten responsive display-none CSS rules.
 * 2. Sandboxed Sandbox Interception: Hooks the volatile initial extension redirect stream via 
 * atomic asynchronous event traps.
 * 3. LavaMoat Shield Deflection: Bans page.evaluate() calls entirely, performing 100% pure 
 * L-3 pointer coordinate mutations.
 */

import { test, chromium, type Page, type Locator } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { CONFIG } from '../config/config';
import { logger } from '../utils/logger';

// =========================================================================
// 🎯 Declarative Provisioning Blueprint (Decoupled Locator Registry)
// =========================================================================
class OnboardingPageRegistry {
    // --- Phase 1 & 2: License Agreement & Telemetry Interception ---
    static termsCheckbox = (page: Page): Locator => page.getByTestId('onboarding-terms-checkbox');
    static importWalletBtn = (page: Page): Locator => page.getByTestId('onboarding-import-wallet');
    static telemetryOptOutBtn = (page: Page): Locator => page.getByTestId('metametrics-no-thanks');

    // --- Phase 3: Cryptographic Seed Phrase (SRP) Matrix ---
    static srpInputSlot = (page: Page, index: number): Locator => page.getByTestId(`import-srp__srp-word-${index}`);
    static srpConfirmBtn = (page: Page): Locator => page.getByTestId('import-srp-confirm');

    // --- Phase 4: Account Vault Hardening Passwords ---
    static passwordNewInput = (page: Page): Locator => page.getByTestId('create-password-new');
    static passwordConfirmInput = (page: Page): Locator => page.getByTestId('create-password-confirm');
    static passwordTermsCheckbox = (page: Page): Locator => page.getByTestId('create-password-terms');
    static passwordSubmitBtn = (page: Page): Locator => page.getByTestId('create-password-import');

    // --- Phase 5: Onboarding Walkthrough Dismissal Arrays ---
    static completeDoneBtn = (page: Page): Locator => page.getByTestId('onboarding-complete-done');
    static pinNextBtn = (page: Page): Locator => page.getByTestId('pin-extension-next');
    static pinDoneBtn = (page: Page): Locator => page.getByTestId('pin-extension-done');

    // --- Phase 6: Core Network Threshold Switches (Sepolia Injection) ---
    static networkPickerMenu = (page: Page): Locator => page.getByTestId('network-display')
    static globalTestnetToggle = (page: Page): Locator => page.locator('label.toggle-button');
    static sepoliaNetworkCard = (page: Page): Locator => page.getByTestId('Sepolia');
}

// =========================================================================
// ⚙️ Executable Provisioning Pipeline (State Tree Inflation)
// =========================================================================
test('Cloud-Native Provisioning: Automated Credential Ingestion & Sepolia Alignment @env', async () => {
    // Allocate generous 90-second execution bracket for network-bound cryptographic actions
    test.setTimeout(90000);
    const METAMASK_PATH = path.resolve(process.cwd(), 'extension/metamask');
    const USER_DATA_PATH = path.resolve(process.cwd(), 'playwright/.auth/user-data');
    
    if (!fs.existsSync(METAMASK_PATH)) {
        throw new Error(`❌ FATAL CONFIGURATION DEFECT: Extension binary block missing at targeted path: ${METAMASK_PATH}`);
    }

    const mnemonicString = process.env.MNEMONIC || process.env.SECRET_PHRASE;
    const walletPassword = process.env.WALLET_PASSWORD;

    if (!mnemonicString || !walletPassword) {
        throw new Error('❌ FATAL CREDENTIAL VOID: MNEMONIC or WALLET_PASSWORD environment variables are unasserted.');
    }

    logger.info('TEST_EXECUTION', 'SANDBOX_INIT', 'Mounting structural persistent browser sandbox with extension payload blocks...');
    const context = await chromium.launchPersistentContext(USER_DATA_PATH, {
        headless: false,
        viewport: { width: 1920, height: 1080 }, // Hard limit to destroy mobile layout overrides
        locale: 'en-US',
        args: [
            `--disable-extensions-except=${METAMASK_PATH}`,
            `--load-extension=${METAMASK_PATH}`,
            `--lang=en-US`,
            `--accept-lang=en,en-US`,
            `--start-maximized` // Instruct chromium graphics window to initialize maximized
        ],
    });

    logger.info('TEST_EXECUTION', 'WINDOW_TRACK', 'Tracking asynchronous window creation events to capture core extension viewports...');

    // Asynchronous Viewport Ingestion: Trap the native out-of-band onboarding tab dynamically
    const page = await context.waitForEvent('page');
    await page.bringToFront();

    // Soft buffer to ensure stable React architecture state updates
    await page.waitForLoadState('networkidle').catch(() => { });
    await page.waitForTimeout(2000);
    logger.info('TEST_EXECUTION', 'CONTEXT_BOUND', 'Target context bound successfully. Starting zero-state automated environment inflation...');

    // --- Milestone 1: License Consent & Action Allocation ---
    logger.info('TEST_EXECUTION', 'LICENSE', 'Consuming legal policy agreements and entering structural import matrices...');
    const termsCheck = OnboardingPageRegistry.termsCheckbox(page);
    await termsCheck.waitFor({ state: 'attached', timeout: 15000 });
    await termsCheck.click({ force: true });
    await OnboardingPageRegistry.importWalletBtn(page).click();

    // --- Milestone 2: Analytical Data Telemetry Deletion ---
    logger.info('TEST_EXECUTION', 'TELEMETRY', 'Dismissing out-of-band telemetry tracking components...');
    const telemetryBtn = OnboardingPageRegistry.telemetryOptOutBtn(page);
    await telemetryBtn.waitFor({ state: 'visible', timeout: 10000 });
    await telemetryBtn.click();

    // --- Milestone 3: Sequential SRP Input Mapping ---
    logger.info('TEST_EXECUTION', 'SRP_INPUT', 'Dispatched sequence loops to fill cryptographic seed matrices...');
    const mnemonicWords = mnemonicString.split(' ');
    for (let i = 0; i < 12; i++) {
        const fieldInput = OnboardingPageRegistry.srpInputSlot(page, i);
        await fieldInput.waitFor({ state: 'visible', timeout: 5000 });
        await fieldInput.fill(mnemonicWords[i]);
    }
    await OnboardingPageRegistry.srpConfirmBtn(page).click();

    // --- Milestone 4: Vault Account Lock Hardening ---
    logger.info('TEST_EXECUTION', 'PASSWORD', 'Encoding local storage security credential profiles...');
    await OnboardingPageRegistry.passwordNewInput(page).fill(walletPassword);
    await OnboardingPageRegistry.passwordConfirmInput(page).fill(walletPassword);
    await OnboardingPageRegistry.passwordTermsCheckbox(page).click({ force: true });
    await OnboardingPageRegistry.passwordSubmitBtn(page).click();

    // --- Milestone 5: Clearance of Context Walkthrough Modal Nodes ---
    logger.info('TEST_EXECUTION', 'WALKTHROUGH', 'Identity instantiated. Sweeping system instructional dialog cascades...');

    const completeBtn = OnboardingPageRegistry.completeDoneBtn(page);
    await completeBtn.waitFor({ state: 'visible', timeout: 15000 });
    await completeBtn.click();

    const pinNext = OnboardingPageRegistry.pinNextBtn(page);
    await pinNext.waitFor({ state: 'visible', timeout: 10000 });
    await pinNext.click();

    const pinDone = OnboardingPageRegistry.pinDoneBtn(page);
    await pinDone.waitFor({ state: 'visible', timeout: 10000 });
    await pinDone.click();

    //--- Milestone 6: L-3 Coordinate Pinned Network Configuration (Sepolia Alignment) ---
    logger.info('TEST_EXECUTION', 'NETWORK_INIT', 'Executing physical vector positioning over the primary network display component...');

    await page.waitForLoadState('networkidle').catch(() => { });
    await page.waitForTimeout(2000);

    const arrowTrigger = OnboardingPageRegistry.networkPickerMenu(page).first();
    await arrowTrigger.waitFor({ state: 'visible', timeout: 15000 });
    // Explode dropdown layout options cleanly via pure pointer hit
    await arrowTrigger.click();
    logger。info('TEST_EXECUTION'， 'NETWORK_DROPDOWN', 'Network dropdown expansion dispatched. Syncing local list states...');
    await page.waitForTimeout(2000);

    // Dynamic verification checkpoint capture
    await page.screenshot({ path: 'network_dropdown_check.png' });
    logger.info('TEST_EXECUTION', 'SCREENSHOT', 'Visual telemetry recorded to project root file: network_dropdown_check.png');
    logger.info('TEST_EXECUTION', 'NETWORK_TOGGLE', 'Locating advanced testnet display semantic toggles...');
    const toggleSwitch = OnboardingPageRegistry.globalTestnetToggle(page).first();
    await toggleSwitch.waitFor({ state: 'attached', timeout: 5000 });
    await toggleSwitch.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);


    // Toggle network threshold visibility state
    await toggleSwitch.click({ force: true });
    logger.info('TEST_EXECUTION', 'NETWORK_MUTATE', 'Global network visibility thresholds mutated.');
    await page.waitForTimeout(1500);

    logger.info('TEST_EXECUTION', 'NETWORK_SELECT', 'Pining specific Sepolia target coordinates inside the expanded layout view...');
    const targetCard = OnboardingPageRegistry.sepoliaNetworkCard(page);
    await targetCard.waitFor({ state: 'attached', timeout: 5000 });
    await targetCard.scrollIntoViewIfNeeded();
    await targetCard.click({ force: true });

    //--- Milestone 7: Final Synchronization & State Persistence ---
    const statePath = path.resolve(process.cwd(), 'playwright/.auth/state.json');
    if (!fs.existsSync(path.dirname(statePath))) {
        fs.mkdirSync(path.dirname(statePath), { recursive: true });
    }

    await page.context().storageState({ path: statePath });
    logger.info('TEST_EXECUTION', 'FINALIZE', 'State tree tracking hardened successfully.');
    await context.close();
});
