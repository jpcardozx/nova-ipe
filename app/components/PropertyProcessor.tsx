'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { processImage, getImageUrl, getImageAlt } from '@/lib/sanity-image-helper';
import type { PropertyType } from '@/app/components/ui/property/PropertyCardUnified';
import { generateResponsiveImageSet } from '@/lib/responsive-images';

/**
 * Interface premium para o tipo de dados de imóvel processados
 * com suporte a recursos avançados e metadados otimizados
 */
export interface ProcessedPropertyData {
    id: string;
    title: string;
    slug: string;
    location: string;
    city: string;
    price: number;
    propertyType: PropertyType;
    area?: number;
    bedrooms?: number;
    bathrooms?: number;
    parkingSpots?: number;
    mainImage: {
        url: string;
        alt: string;
        responsive?: Record<string, string>; // URLs otimizadas para diferentes breakpoints
        hotspot?: {
            x: number;
            y: number;
        };
        blurDataUrl?: string; // Para placeholder blur premium
        dominantColor?: string; // Cor dominante da imagem
    };
    isHighlight: boolean;
    isPremium: boolean;
    isNew: boolean;
    isUrgent?: boolean; // Para propriedades com urgência
    isFeatured?: boolean; // Para propriedades em destaque especial
    metadata?: {
        createdAt: Date;
        updatedAt: Date;
        viewCount?: number;
        popularity?: number;
    };
    analytics?: {
        processingTime: number;
        cacheHit: boolean;
        optimizationLevel: 'basic' | 'premium' | 'enterprise';
    };
}

/**
 * Configurações premium para otimização de performance
 */
const PERFORMANCE_CONFIG = {
    CACHE_TTL: 30 * 60 * 1000, // 30 minutos
    MAX_CACHE_SIZE: 1000,
    BATCH_SIZE: 50,
    PROCESSING_TIMEOUT: 5000,
    OPTIMIZATION_LEVELS: {
        basic: { quality: 70, sizes: ['xs', 'md'] },
        premium: { quality: 85, sizes: ['xs', 'md', 'lg', 'xl'] },
        enterprise: { quality: 90, sizes: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] }
    }
} as const;

/**
 * Gera um ID único premium para imóveis sem identificador
 */
const generateUniqueId = (): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 100000);
    const prefix = 'prop';
    return `${prefix}-${timestamp}-${random}`;
};

/**
 * Cache inteligente premium com TTL e limpeza automática
 */
class PremiumPropertyCache {
    private cache = new Map<string, {
        data: ProcessedPropertyData;
        timestamp: number;
        accessCount: number;
        lastAccess: number;
    }>(); set(id: string, data: ProcessedPropertyData): void {
        // Limpar cache se estiver muito grande
        if (this.cache.size >= PERFORMANCE_CONFIG.MAX_CACHE_SIZE) {
            this.cleanup();
        }

        this.cache.set(id, {
            data: {
                ...data,
                analytics: {
                    processingTime: data.analytics?.processingTime || 0,
                    cacheHit: false,
                    optimizationLevel: data.analytics?.optimizationLevel || 'premium'
                }
            },
            timestamp: Date.now(),
            accessCount: 1,
            lastAccess: Date.now()
        });
    }

    get(id: string): ProcessedPropertyData | null {
        const entry = this.cache.get(id);

        if (!entry) return null;

        // Verificar TTL
        if (Date.now() - entry.timestamp > PERFORMANCE_CONFIG.CACHE_TTL) {
            this.cache.delete(id);
            return null;
        }

        // Atualizar estatísticas de acesso
        entry.accessCount++;
        entry.lastAccess = Date.now();

        // Marcar como cache hit
        entry.data.analytics = {
            processingTime: 0,
            cacheHit: true,
            optimizationLevel: entry.data.analytics?.optimizationLevel || 'premium'
        };

        return entry.data;
    }

    has(id: string): boolean {
        const entry = this.cache.get(id);
        if (!entry) return false;

        // Verificar TTL
        if (Date.now() - entry.timestamp > PERFORMANCE_CONFIG.CACHE_TTL) {
            this.cache.delete(id);
            return false;
        }

        return true;
    }

