/**
 * Enhanced logging system for authentication and debugging
 * Provides structured logging with context and error tracking
 */

export interface LogContext {
    component?: string;
    action?: string;
    userId?: string;
    sessionId?: string;
    requestId?: string;
    metadata?: Record<string, any>;
}

export interface AuthLogEntry {
    timestamp: Date;
    level: 'debug' | 'info' | 'warn' | 'error';
    message: string;
    context?: LogContext;
    error?: any;
    stack?: string;
}

export class EnhancedLogger {
    private static instance: EnhancedLogger;
    private logHistory: AuthLogEntry[] = [];
    private maxLogSize = 500;
    private isDevelopment = process.env.NODE_ENV !== 'production';

    private constructor() { }

    // Performance-optimized logging methods
    static perfStart(label: string): number {
        if (process.env.NODE_ENV === 'development') {
            return performance.now()
        }
        return 0
    }

    static perfEnd(label: string, startTime: number): void {
        if (process.env.NODE_ENV === 'development' && startTime > 0) {
            const duration = performance.now() - startTime
            console.log(`⏱️ [PERF] ${label}: ${Math.round(duration)}ms`)
        }
    }

    // Optimized console methods that are stripped in production
    static devLog(message: string, ...args: any[]): void {
        if (process.env.NODE_ENV === 'development') {
            console.log(message, ...args)
        }
    }

    static devWarn(message: string, ...args: any[]): void {
        if (process.env.NODE_ENV === 'development') {
            console.warn(message, ...args)
        }
    }

    static getInstance(): EnhancedLogger {
        if (!EnhancedLogger.instance) {
            EnhancedLogger.instance = new EnhancedLogger();
        }
        return EnhancedLogger.instance;
    }

    /**
     * Log authentication-related events with detailed context
     */
    auth(message: string, context?: LogContext, error?: any): void {
        this.log('info', `[AUTH] ${message}`, context, error);
    }

    /**
     * Log authentication errors with full context
     */
    authError(message: string, context?: LogContext, error?: any): void {
        this.log('error', `[AUTH ERROR] ${message}`, context, error);
    }

    /**
     * Log Sanity configuration and connection issues
     */
    sanity(message: string, context?: LogContext, error?: any): void {
        this.log('info', `[SANITY] ${message}`, context, error);
    }

    /**
     * Log Sanity errors with detailed debugging information
     */
    sanityError(message: string, context?: LogContext, error?: any): void {
        this.log('error', `[SANITY ERROR] ${message}`, context, error);
    }

    /**
     * Log environment configuration issues
     */
    config(message: string, context?: LogContext, error?: any): void {
        this.log('info', `[CONFIG] ${message}`, context, error);
    }

    /**
     * Log configuration errors
     */
    configError(message: string, context?: LogContext, error?: any): void {
        this.log('error', `[CONFIG ERROR] ${message}`, context, error);
    }

    /**
     * Debug logging for development mode
     */
    debug(message: string, context?: LogContext, data?: any): void {
        if (this.isDevelopment) {
            this.log('debug', `[DEBUG] ${message}`, context, data);
        }
    }

    /**
     * General info logging
     */
    info(message: string, context?: LogContext): void {
        this.log('info', message, context);
    }

    /**
     * Warning logging
     */
    warn(message: string, context?: LogContext, error?: any): void {
        this.log('warn', message, context, error);
    }

    /**
     * Error logging
     */
    error(message: string, context?: LogContext, error?: any): void {
        this.log('error', message, context, error);
    }

    /**
     * Core logging method with structured output
     */
    private log(level: 'debug' | 'info' | 'warn' | 'error', message: string, context?: LogContext, error?: any): void {
        const timestamp = new Date();
        const logEntry: AuthLogEntry = {
            timestamp,
            level,
            message,
            context,
            error: error ? this.serializeError(error) : undefined,
            stack: error?.stack
        };

        // Add to history
        this.addToHistory(logEntry);

        // Console output with formatting
        this.outputToConsole(logEntry);
    }

