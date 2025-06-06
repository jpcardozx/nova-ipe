'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { initImageAnalytics, getImageLoadStats, clearImageAnalytics, trackImageLoadStart, trackImageLoadComplete } from '@/lib/image-analytics';

// Contexto para métricas de imagens
interface ImageAnalyticsContextType {
    // Funções de tracking
    trackStart: (imageUrl: string, componentName: string, priority?: boolean) => string;
    trackComplete: (eventId: string, success: boolean, metadata?: any) => void;

    // Dados
    stats: ReturnType<typeof getImageLoadStats> | null;

    // Ações
    refreshStats: () => void;
    clearStats: () => void;
}

// Criar contexto padrão
const ImageAnalyticsContext = createContext<ImageAnalyticsContextType>({
    trackStart: () => '',
    trackComplete: () => { },
    stats: null,
    refreshStats: () => { },
    clearStats: () => { }
});

// Hook para usar analytics de imagem
export const useImageAnalytics = () => useContext(ImageAnalyticsContext);

interface ImageAnalyticsProviderProps {
    children: ReactNode;
    enableAnalytics?: boolean;
    debug?: boolean;
    sendToServer?: boolean;
    collectionEndpoint?: string;
}

/**
 * Provider que disponibiliza o sistema de analytics de imagens para a aplicação
 */
export function ImageAnalyticsProvider({
    children,
    enableAnalytics = true,
    debug = false,
    sendToServer = false,
    collectionEndpoint = '/api/image-analytics'
}: ImageAnalyticsProviderProps) {
    const [stats, setStats] = useState<ReturnType<typeof getImageLoadStats> | null>(null);

    // Inicializar analytics
    useEffect(() => {
        if (!enableAnalytics) return;

        initImageAnalytics({
            debug,
            sendToServer,
            collectionEndpoint
        });

        // Carregar estatísticas iniciais
        setStats(getImageLoadStats());

        // Atualizar estatísticas periodicamente (a cada 30 segundos)
        const interval = setInterval(() => {
            setStats(getImageLoadStats());
        }, 30000);

        return () => clearInterval(interval);
    }, [enableAnalytics, debug, sendToServer, collectionEndpoint]);

    // Função para atualizar estatísticas manualmente
    const refreshStats = () => {
        setStats(getImageLoadStats());
    };

    // Função para limpar estatísticas
    const clearStats = () => {
        clearImageAnalytics();
        setStats(getImageLoadStats());
    };

    // Funções de tracking simplificadas
    const trackStart = (imageUrl: string, componentName: string, priority = false) => {
        return trackImageLoadStart(imageUrl, componentName, priority);
    };

    const trackComplete = (eventId: string, success: boolean, metadata?: any) => {
        trackImageLoadComplete(eventId, success, metadata);
        refreshStats();
    };

    return (
        <ImageAnalyticsContext.Provider
            value={{
                trackStart,
                trackComplete,
                stats,
                refreshStats,
                clearStats
            }}
        >
            {children}
        </ImageAnalyticsContext.Provider>
    );
}
