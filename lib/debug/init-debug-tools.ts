/**
 * Initialize Debug Tools
 * Sets up comprehensive debugging and logging for authentication systems
 */

import { logger } from '@/lib/logger';
import { authDebugger } from '@/lib/auth/auth-debugger';
import { devTools } from '@/lib/debug/dev-tools';
import { configDebugger } from '@/lib/debug/config-debugger';

export interface DebugInitOptions {
    enableDevTools?: boolean;
    enableAutoDebug?: boolean;
    enableVerboseLogging?: boolean;
    validateConfigOnInit?: boolean;
}

/**
 * Initialize all debugging tools and perform initial system checks
 */
export async function initializeDebugTools(options: DebugInitOptions = {}): Promise<void> {
    const {
        enableDevTools = process.env.NODE_ENV !== 'production',
        enableAutoDebug = false,
        enableVerboseLogging = process.env.NODE_ENV !== 'production',
        validateConfigOnInit = true
    } = options;

    logger.debug('Initializing debug tools', {
        component: 'DebugInitializer',
        action: 'initialize'
    }, options);

    try {
        // Initialize development tools if enabled
        if (enableDevTools) {
            devTools.updateConfig({
                enabled: true,
                autoDebug: enableAutoDebug,
                verboseLogging: enableVerboseLogging,
                showInConsole: enableVerboseLogging
            });

            logger.debug('Development tools initialized', {
                component: 'DebugInitializer',
                action: 'initDevTools'
            });
        }

        // Validate configuration if requested
        if (validateConfigOnInit) {
            const validationResult = configDebugger.validateConfiguration();

            if (!validationResult.isValid) {
                logger.configError('Configuration validation failed during initialization', {
                    component: 'DebugInitializer',
                    action: 'validateConfig'
                }, {
                    errors: validationResult.errors,
                    missingRequired: validationResult.missingRequired
                });

                // Log specific configuration issues
                if (validationResult.missingRequired.length > 0) {
                    logger.configError('Missing required environment variables', {
                        component: 'DebugInitializer',
                        action: 'checkRequiredVars'
                    }, { missingVars: validationResult.missingRequired });
                }
            } else {
                logger.config('Configuration validation passed', {
                    component: 'DebugInitializer',
                    action: 'validateConfig'
                });
            }
        }

        // Generate initial debug report if auto-debug is enabled
        if (enableAutoDebug) {
            await authDebugger.generateDebugInfo();
            logger.debug('Initial debug report generated', {
                component: 'DebugInitializer',
                action: 'generateInitialReport'
            });
        }

        // Set up error handlers for unhandled errors
        if (typeof window !== 'undefined') {
            setupClientErrorHandlers();
        } else {
            setupServerErrorHandlers();
        }

        logger.info('Debug tools initialization completed', {
            component: 'DebugInitializer',
            action: 'initialize'
        });

    } catch (error) {
        logger.error('Failed to initialize debug tools', {
            component: 'DebugInitializer',
            action: 'initialize'
        }, error);

        // Don't throw - debug tools failure shouldn't break the app
        console.error('Debug tools initialization failed:', error);
    }
}

/**
 * Set up client-side error handlers
 */
function setupClientErrorHandlers(): void {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        logger.error('Unhandled promise rejection', {
            component: 'ClientErrorHandler',
            action: 'unhandledRejection'
        }, {
            reason: event.reason,
            promise: event.promise
        });
    });

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
        logger.error('JavaScript error', {
            component: 'ClientErrorHandler',
            action: 'javascriptError'
        }, {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error
        });
    });

    logger.debug('Client-side error handlers set up', {
        component: 'DebugInitializer',
        action: 'setupClientErrorHandlers'
    });
}

/**
 * Set up server-side error handlers
 */
function setupServerErrorHandlers(): void {
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
        logger.error('Unhandled promise rejection', {
            component: 'ServerErrorHandler',
            action: 'unhandledRejection'
        }, {
            reason,
            promise
        });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
        logger.error('Uncaught exception', {
            component: 'ServerErrorHandler',
            action: 'uncaughtException'
        }, error);
    });

    logger.debug('Server-side error handlers set up', {
        component: 'DebugInitializer',
        action: 'setupServerErrorHandlers'
    });
}

