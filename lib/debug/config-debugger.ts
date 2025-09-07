/**
 * Environment Configuration Debugger
 * Provides detailed debugging for environment variable configuration
 */

import { logger } from '@/lib/logger';

export interface ConfigValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    missingRequired: string[];
    missingOptional: string[];
    recommendations: string[];
}

export interface EnvironmentDebugInfo {
    nodeEnv: string;
    platform: string;
    timestamp: Date;
    sanity: {
        projectId: { value?: string; present: boolean; valid: boolean };
        dataset: { value?: string; present: boolean; valid: boolean };
        apiVersion: { value?: string; present: boolean; valid: boolean };
        token: { present: boolean; valid: boolean; format?: string };
        useCdn: { value?: string; present: boolean; valid: boolean };
    };
    supabase: {
        url: { value?: string; present: boolean; valid: boolean };
        anonKey: { present: boolean; valid: boolean; format?: string };
        serviceKey: { present: boolean; valid: boolean };
    };
    auth: {
        adminPass: { present: boolean; valid: boolean };
        jwtSecret: { present: boolean; valid: boolean };
    };
    nextjs: {
        url: { value?: string; present: boolean; valid: boolean };
        vercelUrl: { value?: string; present: boolean };
    };
}

export class ConfigDebugger {
    private static instance: ConfigDebugger;

    private constructor() { }

    static getInstance(): ConfigDebugger {
        if (!ConfigDebugger.instance) {
            ConfigDebugger.instance = new ConfigDebugger();
        }
        return ConfigDebugger.instance;
    }

    /**
     * Validate complete environment configuration
     */
    validateConfiguration(): ConfigValidationResult {
        logger.debug('Starting comprehensive configuration validation', {
            component: 'ConfigDebugger',
            action: 'validateConfiguration'
        });

        const result: ConfigValidationResult = {
            isValid: true,
            errors: [],
            warnings: [],
            missingRequired: [],
            missingOptional: [],
            recommendations: []
        };

        // Validate Sanity configuration
        this.validateSanityConfig(result);

        // Validate Supabase configuration
        this.validateSupabaseConfig(result);

        // Validate authentication configuration
        this.validateAuthConfig(result);

        // Validate Next.js configuration
        this.validateNextJsConfig(result);

        // Determine overall validity
        result.isValid = result.errors.length === 0 && result.missingRequired.length === 0;

        // Log results
        if (!result.isValid) {
            logger.configError('Configuration validation failed', {
                component: 'ConfigDebugger',
                action: 'validateConfiguration'
            }, {
                errors: result.errors,
                missingRequired: result.missingRequired
            });
        } else {
            logger.config('Configuration validation passed', {
                component: 'ConfigDebugger',
                action: 'validateConfiguration'
            });
        }

        return result;
    }    /*
*
     * Validate Sanity configuration
     */
    private validateSanityConfig(result: ConfigValidationResult): void {
        const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
        const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
        const token = process.env.SANITY_API_TOKEN;
        const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION;

        // Project ID validation
        if (!projectId) {
            result.missingRequired.push('NEXT_PUBLIC_SANITY_PROJECT_ID');
            result.errors.push('Sanity project ID is required for CMS functionality');
        } else if (!/^[a-z0-9]{8}$/.test(projectId)) {
            result.errors.push('Sanity project ID format is invalid (should be 8 lowercase alphanumeric characters)');
        }

        // Dataset validation
        if (!dataset) {
            result.missingRequired.push('NEXT_PUBLIC_SANITY_DATASET');
            result.errors.push('Sanity dataset is required for CMS functionality');
        } else if (!/^[a-z0-9_-]+$/.test(dataset)) {
            result.errors.push('Sanity dataset format is invalid (should contain only lowercase letters, numbers, hyphens, and underscores)');
        }

        // API Token validation
        if (!token) {
            result.missingRequired.push('SANITY_API_TOKEN');
            result.errors.push('Sanity API token is required for authenticated operations');
        } else {
            if (!token.startsWith('sk')) {
                result.errors.push('Sanity API token format is invalid (should start with "sk")');
            } else if (token.length < 40) {
                result.errors.push('Sanity API token appears to be too short');
            }
        }

        // API Version validation
        if (!apiVersion) {
            result.missingOptional.push('NEXT_PUBLIC_SANITY_API_VERSION');
            result.warnings.push('Sanity API version not specified, using default');
        } else if (!/^\d{4}-\d{2}-\d{2}$/.test(apiVersion)) {
            result.warnings.push('Sanity API version format should be YYYY-MM-DD');
        }
    }

