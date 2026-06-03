/**
 * Global Configuration Matrix for Web3 Automation Framework
 * @module CONFIG
 * @description Centralized environment variables, RPC endpoints, MetaMask file paths, 
 * timeout thresholds, and cryptographic parameters required for end-to-end DApp auditing.
 */

export const CONFIG = {
    // Global Target Web3 Decentralized Application URL
    BASE_URL: 'https://app.uniswap.org',

    // Runtime mode: true = Headless (CI pipelines), false = Headed (local debugging/visualization)
    HEADLESS: false,

    // Hierarchical timeout orchestrations (measured in milliseconds)
    TIMEOUT: {
        SHORT: 5000,
        MEDIUM: 15000,
        LONG: 30000
    },

    // Mock payload matrix for Swap transactions (Denominated in ETH / Wei equivalent units)
    SWAP_DATA: {
        SELL_AMOUNT: '0.005',
        TARGET_TOKEN: 'WETH',
        WETH_ADDRESS: '0xfFf9976782d7762f4065527b074160e980c03402',
        CUSTOM_AMOUNT: '0.01',      // Base custom payload test value
        LARGE_AMOUNT: '10000'       // Simulated whale balance payload to intentionally trigger Insufficient Funds failure
    },

    // Read/Write Gateway RPC Endpoint - Sepolia Ethereum Test Network infrastructure
    RPC_URL: 'https://sepolia.infura.io/v3/673e1062102c418ba371176049efe79e',

    // Browser Extensions sandboxing directories and local storage states retention profiles
    METAMASK: {
        EXTENSION_ID: 'efbbmcklppldjgpikphbmnnfgjdinich',
        EXTENSION_PATH: process.env.METAMASK_PATH || path.resolve(__dirname, '../extension/metamask').
        USER_DATA_PATH: process。env.USER_DATA_PATH || path.resolve(__dirname, '../user_data')
    },

    // Custom Gas manipulation limits (Denominated in Gwei) mapped out for mempool boundary audits
    GAS: {
        LOW_BASE_FEE: '00.000000000000000002',    // Extremely low fee matrix engineered to stall tx in mempool (Pending states)
        LOW_PRIORITY_FEE: '0.000000000000000001', // Underpriced miner tip to force deliberate mining delay
        NORMAL_BASE_FEE: '0',
        NORMAL_PRIORITY_FEE: '0.00001',           // Standard network priority gas ceiling configuration
        ZERO_PRIORITY_FEE: '0'
    },

    // State validation and block extraction consensus loop boundaries
    AUDIT: {
        MAX_RETRIES: 12,           // Upper bound constraints for querying transaction status via RPC provider
        RETRY_INTERVAL: 5000,      // Thread sleeps threshold (milliseconds) between consecutive JSON-RPC requests
        EXPLORER_TIMEOUT: 15000    // Execution timeout barrier for parsing external Etherscan DOM nodes
    },

    // Synthetic test edge-case payloads Matrix
    TEST_DATA: {
        UNAPPROVED_TOKEN: 'USDC',    // Native non-wrapped token deployed to audit standard ERC-20 'Approve' permission flow
        VIOLENT_CLICK_COUNT: 5       // Quantitative batch stress threshold applied to evaluate UI debounce systems
    }
};
