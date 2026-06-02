export type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE';

export type LogCategory = 'SWAP_FLOW' | 'WALLET_FLOW' | 'RPC_QUERY' | 'SECURITY_AUDIT' | 'TEST_EXECUTION' | 'GENERAL';

const LOG_LEVEL_ORDER: Record<LogLevel, number> = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
    TRACE: 4
};

const DEBUG_MODE = process.env.DEBUG_MODE === 'true';

const getCurrentLevel = (): LogLevel => {
    return DEBUG_MODE ? 'TRACE' : 'INFO';
};

const shouldLog = (level: LogLevel): boolean => {
    const currentLevel = getCurrentLevel();
    return LOG_LEVEL_ORDER[level] <= LOG_LEVEL_ORDER[currentLevel];
};

const safeCategory = (cat: string): LogCategory => {
    const validCategories: string[] = ['SWAP_FLOW', 'WALLET_FLOW', 'RPC_QUERY', 'SECURITY_AUDIT', 'TEST_EXECUTION'];
    return validCategories.includes(cat) ? (cat as LogCategory) : 'GENERAL';
};

const formatLog = (category: string, level: LogLevel, step: string, message: string, metadata?: Record<string, unknown>): string => {
    const metadataStr = metadata ? ` | ${JSON.stringify(metadata)}` : '';
    return `[${category}][${level}][${step}] ${message}${metadataStr}`;
};

export const logger = {

    error: (arg1: string, arg2: string, arg3?: string, metadata?: Record<string, unknown>) => {
        if (!shouldLog('ERROR')) return;
        const category = arg3 ? safeCategory(arg1) : 'GENERAL';
        const step = arg3 ? arg2 : arg1;
        const message = arg3 ? arg3 : arg2;
        console.error(formatLog(category, 'ERROR', step, message, metadata));
    },

    warn: (arg1: string, arg2: string, arg3?: string, metadata?: Record<string, unknown>) => {
        if (!shouldLog('WARN')) return;
        const category = arg3 ? safeCategory(arg1) : 'GENERAL';
        const step = arg3 ? arg2 : arg1;
        const message = arg3 ? arg3 : arg2;
        console.warn(formatLog(category, 'WARN', step, message, metadata));
    },

    info: (arg1: string, arg2: string, arg3?: string, metadata?: Record<string, unknown>) => {
        if (!shouldLog('INFO')) return;
        const category = arg3 ? safeCategory(arg1) : 'GENERAL';
        const step = arg3 ? arg2 : arg1;
        const message = arg3 ? arg3 : arg2;
        console.log(formatLog(category, 'INFO', step, message, metadata));
    },

    debug: (arg1: string, arg2: string, arg3?: string, metadata?: Record<string, unknown>) => {
        if (!shouldLog('DEBUG')) return;
        const category = arg3 ? safeCategory(arg1) : 'GENERAL';
        const step = arg3 ? arg2 : arg1;
        const message = arg3 ? arg3 : arg2;
        console.debug(formatLog(category, 'DEBUG', step, message, metadata));
    },

    trace: (arg1: string, arg2: string, arg3?: string, metadata?: Record<string, unknown>) => {
        if (!shouldLog('TRACE')) return;
        const category = arg3 ? safeCategory(arg1) : 'GENERAL';
        const step = arg3 ? arg2 : arg1;
        const message = arg3 ? arg3 : arg2;
        console.trace(formatLog(category, 'TRACE', step, message, metadata));
    }
};

export type Logger = typeof logger;
