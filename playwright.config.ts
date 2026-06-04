import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

// 加载环境变量
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export default defineConfig({
  testDir: './tests',
  // 核心优化：强制 CI 为 1 个 worker，且完全串行化
  workers: process.env.CI ? 1 : undefined,
  fullyParallel: false,

  timeout: 120000,
  expect: { timeout: 20000 },

  reporter: [
    ['line'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],

  projects: [
    {
      name: 'setup',
      testMatch: 'tests/env-setup.spec.ts',
      use: { 
        headless: !!process.env.CI,
      },
    },
    {
      name: 'chromium-tests',
      testMatch: /.*\.spec\.ts/,
      testIgnore: 'tests/env-setup.spec.ts', // 关键：排除 setup 文件，防止重复执行
      dependencies: ['setup'], // 确保 setup 先运行
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/state.json',
        
        // 关键优化：针对 CI Linux 环境的资源防御性配置
        launchOptions: {
          args: [
            '--disable-gpu',           // 修复 Segmentation fault (code 139)
            '--disable-software-rasterizer',
            '--disable-dev-shm-usage', // 防止 CI 环境共享内存溢出
            '--no-sandbox',
            '--js-flags="--max-old-space-size=2048"' // 限制进程内存占用
          ]
        }
      },
    },
  ],
});
