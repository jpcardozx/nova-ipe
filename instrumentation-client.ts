// instrumentation-client.ts
// This is the client side instrumentation file for Next.js
// https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client

'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

// Required hooks for Next.js integration
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
export const onRequestError = Sentry.captureRequestError;

// Only initialize Sentry in production
const isProd = process.env.NODE_ENV === 'production';

// Função para inicializar o Sentry no lado do cliente
export function SentryInit() {
    useEffect(() => {
        try {
            if (isProd) {
                // DSN da sua organização Sentry
                Sentry.init({
                    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

                    // Configuração simplificada para reduzir problemas de carregamento
                    tracesSampleRate: 0.05,
                    replaysSessionSampleRate: 0.01,
                    replaysOnErrorSampleRate: 0.1,
                    environment: process.env.NODE_ENV,
                    sendDefaultPii: false,
                    integrations: [],
                    enabled: isProd,
                });

                console.log('Sentry client initialized in production mode');
            } else {
                console.log('Sentry disabled in development mode for better performance');
            }
        } catch (error) {
            console.warn('Failed to initialize Sentry:', error);
        }
    }, []);

    return null;
}

// Dividindo o código em partes menores para melhorar o desempenho
export function initializeInstrumentation() {
    // Código principal de inicialização
}

export function trackPerformanceMetrics() {
    // Código para rastrear métricas de desempenho
}

export function logErrors() {
    // Código para log de erros
}