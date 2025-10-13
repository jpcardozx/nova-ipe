/**
 * Development Mode Debugging Tools
 * Provides interactive debugging capabilities for development
 */

import { logger } from '@/lib/logger';
import { authDebugger } from '@/lib/auth/auth-debugger';
import { EnvironmentManager } from '@/lib/environment-config';
import { enhancedSanityClient } from '@/lib/sanity/enhanced-client';

export interface DevToolsConfig {
    enabled: boolean;
    autoDebug: boolean;
    verboseLogging: boolean;
    showInConsole: boolean;
}

export class DevTools {
    private static instance: DevTools;
    private config: DevToolsConfig;
    private isDevelopment: boolean;

    private constructor() {
        this.isDevelopment = process.env.NODE_ENV !== 'production';
        this.config = {
            enabled: this.isDevelopment,
            autoDebug: false,
            verboseLogging: this.isDevelopment,
            showInConsole: this.isDevelopment
        };

        if (this.config.enabled) {
            this.initializeDevTools();
        }
    }

    static getInstance(): DevTools {
        if (!DevTools.instance) {
            DevTools.instance = new DevTools();
        }
        return DevTools.instance;
    }

    /**
     * Initialize development tools
     */
    private initializeDevTools(): void {
        if (typeof window !== 'undefined') {
            // Add global debug functions to window object
            (window as any).__authDebug = {
                generateReport: () => this.generateDebugReport(),
                testAuth: () => this.testAuthentication(),
                testSanity: () => this.testSanityConnection(),
                checkConfig: () => this.checkConfiguration(),
                exportLogs: () => this.exportLogs(),
                clearLogs: () => this.clearAllLogs(),
                showStats: () => this.showLogStats(),
                help: () => this.showHelp()
            };

            logger.debug('Development tools initialized', {
                component: 'DevTools',
                action: 'initialize'
            });

            if (this.config.showInConsole) {
                this.showWelcomeMessage();
            }
        }
    }

    /**
     * Show welcome message with available commands
     */
    private showWelcomeMessage(): void {
        console.log(`
🔧 Auth Debug Tools Available
=============================
Use these commands in the browser console:

__authDebug.generateReport() - Generate full debug report
__authDebug.testAuth()       - Test authentication systems
__authDebug.testSanity()     - Test Sanity connection
__authDebug.checkConfig()    - Check environment configuration
__authDebug.exportLogs()     - Export logs for debugging
__authDebug.clearLogs()      - Clear all logs
__authDebug.showStats()      - Show logging statistics
__authDebug.help()           - Show this help message
        `);
    }

