/**
 * Sistema de Analytics para Imagens
 * 
 * Este módulo coleta informações de desempenho sobre o carregamento de imagens
 * e oferece insights para melhorar ainda mais a performance.
 */

import { SanityImage, ImageType } from '@/lib/sanity-image-helper';

// Tipos para análise de imagens
export interface ImageLoadMetrics {
    url: string;
    component: string;
    loadStart: number;
    loadEnd?: number;
    loadTime?: number;
    success: boolean;
    errorType?: string;
    imageWidth?: number;
    imageHeight?: number;
    screenWidth?: number;
    screenHeight?: number;
    connectionType?: string;
    priority?: boolean;
    fromCache?: boolean;
}

interface ImageAnalyticsProps {
    maxStoredEvents?: number;
    enableLocalStorage?: boolean;
    debug?: boolean;
    sendToServer?: boolean;
    collectionEndpoint?: string;
}

// Dados coletados na sessão atual
let loadEvents: ImageLoadMetrics[] = [];

// Configuração padrão
const config: ImageAnalyticsProps = {
    maxStoredEvents: 100,
    enableLocalStorage: true,
    debug: false,
    sendToServer: false,
    collectionEndpoint: '/api/image-analytics'
};

/**
 * Inicializar o sistema de analytics
 */
export function initImageAnalytics(options: ImageAnalyticsProps = {}): void {
    // Mesclar opções com configuração padrão
    Object.assign(config, options);

    // Carregar eventos anteriores do localStorage se habilitado
    if (config.enableLocalStorage && typeof window !== 'undefined' && window.localStorage) {
        try {
            const storedEvents = window.localStorage.getItem('ipe_image_analytics');
            if (storedEvents) {
                loadEvents = JSON.parse(storedEvents);
            }
        } catch (e) {
            console.error('Erro ao carregar analytics de imagens:', e);
        }
    }

    if (config.debug) {
        console.log('Image Analytics inicializado com', loadEvents.length, 'eventos anteriores');
    }
}

/**
 * Registra início do carregamento de uma imagem
 */
export function trackImageLoadStart(
    image: ImageType,
    componentName: string,
    priority = false
): string {
    try {
        // Criar ID único para este evento de carregamento
        const eventId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        // Obter URL da imagem
        let url = '';
        if (typeof image === 'string') {
            url = image;
        } else if (image && typeof image === 'object') {
            url = image.url || image.imagemUrl || (image.asset?.url || '') || '';
        }

        // Se não conseguir determinar a URL, não rastrear
        if (!url) return eventId;

        const metrics: ImageLoadMetrics = {
            url,
            component: componentName,
            loadStart: performance.now(),
            success: false,
            priority,
            screenWidth: typeof window !== 'undefined' ? window.innerWidth : undefined,
            screenHeight: typeof window !== 'undefined' ? window.innerHeight : undefined,
            connectionType: typeof navigator !== 'undefined' && 'connection' in navigator ?
                // @ts-ignore - Connection API não está em todos os navegadores
                navigator.connection?.effectiveType : undefined
        };

        // Adicionar evento ao array de eventos
        loadEvents.push(metrics);

        // Limitar tamanho da coleção
        if (loadEvents.length > (config.maxStoredEvents || 100)) {
            loadEvents = loadEvents.slice(-config.maxStoredEvents!);
        }

        // Persistir eventos se habilitado
        persistEvents();

        return eventId;
    } catch (e) {
        console.error('Erro ao rastrear carregamento de imagem:', e);
        return '';
    }
}

/**
 * Registra finalização do carregamento de uma imagem
 */
export function trackImageLoadComplete(
    eventId: string,
    success: boolean,
    metadata?: { width?: number, height?: number, fromCache?: boolean }
): void {
    try {
        // Encontrar evento pelo ID
        const event = loadEvents.find(e => e.url.includes(eventId));
        if (!event) return;

        // Atualizar métricas
        event.loadEnd = performance.now();
        event.loadTime = event.loadEnd - event.loadStart;
        event.success = success;

        if (metadata) {
            event.imageWidth = metadata.width;
            event.imageHeight = metadata.height;
            event.fromCache = metadata.fromCache;
        }

        if (!success) {
            event.errorType = 'load_error';
        }

        // Debug
        if (config.debug) {
            console.log(`Imagem ${success ? 'carregada' : 'falhou'} em ${event.loadTime.toFixed(0)}ms:`, event.url);
        }

        // Enviar para servidor se configurado
        if (config.sendToServer) {
            sendAnalyticsToServer([event]);
        }

        // Persistir eventos
        persistEvents();
    } catch (e) {
        console.error('Erro ao finalizar rastreamento de imagem:', e);
    }
}

/**
 * Persiste eventos em localStorage
 */
function persistEvents(): void {
    if (config.enableLocalStorage && typeof window !== 'undefined' && window.localStorage) {
        try {
            window.localStorage.setItem('ipe_image_analytics', JSON.stringify(loadEvents));
        } catch (e) {
            // Silenciar erros de localStorage (pode estar cheio)
        }
    }
}

/**
 * Envia dados para servidor
 */
async function sendAnalyticsToServer(events: ImageLoadMetrics[]): Promise<void> {
    if (!config.collectionEndpoint) return;

    try {
        await fetch(config.collectionEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ events }),
            // Não esperar pela resposta, enviar e esquecer
            keepalive: true
        });
    } catch (e) {
        // Silenciar erros de rede
    }
}

/**
 * Obtém estatísticas de carregamento de imagens
 */
export function getImageLoadStats() {
    const total = loadEvents.length;
    const successful = loadEvents.filter(e => e.success).length;
    const failed = total - successful;

    // Calcular tempos médios por componente
    const componentStats = loadEvents.reduce((acc, event) => {
        if (!event.loadTime) return acc;

        if (!acc[event.component]) {
            acc[event.component] = {
                count: 0,
                totalTime: 0,
                avgTime: 0,
                failures: 0
            };
        }

        acc[event.component].count++;
        acc[event.component].totalTime += event.loadTime;
        if (!event.success) acc[event.component].failures++;

        return acc;
    }, {} as Record<string, { count: number, totalTime: number, avgTime: number, failures: number }>);

    // Calcular médias
    Object.keys(componentStats).forEach(comp => {
        const stats = componentStats[comp];
        stats.avgTime = stats.count > 0 ? stats.totalTime / stats.count : 0;
    });

    return {
        total,
        successful,
        failed,
        successRate: total > 0 ? (successful / total) * 100 : 0,
        averageLoadTime: loadEvents.reduce((sum, e) => sum + (e.loadTime || 0), 0) / total,
        componentStats,
        recentEvents: loadEvents.slice(-10)
    };
}

/**
 * Limpa dados de analytics
 */
export function clearImageAnalytics(): void {
    loadEvents = [];
    if (config.enableLocalStorage && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('ipe_image_analytics');
    }
}

// Auto-inicializar se estiver no cliente
if (typeof window !== 'undefined') {
    initImageAnalytics();
}