    private cleanup(): void {
        const now = Date.now();
        const entries = Array.from(this.cache.entries());

        // Remover entradas expiradas
        entries.forEach(([id, entry]) => {
            if (now - entry.timestamp > PERFORMANCE_CONFIG.CACHE_TTL) {
                this.cache.delete(id);
            }
        });

        // Se ainda estiver muito cheio, remover as menos acessadas
        if (this.cache.size >= PERFORMANCE_CONFIG.MAX_CACHE_SIZE) {
            const sortedEntries = entries
                .filter(([_, entry]) => now - entry.timestamp <= PERFORMANCE_CONFIG.CACHE_TTL)
                .sort((a, b) => a[1].accessCount - b[1].accessCount);

            const toRemove = sortedEntries.slice(0, Math.floor(PERFORMANCE_CONFIG.MAX_CACHE_SIZE * 0.2));
            toRemove.forEach(([id]) => this.cache.delete(id));
        }
    }

    getStats() {
        const entries = Array.from(this.cache.values());
        return {
            size: this.cache.size,
            totalAccesses: entries.reduce((sum, entry) => sum + entry.accessCount, 0),
            averageAge: entries.length > 0
                ? (Date.now() - entries.reduce((sum, entry) => sum + entry.timestamp, 0) / entries.length) / 1000
                : 0
        };
    }
}

// Instância global do cache premium
const propertyCache = new PremiumPropertyCache();

/**
 * Processa um imóvel do Sanity para o formato premium esperado pelos componentes
 * com tratamento robusto de erros, validação avançada e otimizações de performance
 * 
 * @param imovel Objeto do imóvel vindo do Sanity
 * @param optimizationLevel Nível de otimização desejado
 * @returns Objeto processado premium para os componentes de UI ou null em caso de erro
 */
export function processProperty(
    imovel: any,
    optimizationLevel: 'basic' | 'premium' | 'enterprise' = 'premium'
): ProcessedPropertyData | null {
    const startTime = performance.now(); try {
        // Validação inicial robusta com logging premium
        if (!imovel || typeof imovel !== 'object') {
            console.warn('🏠 PropertyProcessor [PREMIUM]: Imóvel inválido recebido', { imovel });
            return null;
        }

        // Verificar cache usando ID como chave
        const id = imovel._id || generateUniqueId();
        const cachedProperty = propertyCache.get(id);

        if (cachedProperty) {
            return cachedProperty;
        }

        // Processamento da imagem com tratamento premium
        const imageObject = imovel.imagem || imovel.imagemPrincipal || imovel.imagemCapa;
        const processedImageData = processImage(imageObject, imovel.titulo || 'Imóvel');

        // Processamento avançado para imagens responsivas baseado no nível de otimização
        const config = PERFORMANCE_CONFIG.OPTIMIZATION_LEVELS[optimizationLevel];

        // TODO: Implementar generateResponsiveImageSet corretamente
        // const responsiveImages = generateResponsiveImageSet(imageObject, responsiveSizes);

        // Normalização premium de tipos de dados
        const price = Number(imovel.preco) || 0;
        const area = Number(imovel.areaUtil) || undefined;
        const bedrooms = Number(imovel.dormitorios) || undefined;
        const bathrooms = Number(imovel.banheiros) || undefined;
        const parkingSpots = Number(imovel.vagas) || undefined;

        // Determinação inteligente do tipo de propriedade
        const propertyType = (
            imovel.finalidade === 'Venda' ||
            imovel.tipo === 'venda' ||
            imovel.tipoNegocio === 'venda'
        ) ? 'sale' : 'rent' as PropertyType;

        // Extração robusta do slug com fallbacks múltiplos
        const slug = typeof imovel.slug === 'object' ?
            (imovel.slug?.current || imovel.slug?._key || id) :
            typeof imovel.slug === 'string' ? imovel.slug :
                imovel.titulo ? imovel.titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-') :
                    id;

        // Extrair hotspot e metadados premium da imagem
        let hotspot;
        let blurDataUrl;
        let dominantColor;

        if (imageObject && typeof imageObject === 'object') {
            // Hotspot para foco da imagem
            if (imageObject.hotspot) {
                hotspot = {
                    x: imageObject.hotspot.x || 0.5,
                    y: imageObject.hotspot.y || 0.5
                };
            }

            // Blur data URL para loading premium
            if (imageObject.metadata?.lqip) {
                blurDataUrl = imageObject.metadata.lqip;
            }

            // Cor dominante para placeholders
            if (imageObject.metadata?.palette?.dominant) {
                dominantColor = imageObject.metadata.palette.dominant.background;
            }
        }

        // Determinar status premium da propriedade
        const isHighlight = Boolean(imovel.destaque);
        const isPremium = Boolean(imovel.destaque || imovel.premium);
        const isNew = imovel.dataPublicacao ?
            (Date.now() - new Date(imovel.dataPublicacao).getTime() < 30 * 24 * 60 * 60 * 1000) :
            false;
        const isUrgent = Boolean(imovel.urgente || imovel.vendaRapida);
        const isFeatured = Boolean(imovel.featured || imovel.emDestaque);

        // Metadados premium
        const metadata = {
            createdAt: imovel.dataPublicacao ? new Date(imovel.dataPublicacao) : new Date(),
            updatedAt: imovel.dataAtualizacao ? new Date(imovel.dataAtualizacao) : new Date(),
            viewCount: Number(imovel.visualizacoes) || 0,
            popularity: Number(imovel.popularidade) || 0
        };

        // Analytics de processamento
        const processingTime = performance.now() - startTime;
        const analytics = {
            processingTime,
            cacheHit: false,
            optimizationLevel
        };

        // Construir objeto final premium
        const processedProperty: ProcessedPropertyData = {
            id,
            title: imovel.titulo || `${imovel.tipoImovel || 'Imóvel'} em ${imovel.bairro || 'Guararema'}`,
            slug,
            location: imovel.bairro || '',
            city: imovel.cidade || 'Guararema',
            price,
            propertyType,
            area,
            bedrooms,
            bathrooms,
            parkingSpots,
            mainImage: {
                url: processedImageData.url || '/images/property-placeholder.jpg',
                alt: processedImageData.alt || imovel.titulo || 'Imóvel',
                // responsive: responsiveImages,
                hotspot,
                blurDataUrl,
                dominantColor
            },
            isHighlight,
            isPremium,
            isNew,
            isUrgent,
            isFeatured,
            metadata,
            analytics
        };

        // Adicionar ao cache premium
        propertyCache.set(id, processedProperty);

        return processedProperty;

    } catch (error) {
        const processingTime = performance.now() - startTime;
        console.error('PropertyProcessor: Erro ao processar imóvel:', {
            error,
            imovel: imovel?._id || 'ID não disponível',
            processingTime: `${processingTime.toFixed(2)}ms`
        });
        return null;
    }
}

