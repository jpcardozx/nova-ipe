'use client';

import { useEffect, useState } from 'react';
import { onCLS, onFCP, onLCP, onTTFB, onINP, type Metric } from 'web-vitals';

const vitalsUrl = process.env.NEXT_PUBLIC_VITALS_URL || '/api/vitals';

/**
 * Envia os dados de Web Vitals para o endpoint de análise
 */
const sendToAnalytics = ({ name, delta, value, id }: Metric) => {
    // Adicionamos a URL atual para contextualizar as métricas
    const body = {
        name,
        delta,
        value,
        id,
        page: window.location.pathname,
        timestamp: Date.now(),
        environment: process.env.NODE_ENV,
    };

    // Log para modo de desenvolvimento
    if (process.env.NODE_ENV !== 'production') {
        console.log(`[WebVitals] Coletado: ${name} = ${value}`);
    }

    // Use `navigator.sendBeacon()` se disponível, senão use `fetch()`
    if ('sendBeacon' in navigator) {
        navigator.sendBeacon(vitalsUrl, JSON.stringify(body));
    } else {
        fetch(vitalsUrl, {
            body: JSON.stringify(body),
            method: 'POST',
            keepalive: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
};

/**
 * Componente para rastrear Web Vitals
 * Carrega e configura o rastreamento de métricas de performance quando montado
 */
export function WebVitals() {
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        // Flag indicando que o componente está montado
        setIsEnabled(true);

        if (process.env.NODE_ENV !== 'production') {
            console.log('[WebVitals] Componente inicializado');
        }

        // Em vez de iniciar imediatamente, aguardamos o navegador ficar ocioso
        // ou após carregamento completo para evitar interferência com o LCP
        const registerVitals = () => {
            // Inicia com as métricas mais críticas
            onLCP(sendToAnalytics);

            // Adicionado INP (Interaction to Next Paint)
            onINP(sendToAnalytics);

            // Atrasa ligeiramente as métricas menos críticas
            setTimeout(() => {
                onFCP(sendToAnalytics);
                onTTFB(sendToAnalytics);
                onCLS(sendToAnalytics);
            }, 100);
        };        // Usar requestIdleCallback se disponível, senão usar setTimeout
        if (typeof window !== 'undefined') {
            if ('requestIdleCallback' in window) {
                (window as any).requestIdleCallback(() => registerVitals(), { timeout: 1000 });
            } else {
                // Fallback para navegadores que não suportam requestIdleCallback
                setTimeout(registerVitals, 200); // Safer fallback
            }
        }

        // Log para desenvolvimento
        if (process.env.NODE_ENV === 'development') {
            console.log('Web Vitals monitoring enabled');
        }
    }, []);

    // Componente não renderiza nada, apenas configura os listeners
    return null;
}

export default WebVitals;
