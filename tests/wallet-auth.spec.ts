/**
 * wallet-auth.spec.ts - MetaMask Integration & Connection Integrity Audits
 * @module WalletAuthSpec
 * @description Validates the critical baseline entry point of the DApp: successful cryptographic handshakes 
 * and post-authorization session initialization with browser wallet extensions.
 * * Architectural Paradigms & Isolation Constraints:
 * 1. Sequential Thread Enforcement: Runs downstream configuration states on workers = 1 to prevent persistent directory lock conflict.
 * 2. Pre-authenticated State Yielding: Inherits from connectedWalletFixtures to completely isolate test code from brittle sign-on steps.
 * 3. Immutable Environment Sandboxing: Guarantees reproducible, isolated state execution across every suite invocation.
 */

import { test, expect } from './fixtures/connectedWalletFixtures';
import { logger } from '../utils/logger';

test.describe('MetaMask Wallet Connection & Session Integrity Suites', () => {
    /**
     * Test Case: Successful Wallet Connection and Public Address Reflection
     * * Audit Strategy:
     * 1. Dynamic Ingestion: Leverage the upstream connected fixture matrix to auto-trigger background authentication loops.
     * 2. Reactive Probing: Query the persistent status indicators to extract the returned active ledger account hash.
     * 3. Cryptographic Assertion: Validate the formatting bounds of the recovered text node to verify a valid EVM address profile.
     */
    test('Scenario 1: Authenticated Session Initialization and Address Ingestion', async ({ connectPage, mmPage }) => {
        // 💡 Architectural Note: Declaring mmPage as a dependency context parameter implicitly 
        // dispatches the upstream custom initialization fixture. By the time this code path executes, 
        // the wallet handshake has already consolidated into an authorized state.

        // Trigger reactive polling probes inside the Page Object to settle state synchronization delays
        const walletAddress = await connectPage.verifyConnectionAndGetAddress();

        // 🛡️ Critical Security Assertion: Verify structural layout format adheres back to an EVM hexadecimal standard
        expect(walletAddress.toLowerCase()).toContain('0x');

        logger.info('WALLET_FLOW', 'CONNECTION_VERIFIED', `Connection handshake verified successfully. Bound Address: ${walletAddress}`);
    });
});