    /**
     * Generate comprehensive debug report
     */
    async generateDebugReport(): Promise<void> {
        try {
            logger.debug('Generating comprehensive debug report', {
                component: 'DevTools',
                action: 'generateDebugReport'
            });

            const debugInfo = await authDebugger.generateDebugInfo();
            const tokenInfo = await authDebugger.getTokenDebugInfo();
            const snapshot = debugInfo.snapshot;

            console.group('🔍 Authentication Debug Report');
            console.log('Generated at:', snapshot.timestamp);

            console.group('👤 Authentication Snapshot');
            console.log('Has Active Session:', snapshot.hasSession);
            if (snapshot.userId) {
                console.log('User ID:', snapshot.userId);
            }
            if (snapshot.email) {
                console.log('Email:', snapshot.email);
            }
            if (snapshot.role) {
                console.log('Role:', snapshot.role);
            }
            if (snapshot.sessionExpiry) {
                console.log('Session Expires:', snapshot.sessionExpiry);
            }
            if (snapshot.error) {
                console.error('Error:', snapshot.error);
            }
            console.groupEnd();

            console.group('🎫 Token Information');
            if (tokenInfo.tokenInfo) {
                console.log('Has Token:', tokenInfo.hasToken);
                console.log('Access Token Preview:', tokenInfo.tokenInfo.accessToken);
                console.log('Expires At:', tokenInfo.tokenInfo.expiresAt);
                console.log('User ID:', tokenInfo.tokenInfo.userId);
                console.log('Email:', tokenInfo.tokenInfo.email);
            } else {
                console.warn('No token info available:', tokenInfo.error);
            }
            console.groupEnd();

            console.group('📊 Diagnosis');
            console.log(debugInfo.diagnosis);
            console.groupEnd();

            console.group('📜 Recent Logs');
            console.log(`Total logs: ${debugInfo.logs.length}`);
            debugInfo.logs.slice(-5).forEach((log, index) => {
                console.log(`[${debugInfo.logs.length - 5 + index + 1}]`, log);
            });
            console.groupEnd();

            console.groupEnd();

        } catch (error) {
            logger.error('Failed to generate debug report', {
                component: 'DevTools',
                action: 'generateDebugReport'
            }, error);
            console.error('Failed to generate debug report:', error);
        }
    }
    /**
       * Test authentication systems
       */
    async testAuthentication(): Promise<void> {
        try {
            logger.debug('Testing authentication systems', {
                component: 'DevTools',
                action: 'testAuthentication'
            });

            console.group('🧪 Authentication System Test');

            // Test Sanity authentication
            console.log('Testing Sanity authentication...');
            try {
                const sanityResult = await enhancedSanityClient.testAuthentication();
                console.log('Sanity Test Result:', sanityResult.success ? '✅ Success' : '❌ Failed');
                if (!sanityResult.success) {
                    console.error('Sanity Error:', sanityResult.error);
                }
            } catch (error) {
                console.error('Sanity Test Failed:', error);
            }

            // Test Supabase connection
            console.log('Testing Supabase connection...');
            try {
                const { data, error } = await (await import('@/lib/supabase')).supabase.auth.getSession();
                console.log('Supabase Test Result:', error ? '❌ Failed' : '✅ Success');
                if (error) {
                    console.error('Supabase Error:', error.message);
                } else {
                    console.log('Session Status:', data.session ? 'Active' : 'No session');
                }
            } catch (error) {
                console.error('Supabase Test Failed:', error);
            }

            console.groupEnd();

        } catch (error) {
            logger.error('Failed to test authentication', {
                component: 'DevTools',
                action: 'testAuthentication'
            }, error);
            console.error('Authentication test failed:', error);
        }
    }

    /**
     * Test Sanity connection specifically
     */
    async testSanityConnection(): Promise<void> {
        try {
            logger.debug('Testing Sanity connection', {
                component: 'DevTools',
                action: 'testSanityConnection'
            });

            console.group('🎨 Sanity Connection Test');

            const config = EnvironmentManager.getConfig();
            console.log('Configuration:', {
                projectId: config.sanity.projectId,
                dataset: config.sanity.dataset,
                hasToken: !!config.sanity.token,
                configured: config.sanity.configured
            });

            if (!config.sanity.configured) {
                console.warn('Sanity not properly configured');
                console.groupEnd();
                return;
            }

            // Test basic connection
            console.log('Testing basic connection...');
            const testResult = await enhancedSanityClient.testAuthentication();
            console.log('Connection Result:', testResult.success ? '✅ Success' : '❌ Failed');

            if (!testResult.success) {
                console.error('Connection Error:', testResult.error);
            }

            // Test a simple query
            console.log('Testing simple query...');
            try {
                const result = await enhancedSanityClient.fetch('*[_type == "property"][0..2]{_id, title}');
                console.log('Query Result:', result ? '✅ Success' : '⚠️ No data');
                console.log('Sample Data:', result);
            } catch (error) {
                console.error('Query Failed:', error);
            }

            console.groupEnd();

        } catch (error) {
            logger.error('Failed to test Sanity connection', {
                component: 'DevTools',
                action: 'testSanityConnection'
            }, error);
            console.error('Sanity connection test failed:', error);
        }
    }