/**
 * Quick health check for authentication systems
 */
export async function performHealthCheck(): Promise<{
    overall: 'healthy' | 'degraded' | 'unhealthy';
    details: {
        configuration: 'ok' | 'warning' | 'error';
        sanity: 'ok' | 'warning' | 'error';
        supabase: 'ok' | 'warning' | 'error';
    };
    issues: string[];
}> {
    logger.debug('Performing authentication systems health check', {
        component: 'DebugInitializer',
        action: 'performHealthCheck'
    });

    const issues: string[] = [];
    const details: {
        configuration: 'ok' | 'warning' | 'error';
        sanity: 'ok' | 'warning' | 'error';
        supabase: 'ok' | 'warning' | 'error';
    } = {
        configuration: 'ok',
        sanity: 'ok',
        supabase: 'ok'
    };

    try {
        // Check configuration
        const configValidation = configDebugger.validateConfiguration();
        if (!configValidation.isValid) {
            details.configuration = configValidation.errors.length > 0 ? 'error' : 'warning';
            issues.push(...configValidation.errors);
        }

        // Check Sanity connection
        try {
            const { enhancedSanityClient } = await import('@/lib/sanity/enhanced-client');
            const sanityTest = await enhancedSanityClient.testAuthentication();
            if (!sanityTest.success) {
                details.sanity = 'error';
                issues.push(`Sanity connection failed: ${sanityTest.error || 'Unknown error'}`);
            }
        } catch (error) {
            details.sanity = 'error';
            issues.push(`Sanity test failed: ${error instanceof Error ? error.message : String(error)}`);
        }

        // Check Supabase connection
        try {
            const { supabase } = await import('@/lib/supabase');
            const { error } = await supabase.auth.getSession();
            if (error) {
                details.supabase = 'warning';
                issues.push(`Supabase session check warning: ${error.message}`);
            }
        } catch (error) {
            details.supabase = 'error';
            issues.push(`Supabase test failed: ${error instanceof Error ? error.message : String(error)}`);
        }

        // Determine overall health
        let overall: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

        if (details.configuration === 'error' || details.sanity === 'error' || details.supabase === 'error') {
            overall = 'unhealthy';
        } else if (details.configuration === 'warning' || details.sanity === 'warning' || details.supabase === 'warning') {
            overall = 'degraded';
        }

        const result = { overall, details, issues };

        logger.info('Health check completed', {
            component: 'DebugInitializer',
            action: 'performHealthCheck',
            metadata: result
        });

        return result;

    } catch (error) {
        logger.error('Health check failed', {
            component: 'DebugInitializer',
            action: 'performHealthCheck'
        }, error);

        return {
            overall: 'unhealthy',
            details: {
                configuration: 'error',
                sanity: 'error',
                supabase: 'error'
            },
            issues: ['Health check system failure']
        };
    }
}

/**
 * Export debug information for support
 */
export function exportDebugBundle(): string {
    try {
        const bundle = {
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            platform: typeof window !== 'undefined' ? 'client' : 'server',
            configuration: configDebugger.generateConfigReport(),
            authDebug: authDebugger.exportDebugInfo(),
            logs: {
                recent: logger.getRecentLogs(50),
                auth: logger.getAuthLogs(20),
                sanity: logger.getSanityLogs(20),
                config: logger.getConfigLogs(20),
                errors: logger.getErrorLogs(20)
            },
            stats: logger.getLogStats()
        };

        return JSON.stringify(bundle, null, 2);
    } catch (error) {
        logger.error('Failed to export debug bundle', {
            component: 'DebugInitializer',
            action: 'exportDebugBundle'
        }, error);

        return JSON.stringify({
            error: 'Failed to generate debug bundle',
            timestamp: new Date().toISOString(),
            details: error instanceof Error ? error.message : String(error)
        }, null, 2);
    }
}