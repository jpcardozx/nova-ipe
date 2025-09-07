/**
 * Server-side Configuration Initialization
 * 
 * This module handles server-side configuration validation and initialization.
 * It's designed to work alongside existing server components without breaking them.
 */

import { EnvironmentManager } from './environment-config';

/**
 * Initialize configuration on the server side
 * This function is safe to call multiple times and won't break existing functionality
 */
export function initServerConfig(): void {
    try {
        // Only log in development to avoid cluttering production logs
        if (process.env.NODE_ENV === 'development') {
            console.log('🔧 Server: Validating configuration...');
            console.log('Sanity configured:', !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
            console.log('Supabase configured:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
        }

        // Validate configuration but don't throw errors to preserve existing functionality
        const config = EnvironmentManager.getConfig();

        if (!config.sanity.configured && !config.supabase.configured && process.env.NODE_ENV === 'development') {
            console.warn('⚠️ Server: Configuration issues detected, but continuing with existing behavior');
        }
    } catch (error) {
        // Log error but don't throw to preserve existing functionality
        console.error('Server configuration validation error:', error);
    }
}

/**
 * Get server-side configuration status
 * Safe to use in server components
 */
export function getServerConfigStatus() {
    try {
        return EnvironmentManager.getConfig();
    } catch (error) {
        console.error('Error getting server config status:', error);
        return {
            sanity: { configured: false },
            supabase: { configured: false },
            errors: ['Configuration validation failed']
        };
    }
}

/**
 * Check if Sanity is available on server
 * Returns false instead of throwing to preserve existing functionality
 */
export function isSanityAvailableOnServer(): boolean {
    try {
        const config = EnvironmentManager.getSanityConfig();
        return config.configured;
    } catch (error) {
        console.error('Error checking Sanity availability:', error);
        return false;
    }
}

/**
 * Check if Supabase is available on server
 * Returns false instead of throwing to preserve existing functionality
 */
export function isSupabaseAvailableOnServer(): boolean {
    try {
        const config = EnvironmentManager.getSupabaseConfig();
        return config.configured;
    } catch (error) {
        console.error('Error checking Supabase availability:', error);
        return false;
    }
}