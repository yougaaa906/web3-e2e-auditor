/**
 * walletFixtures - Root Level Web3 Browser Sandboxing Test Fixtures
 * @module walletFixtures
 * @description Establishes the foundational physical layer isolation bounds for the runner framework.
 * Programmatically injects the unzipped MetaMask extension binary into a persistent Chromium user directory profiles,
 * and initializes decoupled Page Object models across clean test lifecycle boundaries.
 * * Architectural Paradigms:
 * 1. Persistent State Retention: Seeds extension configurations (keys, networks) cleanly across specs.
 * 2. Automated Fixture Teardown: Safely closes downstream browser contexts to mitigate memory leakages.
 * 3. Atomic Dependency Injection: Decouples page lifecycle assignments away from spec body initializations.
 */

import { test as base, type BrowserContext, type Page, chromium } from '@playwright/test';
import { MetaMaskPage } from "../../pages/wallet/MetaMaskPage";
import { DAppSwapPage } from '../../pages/dapp/DAppSwapPage';
import { WalletConnectPage } from "../../pages/dapp/WalletConnectPage";
import { CONFIG } from '../../config/config';

// Declare root structural properties allocated to the baseline wallet sandboxing setup
type WalletFixtures = {
    context: BrowserContext;
    page: Page;
    mmPage: MetaMaskPage;
    swapPage: DAppSwapPage;
    connectPage: WalletConnectPage;
};

// Extend foundational Playwright test suites to map specialized EVM execution environments
export const test = base.extend<WalletFixtures>({
    /**
     * context Fixture: Hooks persistent storage structures and injects raw Chrome extension components.
     * Maps headless configurations natively based on upstream CI/CD matrix environments.
     */
    context: async ({ }, use) => {
        // Spin up isolated runtime profiles mapping directly to local user data cache bounds
        const context = await chromium.launchPersistentContext(
            CONFIG.METAMASK.USER_DATA_PATH,
            {
                headless: CONFIG.HEADLESS,
                args: [
                    `--disable-extensions-except=${CONFIG.METAMASK.EXTENSION_PATH}`,
                    `--load-extension=${CONFIG.METAMASK.EXTENSION_PATH}`
                ]
            }
        );

        // Pass control blocks back down to upstream operational threads
        await use(context);

        // Automated Teardown: Safely execute context destruction to purge volatile memory parameters post-run
        await context.close();
    },

    /**
     * page Fixture: Materializes explicit browser windows and routes context paths to the targeted gateway node.
     */
    page: async ({ context }, use) => {
        const page = await context.newPage();
        await page.goto(CONFIG.BASE_URL);
        await use(page);
    },

    /**
     * mmPage Fixture: Instantiates and maps decentralized operational tracking controllers for MetaMask.
     */
    mmPage: async ({ page }, use) => {
        await use(new MetaMaskPage(page));
    },

    /**
     * swapPage Fixture: Instantiates and maps core exchange form operation controllers.
     */
    swapPage: async ({ page }, use) => {
        await use(new DAppSwapPage(page));
    },

    /**
     * connectPage Fixture: Instantiates and maps vendor listing authorization controllers.
     */
    connectPage: async ({ page }, use) => {
        await use(new WalletConnectPage(page));
    }
});

// Re-export standard expectation validation APIs cleanly
export { expect } from '@playwright/test';