    /**
     * Validate Supabase configuration
     */
    private validateSupabaseConfig(result: ConfigValidationResult): void {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        // URL validation
        if (!url) {
            result.missingRequired.push('NEXT_PUBLIC_SUPABASE_URL');
            result.errors.push('Supabase URL is required for authentication and database operations');
        } else {
            try {
                const urlObj = new URL(url);
                if (!urlObj.hostname.includes('supabase')) {
                    result.warnings.push('Supabase URL does not appear to be a standard Supabase URL');
                }
            } catch {
                result.errors.push('Supabase URL format is invalid');
            }
        }

        // Anonymous key validation
        if (!anonKey) {
            result.missingRequired.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
            result.errors.push('Supabase anonymous key is required for client-side operations');
        } else if (!anonKey.startsWith('eyJ')) {
            result.errors.push('Supabase anonymous key format is invalid (should be a JWT token)');
        }

        // Service role key validation (optional but recommended)
        if (!serviceKey) {
            result.missingOptional.push('SUPABASE_SERVICE_ROLE_KEY');
            result.recommendations.push('Consider adding SUPABASE_SERVICE_ROLE_KEY for server-side operations');
        } else if (!serviceKey.startsWith('eyJ')) {
            result.warnings.push('Supabase service role key format appears invalid');
        }
    }

    /**
     * Validate authentication configuration
     */
    private validateAuthConfig(result: ConfigValidationResult): void {
        const adminPass = process.env.ADMIN_PASS;
        const jwtSecret = process.env.JWT_SECRET;

        // Admin password validation
        if (!adminPass) {
            result.missingOptional.push('ADMIN_PASS');
            result.warnings.push('Admin password not set - Sanity Studio access will not work');
        } else if (adminPass.length < 8) {
            result.warnings.push('Admin password is shorter than recommended (8+ characters)');
        }

        // JWT Secret validation
        if (!jwtSecret) {
            result.missingOptional.push('JWT_SECRET');
            result.recommendations.push('Consider adding JWT_SECRET for enhanced security');
        } else if (jwtSecret.length < 32) {
            result.warnings.push('JWT secret is shorter than recommended (32+ characters)');
        }
    }

    /**
     * Validate Next.js configuration
     */
    private validateNextJsConfig(result: ConfigValidationResult): void {
        const nextUrl = process.env.NEXTAUTH_URL;
        const vercelUrl = process.env.VERCEL_URL;

        // Next.js URL validation
        if (!nextUrl && !vercelUrl) {
            result.missingOptional.push('NEXTAUTH_URL or VERCEL_URL');
            result.recommendations.push('Set NEXTAUTH_URL for consistent authentication redirects');
        }

        if (nextUrl) {
            try {
                new URL(nextUrl);
            } catch {
                result.warnings.push('NEXTAUTH_URL format is invalid');
            }
        }
    }

