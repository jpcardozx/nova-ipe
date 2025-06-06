'use client';

/**
 * ClientPerformanceMonitor.tsx
 * 
 * Componente para monitoramento de performance do lado do cliente
 *
 * @version 1.0.0
 * @date 21/05/2025
 */

import React, { useEffect } from 'react';

/**
 * Monitor de performance simplificado para cliente
 * Este componente pode ser expandido com mais funcionalidades conforme necessário
 */
export default function ClientPerformanceMonitor() {
    useEffect(() => {
        // Só monitorar em desenvolvimento
        if (process.env.NODE_ENV !== 'development') {
            return;
        }

        console.log('[ClientPerformanceMonitor] Inicializado');

        // Monitorar o tempo de carregamento da página
        const loadTime =
            window.performance?.timing?.domContentLoadedEventEnd -
            window.performance?.timing?.navigationStart;

        if (loadTime) {
            console.log(`[Performance] Tempo de carregamento: ${loadTime}ms`);
        }

        // Cleanup
        return () => {
            console.log('[ClientPerformanceMonitor] Desconectado');
        };
    }, []);

    // Não renderiza nada visualmente
    return null;
}