/**
 * Filtra uma lista de imóveis, removendo itens nulos com validação premium
 */
export function filterValidProperties<T>(properties: (T | null | undefined)[]): T[] {
    return properties.filter((item): item is T => {
        if (item === null || item === undefined) return false;

        // Validação adicional para objetos de propriedade
        if (typeof item === 'object' && 'id' in item) {
            return Boolean((item as any).id);
        }

        return true;
    });
}

/**
 * Processa uma lista de imóveis do Sanity com otimizações premium
 * Implementa processamento em lote, memoização e monitoramento de performance
 */
export function processProperties(
    properties: any[],
    optimizationLevel: 'basic' | 'premium' | 'enterprise' = 'premium'
): ProcessedPropertyData[] {
    const startTime = performance.now();

    if (!properties || !Array.isArray(properties)) {
        console.warn('PropertyProcessor: Lista de propriedades inválida recebida');
        return [];
    }

    // Processamento em lotes para melhor performance
    const batchSize = PERFORMANCE_CONFIG.BATCH_SIZE;
    const results: ProcessedPropertyData[] = [];

    for (let i = 0; i < properties.length; i += batchSize) {
        const batch = properties.slice(i, i + batchSize);
        const batchResults = filterValidProperties(
            batch.map(property => processProperty(property, optimizationLevel))
        );
        results.push(...batchResults);
    }

    const processingTime = performance.now() - startTime;

    if (processingTime > 1000) { // Log se demorar mais que 1 segundo
        console.info('PropertyProcessor: Processamento de lote concluído:', {
            totalProperties: properties.length,
            validProperties: results.length,
            processingTime: `${processingTime.toFixed(2)}ms`,
            cacheStats: propertyCache.getStats()
        });
    }

    return results;
}