    /**
     * Generate detailed environment debug information
     */
    generateDebugInfo(): EnvironmentDebugInfo {
        logger.debug('Generating detailed environment debug information', {
            component: 'ConfigDebugger',
            action: 'generateDebugInfo'
        });

        return {
            nodeEnv: process.env.NODE_ENV || 'unknown',
            platform: typeof window !== 'undefined' ? 'client' : 'server',
            timestamp: new Date(),
            sanity: {
                projectId: this.analyzeEnvVar('NEXT_PUBLIC_SANITY_PROJECT_ID', /^[a-z0-9]{8}$/),
                dataset: this.analyzeEnvVar('NEXT_PUBLIC_SANITY_DATASET', /^[a-z0-9_-]+$/),
                apiVersion: this.analyzeEnvVar('NEXT_PUBLIC_SANITY_API_VERSION', /^\d{4}-\d{2}-\d{2}$/),
                token: this.analyzeToken('SANITY_API_TOKEN', 'sanity'),
                useCdn: this.analyzeEnvVar('NEXT_PUBLIC_SANITY_USE_CDN', /^(true|false)$/)
            },
            supabase: {
                url: this.analyzeEnvVar('NEXT_PUBLIC_SUPABASE_URL', /^https?:\/\/.+/),
                anonKey: this.analyzeToken('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'jwt'),
                serviceKey: this.analyzeToken('SUPABASE_SERVICE_ROLE_KEY', 'jwt')
            },
            auth: {
                adminPass: this.analyzeToken('ADMIN_PASS', 'password'),
                jwtSecret: this.analyzeToken('JWT_SECRET', 'secret')
            },
            nextjs: {
                url: this.analyzeEnvVar('NEXTAUTH_URL', /^https?:\/\/.+/),
                vercelUrl: {
                    value: process.env.VERCEL_URL,
                    present: !!process.env.VERCEL_URL
                }
            }
        };
    }

    /**
     * Analyze environment variable
     */
    private analyzeEnvVar(name: string, validationRegex?: RegExp): { value?: string; present: boolean; valid: boolean } {
        const value = process.env[name];
        const present = !!value;
        const valid = present && (!validationRegex || validationRegex.test(value));

        return {
            value: present ? value : undefined,
            present,
            valid
        };
    }

    /**
     * Analyze token/secret environment variable
     */
    private analyzeToken(name: string, type: 'sanity' | 'jwt' | 'password' | 'secret'): { present: boolean; valid: boolean; format?: string } {
        const value = process.env[name];
        const present = !!value;

        if (!present) {
            return { present: false, valid: false };
        }

        let valid = false;
        let format = 'unknown';

        switch (type) {
            case 'sanity':
                valid = value.startsWith('sk') && value.length > 20;
                format = value.startsWith('sk') ? 'sanity-token' : 'invalid';
                break;
            case 'jwt':
                valid = value.startsWith('eyJ');
                format = value.startsWith('eyJ') ? 'jwt' : 'invalid';
                break;
            case 'password':
                valid = value.length >= 6;
                format = `${value.length}-chars`;
                break;
            case 'secret':
                valid = value.length >= 16;
                format = `${value.length}-chars`;
                break;
        }

        return { present, valid, format };
    }

    /**
     * Generate configuration report for debugging
     */
    generateConfigReport(): string {
        const validation = this.validateConfiguration();
        const debugInfo = this.generateDebugInfo();

        const report = {
            timestamp: new Date().toISOString(),
            environment: debugInfo.nodeEnv,
            platform: debugInfo.platform,
            validation: {
                isValid: validation.isValid,
                errorCount: validation.errors.length,
                warningCount: validation.warnings.length,
                missingRequired: validation.missingRequired,
                missingOptional: validation.missingOptional
            },
            configuration: {
                sanity: {
                    configured: debugInfo.sanity.projectId.present && debugInfo.sanity.dataset.present && debugInfo.sanity.token.present,
                    projectId: debugInfo.sanity.projectId.present ? '✅' : '❌',
                    dataset: debugInfo.sanity.dataset.present ? '✅' : '❌',
                    token: debugInfo.sanity.token.present ? '✅' : '❌',
                    apiVersion: debugInfo.sanity.apiVersion.present ? '✅' : '⚠️'
                },
                supabase: {
                    configured: debugInfo.supabase.url.present && debugInfo.supabase.anonKey.present,
                    url: debugInfo.supabase.url.present ? '✅' : '❌',
                    anonKey: debugInfo.supabase.anonKey.present ? '✅' : '❌',
                    serviceKey: debugInfo.supabase.serviceKey.present ? '✅' : '⚠️'
                }
            },
            errors: validation.errors,
            warnings: validation.warnings,
            recommendations: validation.recommendations
        };

        return JSON.stringify(report, null, 2);
    }
}

// Export singleton instance
export const configDebugger = ConfigDebugger.getInstance();