    /**
     * Add log entry to history with rotation
     */
    private addToHistory(entry: AuthLogEntry): void {
        this.logHistory.push(entry);

        // Rotate logs to prevent memory leaks
        if (this.logHistory.length > this.maxLogSize) {
            this.logHistory = this.logHistory.slice(-this.maxLogSize);
        }
    }

    /**
     * Output formatted log to console
     */
    private outputToConsole(entry: AuthLogEntry): void {
        const timestamp = entry.timestamp.toISOString();
        const contextStr = entry.context ? ` | ${JSON.stringify(entry.context)}` : '';
        const fullMessage = `${timestamp} | ${entry.message}${contextStr}`;

        switch (entry.level) {
            case 'debug':
                if (this.isDevelopment) {
                    console.debug('🔍', fullMessage, entry.error || '');
                }
                break;
            case 'info':
                console.info('ℹ️', fullMessage);
                break;
            case 'warn':
                console.warn('⚠️', fullMessage, entry.error || '');
                break;
            case 'error':
                console.error('❌', fullMessage, entry.error || '');
                if (entry.stack && this.isDevelopment) {
                    console.error('Stack trace:', entry.stack);
                }
                break;
        }
    }

    /**
     * Serialize error objects for logging
     */
    private serializeError(error: any): any {
        if (error instanceof Error) {
            return {
                errorName: error.name,
                errorMessage: error.message,
                stack: error.stack
            };
        }
        return error;
    }

    /**
     * Get recent log entries for debugging
     */
    getRecentLogs(limit: number = 50, level?: 'debug' | 'info' | 'warn' | 'error'): AuthLogEntry[] {
        let logs = this.logHistory;

        if (level) {
            logs = logs.filter(entry => entry.level === level);
        }

        return logs.slice(-limit);
    }

    /**
     * Get authentication-related logs
     */
    getAuthLogs(limit: number = 20): AuthLogEntry[] {
        return this.logHistory
            .filter(entry => entry.message.includes('[AUTH'))
            .slice(-limit);
    }

    /**
     * Get Sanity-related logs
     */
    getSanityLogs(limit: number = 20): AuthLogEntry[] {
        return this.logHistory
            .filter(entry => entry.message.includes('[SANITY'))
            .slice(-limit);
    }

    /**
     * Get configuration-related logs
     */
    getConfigLogs(limit: number = 20): AuthLogEntry[] {
        return this.logHistory
            .filter(entry => entry.message.includes('[CONFIG'))
            .slice(-limit);
    }

    /**
     * Get error logs only
     */
    getErrorLogs(limit: number = 20): AuthLogEntry[] {
        return this.logHistory
            .filter(entry => entry.level === 'error')
            .slice(-limit);
    }

    /**
     * Clear log history
     */
    clearLogs(): void {
        this.logHistory = [];
    }

    /**
     * Get log statistics
     */
    getLogStats(): { total: number; byLevel: Record<string, number>; recent: number } {
        const byLevel: Record<string, number> = {};
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        let recent = 0;

        this.logHistory.forEach(entry => {
            byLevel[entry.level] = (byLevel[entry.level] || 0) + 1;
            if (entry.timestamp > oneHourAgo) {
                recent++;
            }
        });

        return {
            total: this.logHistory.length,
            byLevel,
            recent
        };
    }

    /**
     * Export logs for debugging (development only)
     */
    exportLogs(): string {
        if (!this.isDevelopment) {
            return 'Log export only available in development mode';
        }

        return JSON.stringify(this.logHistory, null, 2);
    }
}

// Export enhanced logger instance
export const logger = EnhancedLogger.getInstance();

// Legacy compatibility exports
export const legacyLogger = {
    log: (...args: any[]) => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(...args);
        }
    },
    warn: (...args: any[]) => {
        console.warn(...args);
    },
    error: (...args: any[]) => {
        console.error(...args);
    },
    debug: (...args: any[]) => {
        if (process.env.NODE_ENV !== 'production') {
            console.debug(...args);
        }
    },
    info: (...args: any[]) => {
        if (process.env.NODE_ENV !== 'production') {
            console.info(...args);
        }
    },
};
