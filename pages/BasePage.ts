/**
 * BasePage - Foundational Page Object Abstract Base Class
 * @module BasePage
 * @description Serves as the infrastructural engine for the entire automation library.
 * Standardizes synchronous element interaction vectors, mitigates multithreaded extension window
 * race conditions, and provides globally structured, observable reporting Hooks via Playwright test layers.
 */

import { test } from '@playwright/test';
import type { Page, Locator } from '@playwright/test';
import { CONFIG } from '../config/config';

export class BasePage {
    protected page: Page;
    protected timeout: number;

    constructor(page: Page) {
        this.page = page;
        this.timeout = CONFIG.TIMEOUT.MEDIUM;
    }

    /**
     * Resolves the primary active page context execution track.
     * @returns {Page} Active Playwright driver reference page.
     */
    get mainPage(): Page {
        return this.page;
    }

    /**
     * Dispatches pointer click events to target elements within specified timeout boundaries.
     * @param {Locator} locator - Target element pointer mapping selector.
     * @param {string} [stepName] - Descriptive nomenclatures allocated to structural reports.
     */
    async elemClick(locator: Locator, stepName?: string) {
        await test.step(`[Action] Click: ${stepName || 'Target Element'}`, async () => {
            await locator.click({ timeout: this.timeout });
        });
    }

    /**
     * Injects characters into targeted input data fields via driver interactions.
     * @param {Locator} locator - Target field selector locator.
     * @param {string} text - Payload characters array injected into the elements.
     * @param {string} [stepName] - Descriptive nomenclatures allocated to structural reports.
     */
    async elemFill(locator: Locator, text: string, stepName?: string) {
        await test.step(`[Action] Fill Input: ${stepName || 'Input Field'} = "${text}"`, async () => {
            await locator.fill(text);
        });
    }

    /**
     * Programmatically triggers reactive 'input' and 'change' events across elements.
     * 🛡️ Strategic Design: Overcomes strict client-side state hooks management (e.g., React Virtual DOM).
     * Standard native driver string allocations often fail to invoke state propagation hooks without explicit event bubbling dispatches.
     * @param {Locator} locator - Target element pointer mapping selector.
     * @param {string} [stepName] - Functional process descriptor tracking label strings.
     */
    async triggerInputEvent(locator: Locator, stepName?: string) {
        await test.step(`[Event] Transmute Input Listeners${stepName ? ` (${stepName})` : ''}`, async () => {
            await locator.evaluate((el) => {
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
            });
        });
    }

    /**
     * Purges input fields text values securely.
     * @param {Locator} locator - Target field locator tracker.
     * @param {string} [stepName] - Functional process descriptor tracking label strings.
     */
    async elemClear(locator: Locator, stepName?: string) {
        await test.step(`[Action] Clear: ${stepName || 'Input Field'}`, async () => {
            await locator.clear();
        });
    }

    /**
     * Synchronizes execution loops until targeted elements fulfill visibility thresholds.
     * @param {Locator} locator - Target component selector.
     * @param {string} [stepName] - Functional process descriptor tracking label strings.
     */
    async waitElemVisible(locator: Locator, stepName?: string) {
        await test.step(`[Wait] Visibility Check: ${stepName || 'Target Element'}`, async () => {
            await locator.waitFor({ state: "visible", timeout: this.timeout });
        });
    }

    /**
     * Executes interaction vectors and concurrently intercepts out-of-band popup contexts.
     * 🛡️ Strategic Design: Wraps click interactions and event listeners into an atomic Promise.all structure
     * to fully insulate pipelines against catastrophic cross-context asynchronous racing conditions.
     * @param {Locator} clickLocator - Element trigger expected to launch popup instances.
     * @param {string} [stepName] - Functional process descriptor tracking label strings.
     * @returns {Promise<Page>} The safely resolved third-party extension page context handle.
     */
    async clickAndGetPopup(clickLocator: Locator, stepName?: string): Promise<Page> {
        return await test.step(`[Interaction] Capture Extension Window Context: ${stepName || 'External Popup'}`, async () => {
            const [popup] = await Promise.all([
                this.page.context().waitForEvent('page', { timeout: CONFIG.TIMEOUT.LONG }),
                clickLocator.click(),
            ]);
            return popup;
        });
    }

    /**
     * Executes hard browser reloads to wipe localized volatile component states.
     */
    async pageReload() {
        await test.step(`[Sandbox] Force Browser Context Reload`, async () => {
            await this.page.reload({ waitUntil: 'load' });
        });
    }

