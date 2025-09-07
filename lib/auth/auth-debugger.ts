/**
 * Authentication Debugging System
 * Provides comprehensive debugging tools for authentication issues
 */

import { logger } from '@/lib/logger';
import { EnvironmentManager } from '@/lib/environment-config';
import { sanityClient } from '@/lib/sanity/index';
import { enhancedSanityClient } from '@/lib/sanity/enhanced-client';
import { supabase } from '@/lib/supabase';

export interface AuthDebugInfo {
    timestamp: Date;
    environment: {
        sanityConfigured: boolean;
        supabaseConfigured: boolean;
        missingVars: string[];
        nodeEnv: string;
    };
    sanity: {
        projectId?: string;
        dataset?: string;
        hasToken: boolean;
        connectionStatus: 'connected' | 'error' | 'untested';
        lastError?: string;
    };
    supabase: {
        hasUrl: boolean;
        hasAnonKey: boolean;
        connectionStatus: 'connected' | 'error' | 'untested';
        lastError?: string;
    };
    authentication: {
        hasActiveSession: boolean;
        sessionType?: 'dashboard' | 'studio' | 'none';
        userId?: string;
        lastAuthAttempt?: Date;
        lastAuthError?: string;
    };
}

export interface TokenDebugInfo {
    sanityToken: {
        present: boolean;
        length?: number;
        format?: 'valid' | 'invalid' | 'unknown';
        lastValidated?: Date;
        validationError?: string;
    };
    supabaseSession: {
        present: boolean;
        expiresAt?: Date;
        isExpired?: boolean;
        userId?: string;
        lastRefresh?: Date;
    };
}

export class AuthDebugger {
    private static instance: AuthDebugger;
    private debugHistory: AuthDebugInfo[] = [];
    private maxHistorySize = 50;

    private constructor() { }

    static getInstance(): AuthDebugger {
        if (!AuthDebugger.instance) {
            AuthDebugger.instance = new AuthDebugger();
        }
        return AuthDebugger.instance;
    }
    /**
      * Generate comprehensive debug information
      */
    async generateDebugInfo(): Promise<AuthDebugInfo> {
        logger.debug('Generating authentication debug information');

        const debugInfo: AuthDebugInfo = {
            timestamp: new Date(),
            environment: await this.getEnvironmentDebugInfo(),
            sanity: await this.getSanityDebugInfo(),
            supabase: await this.getSupabaseDebugInfo(),
            authentication: await this.getAuthenticationDebugInfo()
        };

        // Add to history
        this.addToHistory(debugInfo);

        // Log summary
        this.logDebugSummary(debugInfo);

        return debugInfo;
    }

