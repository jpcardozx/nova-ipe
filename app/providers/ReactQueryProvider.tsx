'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache por 5 minutos
            staleTime: 5 * 60 * 1000,
            // Garbage collect após 10 minutos
            gcTime: 10 * 60 * 1000,
            // Retry automático com backoff
            retry: (failureCount, error) => {
              if (failureCount < 2) return true
              return false
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Background refetch em foco
            refetchOnWindowFocus: true,
            // Não refetch se offline
            refetchOnReconnect: true,
          },
          mutations: {
            // Retry mutations críticas
            retry: (failureCount, error) => {
              // Retry WhatsApp sends
              if (error?.message?.includes('whatsapp') && failureCount < 3) {
                return true
              }
              return false
            },
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <ReactQueryDevtools
        initialIsOpen={false}
      />
    </QueryClientProvider>
  )
}