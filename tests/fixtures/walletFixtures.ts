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
        // 🌟 绝杀补丁 1：强制转换绝对路径！粉碎 Linux Chromium 相对路径挂起 BUG
        const METAMASK_PATH = path.resolve(CONFIG.METAMASK.EXTENSION_PATH || 'extension/metamask');
        const USER_DATA_PATH = path.resolve(CONFIG.METAMASK.USER_DATA_PATH || 'user_data');

        // 🛡️ 物理碎锁：强制清理上次未正常关闭遗留的进程锁
        const lock1 = path.join(USER_DATA_PATH, 'SingletonLock');
        const lock2 = path.join(USER_DATA_PATH, 'SingletonCookie');
        try { if (fs.existsSync(lock1)) fs.unlinkSync(lock1); } catch (e) {}
        try { if (fs.existsSync(lock2)) fs.unlinkSync(lock2); } catch (e) {}

        console.log('📦 [Wallet-Fixture] Mounting persistent browser context with targeted provider payload...');
        
        const context = await chromium.launchPersistentContext(USER_DATA_PATH, {
            headless: false, 
            viewport: { width: 1920, height: 1080 },
            locale: 'en-US', // 🌟 绝杀补丁 2：严格对齐 env-setup 的环境属性
            args: [
                `--disable-extensions-except=${METAMASK_PATH}`,
                `--load-extension=${METAMASK_PATH}`,
                `--lang=en-US`,
                `--accept-lang=en,en-US`,
                '--start-maximized',
                
                // 🛡️ Linux CI 防斩杀参数（与 env-setup 保持 100% 一致，移除多余的 disable-gpu 避免状态冲突）
                '--no-sandbox',                      
                '--disable-setuid-sandbox',          
                '--disable-dev-shm-usage',           

                // 🛡️ 屏蔽 Chrome 崩溃恢复弹窗
                '--disable-crash-reporter',
                '--hide-crash-restore-bubble',
                '--disable-infobars',
                '--no-default-browser-check'
            ]
        });

        console.log('⏳ [Wallet-Fixture] Yielding process thread to allow background extension scripts to boot natively...');
        await context.waitForTimeout(3000); 

        await use(context);

        console.log('🏁 [Wallet-Fixture] Test block finalized. Liquidating physical persistent context lock...');
        await context.close();
    },

    page: async ({ context }, use) => {
        console.log('📄 [Wallet-Fixture] Allocating primary DApp viewport canvas...');
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

export { expect, chromium } from '@playwright/test';
