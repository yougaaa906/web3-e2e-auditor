/**
 * env-setup.spec.ts - Out-of-Band Cloud-Native Provisioning Engine
 * @module EnvSetupSpec
 * @description Executes deterministic zero-state wallet environment provisioning.
 */

import { test, chromium, type Page, type Locator } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { logger } from '../utils/logger';

// =========================================================================
// 🎯 Declarative Provisioning Blueprint (Decoupled Locator Registry)
// =========================================================================
class OnboardingPageRegistry {
    static termsCheckbox = (page: Page): Locator => page.getByTestId('onboarding-terms-checkbox');
    static importWalletBtn = (page: Page): Locator => page.getByTestId('onboarding-import-wallet');
    static telemetryOptOutBtn = (page: Page): Locator => page.getByTestId('metametrics-no-thanks');
    static srpInputSlot = (page: Page, index: number): Locator => page.getByTestId(`import-srp__srp-word-${index}`);
    static srpConfirmBtn = (page: Page): Locator => page.getByTestId('import-srp-confirm');
    static passwordNewInput = (page: Page): Locator => page.getByTestId('create-password-new');
    static passwordConfirmInput = (page: Page): Locator => page.getByTestId('create-password-confirm');
    static passwordTermsCheckbox = (page: Page): Locator => page.getByTestId('create-password-terms');
    static passwordSubmitBtn = (page: Page): Locator => page.getByTestId('create-password-import');
    static completeDoneBtn = (page: Page): Locator => page.getByTestId('onboarding-complete-done');
    static pinNextBtn = (page: Page): Locator => page.getByTestId('pin-extension-next');
    static pinDoneBtn = (page: Page): Locator => page.getByTestId('pin-extension-done');
    static networkPickerMenu = (page: Page): Locator => page.getByTestId('network-display');
    static globalTestnetToggle = (page: Page): Locator => page.locator('label.toggle-button');
    static sepoliaNetworkCard = (page: Page): Locator => page.getByTestId('Sepolia');
}

// =========================================================================
// ⚙️ Executable Provisioning Pipeline (State Tree Inflation)
// =========================================================================
test('Cloud-Native Provisioning: Automated Credential Ingestion & Sepolia Alignment @env', async () => {
    test.setTimeout(120000);

    const METAMASK_PATH = path.resolve(process.cwd(), 'extension/metamask');
    const USER_DATA_PATH = path.resolve(process.cwd(), 'playwright/.auth/user-data');
    
    if (!fs.existsSync(METAMASK_PATH)) {
        throw new Error(`❌ FATAL: Extension binary block missing at: ${METAMASK_PATH}`);
    }

    const mnemonicString = process.env.MNEMONIC || process.env.SECRET_PHRASE;
    const walletPassword = process.env.WALLET_PASSWORD;

    if (!mnemonicString || !walletPassword) {
        throw new Error('❌ FATAL: MNEMONIC or WALLET_PASSWORD environment variables are unasserted.');
    }

    logger.info('TEST_EXECUTION', 'SANDBOX_INIT', 'Mounting structural persistent browser sandbox...');
    
    const context = await chromium.launchPersistentContext(USER_DATA_PATH, {
        headless: !!process.env.CI,
        viewport: { width: 1920, height: 1080 },
        args: [
            `--disable-extensions-except=${METAMASK_PATH}`,
            `--load-extension=${METAMASK_PATH}`,
            '--no-sandbox',
            '--disable-dev-shm-usage'
        ],
    });

    // Capture the extension onboarding page dynamically with polling
    logger.info('TEST_EXECUTION', 'PAGE_CAPTURE', 'Polling for active onboarding window...');

    let page: Page | undefined;
    for (let i = 0; i < 60; i++) {
        const pages = context.pages();
        page = pages.find(p => 
            p.url().includes('home.html') || 
            p.url().includes('onboarding') || 
            p.url().includes('extension://')
        );
        
        if (page) {
            logger.info('TEST_EXECUTION', 'PAGE_CAPTURE', `Found target: ${page.url()}`);
            break;
        }
        await new Promise(r => setTimeout(r, 1000));
    }

    if (!page) {
        logger.info('DEBUG', 'CURRENT_PAGES', context.pages().map(p => p.url()).join(' | '));
        throw new Error('❌ FATAL: MetaMask onboarding page never appeared.');
    }

    await page.bringToFront();
    await page.waitForLoadState('domcontentloaded');

    logger.info('TEST_EXECUTION', 'CONTEXT_BOUND', 'Inflation start: Provisioning wallet state...');

    // --- Milestone 1: License Consent ---
    logger.info('TEST_EXECUTION', 'LICENSE', 'Consuming legal policy agreements...');
    const termsCheck = OnboardingPageRegistry.termsCheckbox(page);
    await termsCheck.waitFor({ state: 'visible', timeout: 15000 });
    await termsCheck.click({ force: true });
    await OnboardingPageRegistry.importWalletBtn(page).click();

    // --- Milestone 2: Telemetry Deletion ---
    logger.info('TEST_EXECUTION', 'TELEMETRY', 'Dismissing analytics telemetry...');
    await OnboardingPageRegistry.telemetryOptOutBtn(page).click();

    // --- Milestone 3: Sequential SRP Mapping ---
    logger.info('TEST_EXECUTION', 'SRP_INPUT', 'Filling cryptographic seed matrices...');
    const mnemonicWords = mnemonicString.split(' ');
    for (let i = 0; i < 12; i++) {
        await OnboardingPageRegistry.srpInputSlot(page, i).fill(mnemonicWords[i]);
    }
    await OnboardingPageRegistry.srpConfirmBtn(page).click();

    // --- Milestone 4: Vault Hardening ---
    logger.info('TEST_EXECUTION', 'PASSWORD', 'Instantiating security credential profiles...');
    await OnboardingPageRegistry.passwordNewInput(page).fill(walletPassword);
    await OnboardingPageRegistry.passwordConfirmInput(page).fill(walletPassword);
    await OnboardingPageRegistry.passwordTermsCheckbox(page).click({ force: true });
    await OnboardingPageRegistry.passwordSubmitBtn(page).click();

    // --- Milestone 5: Clearance of Modal Nodes ---
    logger.info('TEST_EXECUTION', 'WALKTHROUGH', 'Sweeping instructional dialog cascades...');
    await OnboardingPageRegistry.completeDoneBtn(page).click();
    await OnboardingPageRegistry.pinNextBtn(page).click();
    await OnboardingPageRegistry.pinDoneBtn(page).click();

    // --- Milestone 6: Network Configuration (Sepolia Alignment) ---
    logger.info('TEST_EXECUTION', 'NETWORK_INIT', 'Executing physical vector positioning on network display...');
    await OnboardingPageRegistry.networkPickerMenu(page).first().click();
    await OnboardingPageRegistry.globalTestnetToggle(page).first().click({ force: true });
    await OnboardingPageRegistry.sepoliaNetworkCard(page).click({ force: true });

    // --- Milestone 7: State Persistence ---
    const statePath = path.resolve(process.cwd(), 'playwright/.auth/state.json');
    if (!fs.existsSync(path.dirname(statePath))) fs.mkdirSync(path.dirname(statePath), { recursive: true });

    await page.context().storageState({ path: statePath });
    logger.info('TEST_EXECUTION', 'FINALIZE', 'State tree hardened. Context channel closing.');
    await context.close();
});
