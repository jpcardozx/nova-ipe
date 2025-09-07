/**
 * Sanity Status Component
 * Shows when the app is using fallback data due to Sanity issues
 */

'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react'

interface SanityStatusProps {
    className?: string
}

export function SanityStatus({ className = '' }: SanityStatusProps) {
    const [isUsingFallback, setIsUsingFallback] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Check if we're using fallback data
        const checkFallbackStatus = () => {
            // Look for fallback indicators in console or localStorage
            const fallbackIndicators = [
                '🔄 Using fallback data',
                '🚨 Sanity is unhealthy',
                'Using fallback data for'
            ]

            // Simple check - in a real app you'd have a proper status endpoint
            const usingFallback = localStorage.getItem('sanity-fallback') === 'true'
            setIsUsingFallback(usingFallback)
            setIsVisible(usingFallback)
        }

        checkFallbackStatus()

        // Check periodically
        const interval = setInterval(checkFallbackStatus, 30000) // Every 30 seconds

        return () => clearInterval(interval)
    }, [])

    if (!isVisible) return null

    return (
        <div className={`bg-amber-50 border border-amber-200 rounded-lg p-3 ${className}`}>
            <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <div className="flex-1">
                    <p className="text-sm font-medium text-amber-800">
                        Modo Offline
                    </p>
                    <p className="text-xs text-amber-700">
                        Exibindo dados em cache. Algumas informações podem estar desatualizadas.
                    </p>
                </div>
                <div className="flex items-center gap-1">
                    <WifiOff className="h-4 w-4 text-amber-600" />
                    <span className="text-xs text-amber-600">Sanity</span>
                </div>
            </div>
        </div>
    )
}

export function SanityHealthIndicator({ className = '' }: { className?: string }) {
    const [health, setHealth] = useState<{
        isHealthy: boolean
        latency?: number
        error?: string
    } | null>(null)

    useEffect(() => {
        const checkHealth = async () => {
            try {
                // In a real implementation, you'd call your health check endpoint
                const response = await fetch('/api/sanity/health')
                const healthData = await response.json()
                setHealth(healthData)
            } catch (error) {
                setHealth({
                    isHealthy: false,
                    error: 'Failed to check health'
                })
            }
        }

        checkHealth()
        const interval = setInterval(checkHealth, 60000) // Every minute

        return () => clearInterval(interval)
    }, [])

    if (!health) return null

    return (
        <div className={`inline-flex items-center gap-1 text-xs ${className}`}>
            {health.isHealthy ? (
                <>
                    <Wifi className="h-3 w-3 text-green-500" />
                    <span className="text-green-600">
                        Sanity OK {health.latency && `(${health.latency}ms)`}
                    </span>
                </>
            ) : (
                <>
                    <WifiOff className="h-3 w-3 text-red-500" />
                    <span className="text-red-600">Sanity Offline</span>
                </>
            )}
        </div>
    )
}

export default SanityStatus