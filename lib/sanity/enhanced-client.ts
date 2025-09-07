/**
 * Enhanced Sanity Client
 * Provides enhanced functionality and debugging capabilities
 */

import { createClient } from 'next-sanity'

const sanityConfig = {
    projectId: '0nks58lj',
    dataset: 'production',
    apiVersion: '2023-05-03',
    useCdn: process.env.NODE_ENV === 'production',
    token: process.env.SANITY_API_TOKEN,
}

class EnhancedSanityClient {
    private client = createClient(sanityConfig)
    
    /**
     * Test authentication and connection
     */
    async testAuthentication() {
        try {
            const result = await this.client.fetch('*[_type == "imovel"][0...1]')
            return {
                success: true,
                message: 'Authentication successful',
                data: result,
                hasToken: !!sanityConfig.token
            }
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Authentication failed',
                error,
                hasToken: !!sanityConfig.token
            }
        }
    }

    /**
     * Enhanced fetch with debugging
     */
    async fetch<T>(query: string, params: Record<string, any> = {}): Promise<T> {
        try {
            console.log('[Enhanced Client] Executing query:', query.substring(0, 100) + '...')
            const result = await this.client.fetch<T>(query, params)
            console.log('[Enhanced Client] Query successful, results:', Array.isArray(result) ? `${result.length} items` : 'single item')
            return result
        } catch (error) {
            console.error('[Enhanced Client] Query failed:', error)
            throw error
        }
    }

    /**
     * Get client configuration
     */
    getConfig() {
        return {
            ...sanityConfig,
            token: sanityConfig.token ? '***' : undefined
        }
    }
}

export const enhancedSanityClient = new EnhancedSanityClient()
export default enhancedSanityClient
