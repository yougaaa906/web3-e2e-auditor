/**
 * walletFixtures.ts - Root Level Web3 Browser Sandboxing Test Fixtures
 * @module walletFixtures
 * @description Establishes the foundational physical layer isolation bounds for the runner framework.
 * Programmatically injects the raw MetaMask extension binary block directly into persistent memory profiles.
 */

import { test as base, chromium, type BrowserContext, type Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { CONFIG } from '../../config/config';
import { MetaMaskPage } from '../../pages/wallet/MetaMaskPage';
import { DAppSwapPage } from '../../pages/dapp/DAppSwapPage';
import { WalletConnectPage } from '../../pages/dapp/WalletConnectPage';

type WalletFixtures = {
    context: BrowserContext;
    page: Page;
    mmPage: MetaMaskPage;
    swapPage: DAppSwapPage;
    connectPage: WalletConnectPage;
};

export const test = base.extend<WalletFixtures>({
    
    context: async ({}, use) => {
        const METAMASK_PATH = path.resolve(CONFIG.METAMASK.EXTENSION_PATH || 'extension/metamask');
        const USER_DATA_PATH = path.resolve(CONFIG.METAMASK.USER_DATA_PATH || 'user_data');

        // 清理残留锁文件，防止启动失败
        const lock1 = path.join(USER_DATA_PATH, 'SingletonLock');
        const lock2 = path.join(USER_DATA_PATH, 'SingletonCookie');
        try { if (fs.existsSync(lock1)) fs.unlinkSync(lock1); } catch (e) {}
        try { if (fs.existsSync(lock2)) fs.unlinkSync(lock2); } catch (e) {}

        console.log('📦 [Wallet-Fixture] Mounting persistent browser context...');
        
        const context = await chromium.launchPersistentContext(USER_DATA_PATH, {
            headless: true, // ✅ GitHub 必须开启无头模式
            viewport: { width: 1920, height: 1080 },
            locale: 'en-US',
            args: [
                `--disable-extensions-except=${METAMASK_PATH}`,
                `--load-extension=${METAMASK_PATH}`,
                '--lang=en-US',
                '--accept-lang=en,en-US',
                '--start-maximized',
                
                // ✅ GitHub Linux 稳定参数
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-software-rasterizer',

                // 屏蔽崩溃弹窗
                '--disable-crash-reporter',
                '--hide-crash-restore-bubble',
                '--disable-infobars',
                '--no-default-browser-check',
            ]
        });

        console.log('⏳ [Wallet-Fixture] Waiting for MetaMask to load...');
        await new Promise(resolve => setTimeout(resolve, 5000)); // ✅ 修复等待方法

        await use(context);

        console.log('🏁 [Wallet-Fixture] Closing context...');
        await context.close();
    },

    page: async ({ context }, use) => {
        console.log('📄 [Wallet-Fixture] Allocating primary DApp viewport...');
        const pages = context.pages();
        const page = pages.length > 0 ? pages[0] : await context.newPage();
        
        await page.goto(CONFIG.BASE_URL as string);
        await page.bringToFront();
        
        await use(page);
    },

    mmPage: async ({ page }, use) => { await use(new MetaMaskPage(page)); },
    swapPage: async ({ page }, use) => { await use(new DAppSwapPage(page)); },
    connectPage: async ({ page }, use) => { await use(new WalletConnectPage(page)); }
});

export { expect } from '@playwright/test';
