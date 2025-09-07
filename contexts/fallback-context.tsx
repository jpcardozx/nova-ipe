'use client'

import React, { createContext, useContext, useState } from 'react'

interface FallbackContextType {
    isUsingFallback: boolean
    setIsUsingFallback: (value: boolean) => void
    fallbackReason?: string
    setFallbackReason: (reason?: string) => void
    isFallbackActive: boolean
    fallbackStats: {
        errorCount: number
        lastError?: string
        uptime: number
        recentUsages: number
        lastUsage?: Date
    }
    retryConnection: () => Promise<void>
}

const FallbackContext = createContext<FallbackContextType | undefined>(undefined)

export function FallbackProvider({ children }: { children: React.ReactNode }) {
    const [isUsingFallback, setIsUsingFallback] = useState(false)
    const [fallbackReason, setFallbackReason] = useState<string | undefined>()
    const [fallbackStats, setFallbackStats] = useState({
        errorCount: 0,
        lastError: undefined as string | undefined,
        uptime: Date.now(),
        recentUsages: 0,
        lastUsage: undefined as Date | undefined
    })

    const retryConnection = async () => {
        try {
            // Attempt to reconnect to services
            setIsUsingFallback(false)
            setFallbackReason(undefined)
        } catch (error) {
            setIsUsingFallback(true)
            setFallbackReason(error instanceof Error ? error.message : 'Connection failed')
            setFallbackStats(prev => ({
                ...prev,
                errorCount: prev.errorCount + 1,
                lastError: error instanceof Error ? error.message : 'Connection failed',
                recentUsages: prev.recentUsages + 1,
                lastUsage: new Date()
            }))
        }
    }

    return (
        <FallbackContext.Provider
            value={{
                isUsingFallback,
                setIsUsingFallback,
                fallbackReason,
                setFallbackReason,
                isFallbackActive: isUsingFallback,
                fallbackStats,
                retryConnection,
            }}
        >
            {children}
        </FallbackContext.Provider>
    )
}

export function useFallback() {
    const context = useContext(FallbackContext)
    if (context === undefined) {
        throw new Error('useFallback must be used within a FallbackProvider')
    }
    return context
}
