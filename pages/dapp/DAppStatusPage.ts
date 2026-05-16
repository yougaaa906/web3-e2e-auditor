/**
 * DAppStatusPage - DApp Global Transaction Status Verification Page Object
 * @module DAppStatusPage
 * @description Encapsulates contextual front-end state detection mechanisms for out-of-band transaction states 
 * (e.g., Pending mempool propagation, execution failure, or broadcast confirmations). Supplies non-blocking
 * health probes to upstream assertion suites during asynchronous block digestion.
 */

import type { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class DAppStatusPage extends BasePage {
    // --- Contextual DOM Element Locators ---
    // 💡 BUGFIX: Strung regex literals like '/Pending/i' fail evaluation in Playwright engine core.
    // Re-factored into a native RegExp instance to correctly track fluid DOM mutations like "1 Pending..." or "Pending confirmation".
    private readonly pendingElem = this.page.getByText(/Pending/i);

    constructor(page: Page) {
        super(page);
    }

    /**
     * Audits whether the front-end application successfully catches and reflects the mempool 'Pending' status banner
     * under underpriced gas thresholds.
     * * @returns {Promise<boolean>} Resolves to true if state-tracking banners manifest on DOM nodes, false if timeout surges.
     */
    async isPendingToastVisible(): Promise<boolean> {
        try {
            console.log('[Status-Audit] Activating low-gas transaction status monitoring probes...');

            // Wait for the pending locator element to resolve and mount safely onto the active page DOM tree
            await this.waitElemVisible(this.pendingElem);

            console.log('✅ [Status-Audit] Successfully intercepted active Pending transaction toast inside DApp layer.');
            return true;
        } catch (e) {
            // 💡 TypeScript Safety Armor: Coerce 'unknown' catch variables into standard safe Error types
            const errorMessage = e instanceof Error ? e.message : String(e);
            console.log(`ℹ️ [Status-Audit] Status probe returned negative (or target node unmounted post-refresh): ${errorMessage}`);
            return false;
        }
    }
}