    /**
     * Get environment configuration debug info
     */
    private async getEnvironmentDebugInfo(): Promise<AuthDebugInfo['environment']> {
        try {
            const config = EnvironmentManager.getConfig();
            const missingVars: string[] = [];

            // Check required Sanity variables
            if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) missingVars.push('NEXT_PUBLIC_SANITY_PROJECT_ID');
            if (!process.env.NEXT_PUBLIC_SANITY_DATASET) missingVars.push('NEXT_PUBLIC_SANITY_DATASET');
            if (!process.env.SANITY_API_TOKEN) missingVars.push('SANITY_API_TOKEN');

            // Check required Supabase variables
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
            if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');

            return {
                sanityConfigured: config.sanity.configured,
                supabaseConfigured: config.supabase.configured,
                missingVars,
                nodeEnv: process.env.NODE_ENV || 'unknown'
            };
        } catch (error) {
            logger.configError('Failed to get environment debug info', {}, error);
            return {
                sanityConfigured: false,
                supabaseConfigured: false,
                missingVars: ['Error checking environment'],
                nodeEnv: process.env.NODE_ENV || 'unknown'
            };
        }
    }

    /**
     * Get Sanity debug information
     */
    private async getSanityDebugInfo(): Promise<AuthDebugInfo['sanity']> {
        try {
            const config = EnvironmentManager.getConfig();

            const debugInfo: AuthDebugInfo['sanity'] = {
                projectId: config.sanity.projectId,
                dataset: config.sanity.dataset,
                hasToken: !!config.sanity.token,
                connectionStatus: 'untested'
            };

            // Test connection if configured
            if (config.sanity.configured) {
                try {
                    const testResult = await enhancedSanityClient.testAuthentication();
                    debugInfo.connectionStatus = testResult.success ? 'connected' : 'error';
                    if (!testResult.success) {
                        debugInfo.lastError = testResult.error instanceof Error ? testResult.error.message : String(testResult.error);
                    }
                } catch (error) {
                    debugInfo.connectionStatus = 'error';
                    debugInfo.lastError = error instanceof Error ? error.message : String(error);
                }
            }

            return debugInfo;
        } catch (error) {
            logger.sanityError('Failed to get Sanity debug info', {}, error);
            return {
                hasToken: false,
                connectionStatus: 'error',
                lastError: error instanceof Error ? error.message : String(error)
            };
        }
    }
    /**
         * Get Supabase debug information
         */
    private async getSupabaseDebugInfo(): Promise<AuthDebugInfo['supabase']> {
        try {
            const config = EnvironmentManager.getConfig();

            const debugInfo: AuthDebugInfo['supabase'] = {
                hasUrl: !!config.supabase.url,
                hasAnonKey: !!config.supabase.anonKey,
                connectionStatus: 'untested'
            };

            // Test connection if configured
            if (config.supabase.configured) {
                try {
                    const { data, error } = await supabase.auth.getSession();
                    debugInfo.connectionStatus = error ? 'error' : 'connected';
                    if (error) {
                        debugInfo.lastError = error.message;
                    }
                } catch (error) {
                    debugInfo.connectionStatus = 'error';
                    debugInfo.lastError = error instanceof Error ? error.message : String(error);
                }
            }

            return debugInfo;
        } catch (error) {
            logger.authError('Failed to get Supabase debug info', {}, error);
            return {
                hasUrl: false,
                hasAnonKey: false,
                connectionStatus: 'error',
                lastError: error instanceof Error ? error.message : String(error)
            };
        }
    }

    /**
     * Get authentication status debug information
     */
    private async getAuthenticationDebugInfo(): Promise<AuthDebugInfo['authentication']> {
        try {
            const debugInfo: AuthDebugInfo['authentication'] = {
                hasActiveSession: false,
                sessionType: 'none'
            };

            // Check Supabase session
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (session?.user && !error) {
                    debugInfo.hasActiveSession = true;
                    debugInfo.sessionType = 'dashboard';
                    debugInfo.userId = session.user.id;
                }
            } catch (error) {
                debugInfo.lastAuthError = error instanceof Error ? error.message : String(error);
            }

            return debugInfo;
        } catch (error) {
            logger.authError('Failed to get authentication debug info', {}, error);
            return {
                hasActiveSession: false,
                sessionType: 'none',
                lastAuthError: error instanceof Error ? error.message : String(error)
            };
        }
    }

    /**
     * Get detailed token debug information
     */
    async getTokenDebugInfo(): Promise<TokenDebugInfo> {
        logger.debug('Getting token debug information');

        const tokenInfo: TokenDebugInfo = {
            sanityToken: await this.getSanityTokenInfo(),
            supabaseSession: await this.getSupabaseSessionInfo()
        };

        return tokenInfo;
    }

    /**
     * Get Sanity token debug information
     */
    private async getSanityTokenInfo(): Promise<TokenDebugInfo['sanityToken']> {
        try {
            const token = process.env.SANITY_API_TOKEN;

            const tokenInfo: TokenDebugInfo['sanityToken'] = {
                present: !!token,
                length: token?.length,
                format: 'unknown'
            };

            if (token) {
                // Basic token format validation
                if (token.startsWith('sk') && token.length > 20) {
                    tokenInfo.format = 'valid';
                } else {
                    tokenInfo.format = 'invalid';
                }

                // Test token by attempting authentication
                try {
                    const testResult = await enhancedSanityClient.testAuthentication();
                    tokenInfo.lastValidated = new Date();
                    if (!testResult.success) {
                        tokenInfo.validationError = testResult.error instanceof Error ? testResult.error.message : String(testResult.error);
                        tokenInfo.format = 'invalid';
                    }
                } catch (error) {
                    tokenInfo.validationError = error instanceof Error ? error.message : String(error);
                    tokenInfo.format = 'invalid';
                }
            }

            return tokenInfo;
        } catch (error) {
            return {
                present: false,
                format: 'invalid',
                validationError: error instanceof Error ? error.message : String(error)
            };
        }
    }    /*
*
     * Get Supabase session debug information
     */
    private async getSupabaseSessionInfo(): Promise<TokenDebugInfo['supabaseSession']> {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();

            const sessionInfo: TokenDebugInfo['supabaseSession'] = {
                present: !!session
            };

            if (session) {
                sessionInfo.expiresAt = new Date(session.expires_at! * 1000);
                sessionInfo.isExpired = sessionInfo.expiresAt < new Date();
                sessionInfo.userId = session.user.id;
                sessionInfo.lastRefresh = session.refresh_token ? new Date() : undefined;
            }

            return sessionInfo;
        } catch (error) {
            return {
                present: false
            };
        }
    }

    /**
     * Add debug info to history
     */
    private addToHistory(debugInfo: AuthDebugInfo): void {
        this.debugHistory.push(debugInfo);

        // Rotate history to prevent memory leaks
        if (this.debugHistory.length > this.maxHistorySize) {
            this.debugHistory = this.debugHistory.slice(-this.maxHistorySize);
        }
    }

    /**
     * Log debug summary
     */
    private logDebugSummary(debugInfo: AuthDebugInfo): void {
        const summary = {
            timestamp: debugInfo.timestamp.toISOString(),
            sanityConfigured: debugInfo.environment.sanityConfigured,
            supabaseConfigured: debugInfo.environment.supabaseConfigured,
            missingVars: debugInfo.environment.missingVars,
            sanityConnection: debugInfo.sanity.connectionStatus,
            supabaseConnection: debugInfo.supabase.connectionStatus,
            hasActiveSession: debugInfo.authentication.hasActiveSession,
            sessionType: debugInfo.authentication.sessionType
        };

        if (debugInfo.environment.missingVars.length > 0) {
            logger.configError('Missing environment variables detected', {
                component: 'AuthDebugger',
                action: 'generateDebugInfo'
            }, { missingVars: debugInfo.environment.missingVars });
        }

        if (debugInfo.sanity.connectionStatus === 'error') {
            logger.sanityError('Sanity connection error detected', {
                component: 'AuthDebugger',
                action: 'testSanityConnection'
            }, { error: debugInfo.sanity.lastError });
        }

        if (debugInfo.supabase.connectionStatus === 'error') {
            logger.authError('Supabase connection error detected', {
                component: 'AuthDebugger',
                action: 'testSupabaseConnection'
            }, { error: debugInfo.supabase.lastError });
        }

        logger.debug('Authentication debug summary generated', {
            component: 'AuthDebugger',
            action: 'generateDebugInfo'
        }, summary);
    }

    /**
     * Get recent debug history
     */
    getDebugHistory(limit: number = 10): AuthDebugInfo[] {
        return this.debugHistory.slice(-limit);
    }

    /**
     * Clear debug history
     */
    clearHistory(): void {
        this.debugHistory = [];
        logger.debug('Debug history cleared', {
            component: 'AuthDebugger',
            action: 'clearHistory'
        });
    }

    /**
     * Export debug information for support
     */
    exportDebugInfo(): string {
        const exportData = {
            timestamp: new Date().toISOString(),
            recentLogs: logger.getRecentLogs(20),
            authLogs: logger.getAuthLogs(10),
            sanityLogs: logger.getSanityLogs(10),
            configLogs: logger.getConfigLogs(10),
            debugHistory: this.debugHistory.slice(-5)
        };

        return JSON.stringify(exportData, null, 2);
    }
}

// Export singleton instance
export const authDebugger = AuthDebugger.getInstance();