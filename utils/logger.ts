export type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE';

export type LogCategory = 'SWAP_FLOW' | 'WALLET_FLOW' | 'RPC_QUERY' | 'SECURITY_AUDIT' | 'TEST_EXECUTION';

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

const formatLog = (category: LogCategory, level: LogLevel, step: string, message: string, metadata?: Record<string, unknown>): string => {
    const metadataStr = metadata ? ` | ${JSON.stringify(metadata)}` : '';
    return `[${category}][${level}][${step}] ${message}${metadataStr}`;
};

export const logger = {
    error: (category: LogCategory, step: string, message: string, metadata?: Record<string, unknown>) => {
        if (shouldLog('ERROR')) {
            console.error(formatLog(category, 'ERROR', step, message, metadata));
        }
    },

    warn: (category: LogCategory, step: string, message: string, metadata?: Record<string, unknown>) => {
        if (shouldLog('WARN')) {
            console.warn(formatLog(category, 'WARN', step, message, metadata));
        }
    },

    info: (category: LogCategory, step: string, message: string, metadata?: Record<string, unknown>) => {
        if (shouldLog('INFO')) {
            console.log(formatLog(category, 'INFO', step, message, metadata));
        }
    },

    debug: (category: LogCategory, step: string, message: string, metadata?: Record<string, unknown>) => {
        if (shouldLog('DEBUG')) {
            console.debug(formatLog(category, 'DEBUG', step, message, metadata));
        }
    },

    trace: (category: LogCategory, step: string, message: string, metadata?: Record<string, unknown>) => {
        if (shouldLog('TRACE')) {
            console.trace(formatLog(category, 'TRACE', step, message, metadata));
        }
    }
};

export type Logger = typeof logger;