/**
 * Hook premium para processamento eficiente de imóveis com recursos avançados
 */
export function useProcessedProperties(
    properties: any[],
    options: {
        optimizationLevel?: 'basic' | 'premium' | 'enterprise';
        enableRealTimeUpdates?: boolean;
        sortBy?: 'price' | 'date' | 'popularity' | 'relevance';
        filterBy?: {
            propertyType?: PropertyType;
            priceRange?: [number, number];
            isHighlight?: boolean;
        };
    } = {}
): {
    processedProperties: ProcessedPropertyData[];
    isLoading: boolean;
    error: string | null;
    stats: {
        total: number;
        cached: number;
        processingTime: number;
    };
} {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState({
        total: 0,
        cached: 0,
        processingTime: 0
    });

    const {
        optimizationLevel = 'premium',
        enableRealTimeUpdates = false,
        sortBy = 'relevance',
        filterBy = {}
    } = options;

    const processedProperties = useMemo(() => {
        const startTime = performance.now();
        setError(null);

        try {
            if (!properties || !Array.isArray(properties)) {
                return [];
            }

            let processed = processProperties(properties, optimizationLevel);

            // Aplicar filtros se especificados
            if (filterBy.propertyType) {
                processed = processed.filter(p => p.propertyType === filterBy.propertyType);
            }

            if (filterBy.priceRange) {
                const [min, max] = filterBy.priceRange;
                processed = processed.filter(p => p.price >= min && p.price <= max);
            }

            if (filterBy.isHighlight !== undefined) {
                processed = processed.filter(p => p.isHighlight === filterBy.isHighlight);
            }

            // Aplicar ordenação
            switch (sortBy) {
                case 'price':
                    processed.sort((a, b) => a.price - b.price);
                    break;
                case 'date':
                    processed.sort((a, b) =>
                        (b.metadata?.updatedAt?.getTime() || 0) - (a.metadata?.updatedAt?.getTime() || 0)
                    );
                    break;
                case 'popularity':
                    processed.sort((a, b) =>
                        (b.metadata?.popularity || 0) - (a.metadata?.popularity || 0)
                    );
                    break;
                case 'relevance':
                default:
                    // Ordenação por relevância: destaque > premium > novo > resto
                    processed.sort((a, b) => {
                        if (a.isHighlight && !b.isHighlight) return -1;
                        if (!a.isHighlight && b.isHighlight) return 1;
                        if (a.isPremium && !b.isPremium) return -1;
                        if (!a.isPremium && b.isPremium) return 1;
                        if (a.isNew && !b.isNew) return -1;
                        if (!a.isNew && b.isNew) return 1;
                        return 0;
                    });
                    break;
            }

            const processingTime = performance.now() - startTime;
            const cacheStats = propertyCache.getStats();

            setStats({
                total: processed.length,
                cached: cacheStats.totalAccesses,
                processingTime
            });

            return processed;

        } catch (err) {
            console.error('PropertyProcessor: Erro no hook useProcessedProperties:', err);
            setError(err instanceof Error ? err.message : 'Erro desconhecido no processamento');
            return [];
        }
    }, [properties, optimizationLevel, sortBy, JSON.stringify(filterBy)]);

    useEffect(() => {
        setIsLoading(false);
    }, [processedProperties]);

    // Real-time updates se habilitado
    useEffect(() => {
        if (!enableRealTimeUpdates) return;

        const interval = setInterval(() => {
            // Verificar se há atualizações necessárias
            const cacheStats = propertyCache.getStats();
            if (cacheStats.size !== stats.cached) {
                // Força re-render se o cache mudou
                setStats(prev => ({ ...prev, cached: cacheStats.size }));
            }
        }, 5000); // Verificar a cada 5 segundos

        return () => clearInterval(interval);
    }, [enableRealTimeUpdates, stats.cached]);

    return {
        processedProperties,
        isLoading,
        error,
        stats
    };
}

/**
 * Utilitário premium para obter estatísticas do cache
 */
export function getCacheStats() {
    return propertyCache.getStats();
}

/**
 * Utilitário para limpar o cache manualmente
 */
export function clearPropertyCache(): void {
    (propertyCache as any).cache.clear();
    console.info('PropertyProcessor: Cache limpo manualmente');
}
