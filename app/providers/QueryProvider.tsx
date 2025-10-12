/**
 * React Query Provider
 * 
 * Gerencia o cache de dados do servidor (server state) de forma automática.
 * Substitui useState + useEffect manual por queries inteligentes.
 * 
 * @see https://tanstack.com/query/latest/docs/framework/react/overview
 */

'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
            retry: 2,
            refetchOnWindowFocus: false,
        },
    },
})

interface ProvidersProps {
    children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            
            {/* DevTools - só aparece em desenvolvimento */}
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools 
                    initialIsOpen={false}
                    buttonPosition="bottom-right"
                    position="bottom"
                />
            )}
        </QueryClientProvider>
    )
}
