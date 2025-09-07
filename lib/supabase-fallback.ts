/**
 * Supabase Fallback Handler
 * 
 * Provides fallback mechanisms when Supabase is unavailable or misconfigured.
 * This ensures the application continues to function gracefully even when
 * the database is not accessible.
 */

import { AccessRequestData, FormSubmissionResult } from './signup-form-manager'

export interface FallbackStorage {
    requests: Array<AccessRequestData & { id: string; timestamp: string; status: string }>
}

/**
 * Fallback handler for when Supabase is unavailable
 */
export class SupabaseFallbackHandler {
    private static readonly STORAGE_KEY = 'ipe_fallback_requests'
    private static readonly MAX_STORED_REQUESTS = 50

    /**
     * Checks if Supabase is available by testing environment variables
     * @returns True if Supabase appears to be configured
     */
    static isSupabaseAvailable(): boolean {
        try {
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL
            const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

            return !!(url && key && url.startsWith('https://'))
        } catch {
            return false
        }
    }

    /**
     * Stores request in local storage as fallback
     * @param data Request data to store
     * @returns Submission result
     */
    static async storeRequestLocally(data: AccessRequestData): Promise<FormSubmissionResult> {
        try {
            // Check if localStorage is available (client-side only)
            if (typeof window === 'undefined' || !window.localStorage) {
                return {
                    success: false,
                    error: 'Serviço temporariamente indisponível. Tente novamente mais tarde.',
                    errorCode: 'STORAGE_UNAVAILABLE',
                    retryable: true
                }
            }

            const storage = this.getStoredRequests()

            // Check for duplicate email
            const existingRequest = storage.requests.find(
                req => req.email.toLowerCase() === data.email.toLowerCase() && req.status === 'pending'
            )

            if (existingRequest) {
                return {
                    success: false,
                    error: 'Já existe uma solicitação pendente para este email.',
                    errorCode: 'DUPLICATE_EMAIL',
                    retryable: false
                }
            }

            // Create new request
            const newRequest = {
                ...data,
                id: this.generateId(),
                timestamp: new Date().toISOString(),
                status: 'pending'
            }

            // Add to storage
            storage.requests.unshift(newRequest)

            // Limit stored requests
            if (storage.requests.length > this.MAX_STORED_REQUESTS) {
                storage.requests = storage.requests.slice(0, this.MAX_STORED_REQUESTS)
            }

            // Save to localStorage
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storage))

            // Log for admin awareness
            console.warn('Request stored locally due to Supabase unavailability:', {
                email: data.email,
                timestamp: newRequest.timestamp,
                id: newRequest.id
            })

            return {
                success: true
            }

        } catch (error) {
            console.error('Error storing request locally:', error)
            return {
                success: false,
                error: 'Erro ao processar solicitação. Tente novamente.',
                errorCode: 'STORAGE_ERROR',
                retryable: true
            }
        }
    }

    /**
     * Gets stored requests from localStorage
     * @returns Stored requests object
     */
    private static getStoredRequests(): FallbackStorage {
        try {
            if (typeof window === 'undefined' || !window.localStorage) {
                return { requests: [] }
            }

            const stored = localStorage.getItem(this.STORAGE_KEY)
            if (!stored) {
                return { requests: [] }
            }

            const parsed = JSON.parse(stored)
            return {
                requests: Array.isArray(parsed.requests) ? parsed.requests : []
            }
        } catch {
            return { requests: [] }
        }
    }

    /**
     * Generates a simple ID for stored requests
     * @returns Generated ID string
     */
    private static generateId(): string {
        return `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    /**
     * Gets all stored requests (for admin review)
     * @returns Array of stored requests
     */
    static getStoredRequestsForAdmin(): Array<AccessRequestData & { id: string; timestamp: string; status: string }> {
        return this.getStoredRequests().requests
    }

    /**
     * Clears stored requests (after successful sync)
     * @param requestIds Optional array of specific request IDs to clear
     */
    static clearStoredRequests(requestIds?: string[]): void {
        try {
            if (typeof window === 'undefined' || !window.localStorage) {
                return
            }

            if (!requestIds) {
                // Clear all
                localStorage.removeItem(this.STORAGE_KEY)
                return
            }

            // Clear specific requests
            const storage = this.getStoredRequests()
            storage.requests = storage.requests.filter(req => !requestIds.includes(req.id))
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storage))

        } catch (error) {
            console.error('Error clearing stored requests:', error)
        }
    }

    /**
     * Attempts to sync stored requests to Supabase when it becomes available
     * This would typically be called by an admin or background process
     */
    static async syncStoredRequests(): Promise<{ synced: number; failed: number }> {
        // This is a placeholder for future implementation
        // Would require actual Supabase client and admin permissions
        console.log('Sync functionality would be implemented here')
        return { synced: 0, failed: 0 }
    }

    /**
     * Gets count of pending stored requests
     * @returns Number of pending requests in storage
     */
    static getPendingRequestCount(): number {
        const storage = this.getStoredRequests()
        return storage.requests.filter(req => req.status === 'pending').length
    }

    /**
     * Checks if there are any stored requests that need admin attention
     * @returns True if there are pending stored requests
     */
    static hasStoredRequests(): boolean {
        return this.getPendingRequestCount() > 0
    }
}