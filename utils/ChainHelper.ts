/**
 * ChainHelper - On-Chain Cryptographic Auditing & JSON-RPC Telemetry Utilities
 * @module ChainHelper
 * @description Supplies low-level stateless JSON-RPC wrappers interacting directly with remote execution nodes.
 * Provides immutable balance verification arrays and automated block ingestion receipt polling triggers,
 * safeguarding upstream forensic specs against JavaScript float precision rounding degradations.
 */

import { CONFIG } from '../config/config';

/**
 * Extracts the high-precision active native token balance for a targeted cryptographic address.
 * * Precision Guarantees:
 * - Returns an absolute BigInt primitive denominated strictly in Wei equivalent units.
 * - Anti-rounding Guardrails: Prevents internal driver truncation bugs caused by JavaScript's standard IEEE 754 
 * floating-point limits (Number primitives lose fidelity above MAX_SAFE_INTEGER: ~9x10^15, whereas standard EVM 
 * account state mappings reach 10^18 scalar domains).
 * * @param {string} address - Hexadecimal Ethereum public address hash string.
 * @returns {Promise<bigint>} Quantitative account value map represented inside BigInt structures.
 */
export async function getBalanceViaRPC(address: string): Promise<bigint> {
    console.log(`💰 [RPC-Query] Extracting precision active balance ledger for address target: ${address}...`);

    const payload = {
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [address, 'latest'],
        id: 1
    };

    const response = await fetch(CONFIG.RPC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    // Coerce raw node results securely inside native BigInt to eliminate floating point truncation
    return BigInt(data.result);
}

/**
 * Enhanced Transaction Receipt Telemetry & Out-of-Band Audit Engine.
 * * 🛡️ Defensive Orchestration Framework:
 * 1. Adaptive Polling Matrix: Handles block ingestion latency variations via customizable retry thread sleeps.
 * 2. Status Invariance Verification: Evaluates state codes explicitly against machine bytes ('0x1' = Success).
 * 3. Forensic Gas Billings Account: Multiplies underlying limits down via absolute BigInt math models.
 * * @param {string} txHash - The unique 66-character transactional identification cryptographic ledger signature.
 * @param {number} [maxRetries=15] - Maximum retry intervals allowed before declaring pipeline failures.
 * @param {number} [delayMs=3000] - Thread sleep boundaries (milliseconds) set between consecutive post requests.
 * @returns {Promise<{ isSuccess: boolean, blockNum: number, receipt: any, totalGasFee: bigint }>} Comprehensive audit metadata statement.
 */
export async function verifyTxStatusViaRPC(txHash: string, maxRetries = 15, delayMs = 3000) {
    console.log(`📡 [RPC-Audit] Deploying block receipt extraction query for target hash signature: ${txHash}`);

    const payload = {
        jsonrpc: '2.0',
        method: 'eth_getTransactionReceipt',
        params: [txHash],
        id: 1
    };

    for (let i = 0; i < maxRetries; i++) {
        const response = await fetch(CONFIG.RPC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        const receipt = data.result;

        // Target payload has not yet materialized inside a finalized block frame
        if (!receipt) {
            console.log(`⏳ [RPC-Audit] [Loop index: ${i + 1}/${maxRetries}] Target transaction hash still unmined in mempool. Sleeping for ${delayMs / 1000}s...`);
            await new Promise(res => setTimeout(res, delayMs));
            continue;
        }

        // Deconstruct raw execution bytes into standard evaluation boundaries
        const isSuccess = receipt.status === '0x1';
        const blockNum = parseInt(receipt.blockNumber, 16);

        // 💡 Core Analytical Rationale: Extract total gas billings strictly via zero-loss BigInt models.
        // Formula Projections: Invoice Bill Total = Execution Gas Expended * Effective Gas Premium Profile
        const gasUsed = BigInt(receipt.gasUsed);
        const gasPrice = BigInt(receipt.effectiveGasPrice);
        const totalGasFee = gasUsed * gasPrice;

        console.log(`🏛️ [RPC-Audit] Forensic Invariance Settle Status: ${isSuccess ? '✅ Success' : '❌ Failed'}`);
        console.log(`⛽ [RPC-Audit] Extracted Live Gas Expenditure Delta: ${totalGasFee.toString()} Wei`);

        return {
            isSuccess,
            blockNum,
            receipt,
            totalGasFee
        };
    }

    throw new Error(`❌ [RPC-Audit] Direct JSON-RPC polling query bounds exhausted without re-acquiring logs: ${txHash}`);
}