    /**
     * Check environment configuration
     */
    checkConfiguration(): void {
        try {
            logger.debug('Checking environment configuration', {
                component: 'DevTools',
                action: 'checkConfiguration'
            });

            console.group('⚙️ Environment Configuration Check');

            const config = EnvironmentManager.getConfig();

            console.group('🎨 Sanity Configuration');
            console.log('Project ID:', config.sanity.projectId || '❌ Missing');
            console.log('Dataset:', config.sanity.dataset || '❌ Missing');
            console.log('API Version:', config.sanity.apiVersion);
            console.log('Has Token:', config.sanity.token ? '✅ Present' : '❌ Missing');
            console.log('Configured:', config.sanity.configured ? '✅ Yes' : '❌ No');
            console.groupEnd();

            console.group('🔐 Supabase Configuration');
            console.log('URL:', config.supabase.url ? '✅ Present' : '❌ Missing');
            console.log('Anon Key:', config.supabase.anonKey ? '✅ Present' : '❌ Missing');
            console.log('Configured:', config.supabase.configured ? '✅ Yes' : '❌ No');
            console.groupEnd();

            // Check for missing environment variables
            const missingVars: string[] = [];
            if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) missingVars.push('NEXT_PUBLIC_SANITY_PROJECT_ID');
            if (!process.env.NEXT_PUBLIC_SANITY_DATASET) missingVars.push('NEXT_PUBLIC_SANITY_DATASET');
            if (!process.env.SANITY_API_TOKEN) missingVars.push('SANITY_API_TOKEN');
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
            if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');

            if (missingVars.length > 0) {
                console.group('❌ Missing Environment Variables');
                missingVars.forEach(varName => console.error(`Missing: ${varName}`));
                console.groupEnd();
            } else {
                console.log('✅ All required environment variables present');
            }

            console.groupEnd();

        } catch (error) {
            logger.error('Failed to check configuration', {
                component: 'DevTools',
                action: 'checkConfiguration'
            }, error);
            console.error('Configuration check failed:', error);
        }
    }

    /**
     * Export logs for debugging
     */
    exportLogs(): string {
        try {
            logger.debug('Exporting logs for debugging', {
                component: 'DevTools',
                action: 'exportLogs'
            });

            const exportData = authDebugger.exportDebugInfo();

            console.group('📋 Log Export');
            console.log('Export generated at:', new Date().toISOString());
            console.log('Data size:', exportData.length, 'characters');
            console.log('Copy the following data for debugging:');
            console.log(exportData);
            console.groupEnd();

            return exportData;

        } catch (error) {
            logger.error('Failed to export logs', {
                component: 'DevTools',
                action: 'exportLogs'
            }, error);
            console.error('Log export failed:', error);
            return '';
        }
    }

    /**
     * Clear all logs
     */
    clearAllLogs(): void {
        try {
            logger.clearLogs();
            authDebugger.clearHistory();

            console.log('🧹 All logs cleared');

            logger.debug('All logs cleared via dev tools', {
                component: 'DevTools',
                action: 'clearAllLogs'
            });

        } catch (error) {
            console.error('Failed to clear logs:', error);
        }
    }

    /**
     * Show logging statistics
     */
    showLogStats(): void {
        try {
            const stats = logger.getLogStats();

            console.group('📊 Logging Statistics');
            console.log('Total Logs:', stats.total);
            console.log('Recent (1 hour):', stats.recent);
            console.log('By Level:', stats.byLevel);

            console.group('Recent Error Logs');
            const errorLogs = logger.getErrorLogs(5);
            errorLogs.forEach((log, index) => {
                console.error(`${index + 1}.`, log.message, log.context);
            });
            console.groupEnd();

            console.groupEnd();

        } catch (error) {
            console.error('Failed to show log stats:', error);
        }
    }

    /**
     * Show help message
     */
    showHelp(): void {
        this.showWelcomeMessage();
    }

    /**
     * Enable/disable development tools
     */
    setEnabled(enabled: boolean): void {
        this.config.enabled = enabled && this.isDevelopment;

        if (this.config.enabled) {
            this.initializeDevTools();
        } else if (typeof window !== 'undefined') {
            delete (window as any).__authDebug;
        }

        logger.debug(`Development tools ${enabled ? 'enabled' : 'disabled'}`, {
            component: 'DevTools',
            action: 'setEnabled'
        });
    }

    /**
     * Get current configuration
     */
    getConfig(): DevToolsConfig {
        return { ...this.config };
    }

    /**
     * Update configuration
     */
    updateConfig(updates: Partial<DevToolsConfig>): void {
        this.config = { ...this.config, ...updates };

        logger.debug('Development tools configuration updated', {
            component: 'DevTools',
            action: 'updateConfig'
        }, updates);
    }
}

// Export singleton instance
export const devTools = DevTools.getInstance();