    /**
     * Proactively forces the instantiation and foreground focus of the MetaMask wallet dashboard screen.
     * 🛡️ Strategic Design: Opens extensions natively via structural IDs instead of relying on brittle DApp event prompts.
     * ⚠️ Critical Optimization: Uses 'load' hooks instead of 'networkidle'. Wallet applications process permanent JSON-RPC
     * polling pipelines in background threads. Awaiting network idling guarantees spec-blocking timeout errors.
     * @returns {Promise<Page>} The re-focused full-screen wallet extension view handle.
     */
    async openMetaMaskHome(): Promise<Page> {
        let walletPage: Page | undefined;

        await test.step(`[Wallet] Mount Full-page Provider Dashboard Instance`, async () => {
            const context = this.page.context();

            // 1. Context Cache Reclamation: Reuse home instance if previously mounted
            walletPage = context.pages().find(p => p.url().includes('home.html'));

            if (!walletPage) {
                console.log(`📡 [Telemetry-ID] Querying runtime layers for MetaMask unique identifier...`);
                let realExtensionId = '';

                // 2. Primary Heuristic: Scan active context page history for matching schemas
                const walletPageWithId = context.pages().find(p => p.url().includes('chrome-extension://'));
                if (walletPageWithId) {
                    const match = walletPageWithId.url().match(/chrome-extension:\/\/([^/]+)/);
                    if (match) realExtensionId = match[1];
                }

                // 3. Secondary Deflective Layer: Scan long-lived Chrome extension memory background pages
                if (!realExtensionId) {
                    const bgPages = context.backgroundPages();
                    const bgPageWithId = bgPages.find(p => p.url().includes('chrome-extension://'));
                    if (bgPageWithId) {
                        const match = bgPageWithId.url().match(/chrome-extension:\/\/([^/]+)/);
                        if (match) realExtensionId = match[1];
                    }
                }

                // 4. Invariant Fallback Framework: Apply hardened fallback runtime identifier bound
                if (!realExtensionId) {
                    realExtensionId = 'nenmcdijiofhajlobjjcfcidgaflhmof';
                }

                console.log(`🎯 [Telemetry-ID] Resolved active target identifier bounds: ${realExtensionId}`);

                // 5. Initialize isolated secondary execution tab
                walletPage = await context.newPage();
                const targetExtensionUrl = `chrome-extension://${realExtensionId}/home.html`;
                console.log(`🚀 [Route-Lock] Transitioning context path coordinates directly to: ${targetExtensionUrl}`);

                // 6. Navigate directly via validated path schema; bypass lifecycle sandbox blockages
                await walletPage.goto(targetExtensionUrl);
                await walletPage.waitForLoadState('load');
            }

            // Bring target full page instance to foreground frames
            await walletPage.bringToFront();
        });

        return walletPage!;
    }

    /**
     * Introduces an arbitrary delay bounds inside the runner lifecycle thread.
     * @param {number} ms - Allocation time duration (denominated in milliseconds).
     */
    async waitTimeout(ms: number) {
        await test.step(`[Sleep] Operational Buffer: ${ms}ms`, async () => {
            await this.page.waitForTimeout(ms);
        });
    }

    /**
     * Dispatches explicit system keystrokes directly into targeted element locators.
     * @param {Locator} locator - Target interface node selector.
     * @param {string} key - Dedicated character keys identifier sequence (e.g., 'Enter').
     * @param {string} [stepName] - Functional process descriptor tracking label strings.
     */
    async elemPress(locator: Locator, key: string, stepName?: string) {
        await test.step(`[Action] Keystroke: ${key}${stepName ? ` (${stepName})` : ''}`, async () => {
            await locator.press(key);
        });
    }

    /**
     * Routes the localized browser instance directly to remote endpoint destinations.
     * @param {string} url - Comprehensive remote destination address string paths.
     */
    async pageGoto(url: string) {
        await test.step(`[Navigation] Routing Context to: ${url}`, async () => {
            await this.page.goto(url);
        });
    }

    /**
     * Standardizes page lifecycle assertions across consistent execution blocks.
     * @param {'load' | 'domcontentloaded' | 'networkidle'} loadState - Operational bounds applied to evaluations.
     * @param {object} [options] - Supplementary parameter configurations passed down to underlying drivers.
     */
    async waitForLoadState(loadState: 'load' | 'domcontentloaded' | 'networkidle' = 'networkidle', options?: { timeout?: number }) {
        await test.step(`[Wait] Stabilize Context Lifecycle (${loadState})`, async () => {
            await this.page.waitForLoadState(loadState, options);
        });
    }

    /**
     * Monitors and blocks execution blocks until precise element mutations align to expected metrics.
     * @param {Locator} locator - Target tracking selector node.
     * @param {'visible' | 'hidden' | 'attached' | 'detached'} state - End-state metrics targeted by assertions.
     * @param {number} [timeout] - Allocation timeout barriers.
     */
    async waitForLocator(locator: Locator, state: 'visible' | 'hidden' | 'attached' | 'detached' = 'visible', timeout?: number) {
        await test.step(`[Wait] Await Component Transition State: ${state}`, async () => {
            await locator.waitFor({ state, timeout });
        });
    }

    /**
     * Establishes adaptive polling loops to track element operational enablement states.
     * 🛡️ Strategic Design: Avoids brittle rigid driver wait configurations. 
     * Handles front-end aggregate data rendering lag seamlessly without blowing up pipeline run states.
     * @param {Locator} locator - Targeted tracking node element.
     * @param {number} [timeout] - Upper scheduling threshold barriers allocated to the loop parameters.
     */
    async waitForEnabled(locator: Locator, timeout: number = this.timeout) {
        await test.step(`[Wait] Await Component Usability (Enabled State Transition)`, async () => {
            const startTime = Date.now();
            while (Date.now() - startTime < timeout) {
                if (await locator.isEnabled()) {
                    return;
                }
                await this.waitTimeout(100);
            }
            throw new Error(`Timeout exceeded while awaiting element enablement transitions (${timeout}ms)`);
        });
    }
}