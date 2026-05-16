import { test, chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test('环境初始化：配置 MetaMask 持久化状态 @env', async () => {
    // 设置一个超长超时，或者干脆设为 0（无限等待）
    test.setTimeout(0); 

    const METAMASK_PATH = path.resolve('extension/metamask');
    const USER_DATA_PATH = path.resolve('user_data');

    // 检查插件路径是否存在，避免低级报错
    if (!fs.existsSync(METAMASK_PATH)) {
        throw new Error(`❌ 找不到插件：${METAMASK_PATH}，请确认路径是否正确。`);
    }

    const context = await chromium.launchPersistentContext(USER_DATA_PATH, {
        headless: false,
        // 【关键修正点 1】既然视口是 null，缩放比例也必须关掉
        viewport: null,
        deviceScaleFactor: undefined,
        args: [
            `--disable-extensions-except=${METAMASK_PATH}`,
            `--load-extension=${METAMASK_PATH}`,
            '--start-maximized',
        ],
    });
    const page = await context.newPage();

    // 【优化点 1】直接跳转到 MetaMask 首页
    // 注意：ID 可能会变，你可以通过 context.backgroundPages() 获取，或者手动填入你本地的 ID
    // 大多数 Chrome 版本的 MM ID 是这个：nkbihfbeogaeaoehlefnkodbefgpgknn
    const extensionId = 'nkbihfbeogaeaoehlefnkodbefgpgknn';
    try {
        await page.goto(`chrome-extension://${extensionId}/home.html`);
    } catch (e) {
        // 如果 ID 不对，先去 Google 保活，然后让你手动点开插件
        await page.goto('https://www.google.com');
        console.log('⚠️ 插件 ID 可能不匹配，请手动点击浏览器右上角 MetaMask 图标进行配置。');
    }

    console.log('--- 🛡️ 经理战斗指令：环境配置中 ---');
    console.log('1. 请在弹出的浏览器中完成助记词导入、网络切换。');
    console.log('2. 完成后，请在此控制台按 Ctrl+C，或者直接关闭浏览器。');
    console.log('3. 配置会被自动保存在 user_data 文件夹中。');

    // 【优化点 2】优雅等待：只要浏览器没关，脚本就不退出
    // 这比死等 30 分钟更智能
    page.on('close', () => {
        console.log('✅ 浏览器已关闭，环境配置已保存！');
        process.exit();
    });

    // 依然保留一个兜底的长等待，防止意外退出
    await page.waitForTimeout(3000000); 

    await context.close();
});