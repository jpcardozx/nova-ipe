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
        if (isProd) {
            // DSN da sua organização Sentry
            Sentry.init({
                dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

                // Definir a amostragem corretamente está muito relacionado com o volume de erros
                // e pode afetar a sua fatura (se não estiver no free tier)
                // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/filtering/
                tracesSampleRate: 0.1,

                // Esta configuração define a porcentagem de transações que são enviadas ao Sentry
                replaysSessionSampleRate: 0.05,

                // Taxa de amostragem de sessões que tiveram um erro, útil para investigar problemas
                replaysOnErrorSampleRate: 0.5,

                // Configurar o ambiente corretamente ajuda na filtragem de alertas
                environment: process.env.NODE_ENV,

                // Isso adicionará dados detalhados como componentes e valores da props 
                // que causaram o erro. Pode conter dados potencialmente sensíveis.
                sendDefaultPii: true,

                // Habilita as informações de rastreamento entre serviços (front-end e back-end)
                integrations: [],

                // Se os elementos devem ser monitorados quando em desenvolvimento
                // Recomendação: deixe apenas em produção para não atrapalhar o desenvolvimento
                enabled: isProd,
            });

            console.log('Sentry client initialized in production mode');
        } else {
            console.log('Sentry disabled in development mode for better performance');
        }
    }, []);

    return null;
} 