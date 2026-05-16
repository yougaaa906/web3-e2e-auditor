/**
 * walletFixtures.ts - Root Level Web3 Browser Sandboxing Test Fixtures
 * @module walletFixtures
 * @description Establishes the foundational physical layer isolation bounds for the runner framework.
 * Programmatically injects the raw MetaMask extension binary block directly into persistent memory profiles.
 * * Architectural Paradigms & CI/CD Resilience:
 * 1. Ghost Popup Deflection: Intentionally removes blocking page event listeners to support pre-provisioned cache arrays.
 * 2. Linux Sandbox Bypassing: Injects defensive runtime arguments (--no-sandbox, --disable-dev-shm-usage) 
 * to prevent LevelDB memory corruption inside headless Ubuntu worker environments.
 * 3. Reactive Resource Allocation: Lazily routes existing viewport frames to minimize CPU consumption during scaling.
 */

import { test as base, chromium, type BrowserContext, type Page } from '@playwright/test';
import path from 'path';
import { CONFIG } from '../../config/config';
import { MetaMaskPage } from '../../pages/wallet/MetaMaskPage';
import { DAppSwapPage } from '../../pages/dapp/DAppSwapPage';
import { WalletConnectPage } from '../../pages/dapp/WalletConnectPage';

// Declare structural boundaries for our DI container pipeline
type WalletFixtures = {
    context: BrowserContext;
    page: Page;
    mmPage: MetaMaskPage;
    swapPage: DAppSwapPage;
    connectPage: WalletConnectPage;
};

export const test = base.extend<WalletFixtures>({
    
    /**
     * Context DI Provider: Mounts the Chromium process with explicit extension flags
     */
    context: async ({}, use) => {
        const METAMASK_PATH = CONFIG.METAMASK.EXTENSION_PATH;
        const USER_DATA_PATH = CONFIG.METAMASK.USER_DATA_PATH;

        console.log('📦 [Wallet-Fixture] Mounting persistent browser context with targeted provider payload...');
        
        const context = await chromium.launchPersistentContext(USER_DATA_PATH, {
            headless: false, // Mandatory FALSE: Chromium drops extension runtimes under true headless modes. (Handled via Xvfb)
            viewport: { width: 1920, height: 1080 },
            args: [
                // Critical Extension Injection Vectors
                `--disable-extensions-except=${METAMASK_PATH}`,
                `--load-extension=${METAMASK_PATH}`,
                '--start-maximized',
                
                // 🛡️ CI/CD Linux Hardening Arguments (Prevents 120s timeout hanging)
                '--no-sandbox',                      // Disables strict Linux UI process bounds
                '--disable-setuid-sandbox',          // Deflects kernel privilege escalations
                '--disable-dev-shm-usage',           // Maps Chromium to physical disk rather than limited /dev/shm memory
                '--disable-gpu',                     // Mitigates hardware acceleration crashes on virtualized instances
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding'
            ]
        });

        // 🌟 Idempotent State Strategy:
        // We explicitly DO NOT wait for `context.waitForEvent('page')` here!
        // If the runner is utilizing a pre-provisioned user_data profile, MetaMask will NOT spawn an onboarding tab,
        // and waiting for it will result in an infinite execution lock. We simply yield for background scripts.
        console.log('⏳ [Wallet-Fixture] Yielding process thread to allow background extension scripts to boot natively...');
        await context.waitForTimeout(3000); 

        await use(context);

        console.log('🏁 [Wallet-Fixture] Test block finalized. Liquidating physical persistent context lock...');
        await context.close();
    },

    /**
     * Page DI Provider: Allocates the core front-end execution canvas
     */
    page: async ({ context }, use) => {
        console.log('📄 [Wallet-Fixture] Allocating primary DApp viewport canvas...');
        
        // Retrieve existing ghost tabs spawned by the engine to prevent excessive RAM bloat
        const pages = context.pages();
        const page = pages.length > 0 ? pages[0] : await context.newPage();
        
        await page.goto(CONFIG.BASE_URL as string);
        await page.bringToFront();
        
        await use(page);
    },

    /**
     * Page Object Model (POM) Injection Vectors
     */
    mmPage: async ({ page }, use) => {
        await use(new MetaMaskPage(page));
    },
    swapPage: async ({ page }, use) => {
        await use(new DAppSwapPage(page));
    },
    connectPage: async ({ page }, use) => {
        await use(new WalletConnectPage(page));
    }
});

// Re-export Playwright primitives to streamline spec implementations
export { expect, chromium } from '@playwright/test';
