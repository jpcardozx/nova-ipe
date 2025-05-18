'use client';

import { useState, useEffect, useMemo } from 'react';
import { processImage, getImageUrl, getImageAlt } from '@/lib/sanity-image-helper';
import type { PropertyType } from './OptimizedPropertyCard';
import { generateResponsiveImageSet } from '@/lib/responsive-images';

/**
 * Interface para o tipo de dados de imóvel depois de processados
 * para uso nos componentes de UI
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
    };
    isHighlight: boolean;
    isPremium: boolean;
    isNew: boolean;
}

/**
 * Gera um ID único para imóveis sem identificador
 */
const generateUniqueId = (): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `property-${timestamp}-${random}`;
};

// Cache local para evitar reprocessamento desnecessário de imóveis
// usando ID como chave
const propertyCache = new Map<string, ProcessedPropertyData>();

/**
 * Processa um imóvel do Sanity para o formato esperado pelos componentes
 * com tratamento robusto de erros e validação
 * 
 * @param imovel Objeto do imóvel vindo do Sanity
 * @returns Objeto processado para os componentes de UI ou null em caso de erro
 */
export function processProperty(imovel: any): ProcessedPropertyData | null {
    try {
        // Validação inicial
        if (!imovel || typeof imovel !== 'object') {
            return null;
        }

        // Verificar cache usando ID como chave
        const id = imovel._id || generateUniqueId();
        if (propertyCache.has(id)) {
            return propertyCache.get(id)!;
        }

        // Processamento da imagem com tratamento robusto
        const imageObject = imovel.imagem || imovel.imagemPrincipal || imovel.imagemCapa;

        // Processamento básico para retrocompatibilidade
        const processedImageData = processImage(imageObject, imovel.titulo || 'Imóvel');

        // Processamento avançado para imagens responsivas
        const responsiveImages = generateResponsiveImageSet(imageObject, {
            'xs': { width: 320, quality: 70 },
            'md': { width: 768, quality: 80 },
            'lg': { width: 1200, quality: 85 }
        });

        // Normalização de tipos de dados (usando operadores nullish para valores default melhores)
        const price = Number(imovel.preco) || 0;
        const area = Number(imovel.areaUtil) || undefined;
        const bedrooms = Number(imovel.dormitorios) || undefined;
        const bathrooms = Number(imovel.banheiros) || undefined;
        const parkingSpots = Number(imovel.vagas) || undefined;

        // Determinação do tipo de propriedade
        const propertyType = (imovel.finalidade === 'Venda' ? 'sale' : 'rent') as PropertyType;

        // Extração do slug com suporte para múltiplos formatos
        const slug = typeof imovel.slug === 'object' ? (imovel.slug?.current || id) :
            typeof imovel.slug === 'string' ? imovel.slug : id;        // Extrair hotspot da imagem se existir
        let hotspot;
        if (imageObject && typeof imageObject === 'object' && imageObject.hotspot) {
            hotspot = {
                x: imageObject.hotspot.x,
                y: imageObject.hotspot.y
            };
        }

        // Construir objeto final
        const processedProperty = {
            id,
            title: imovel.titulo || 'Imóvel disponível',
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
                ...processedImageData,
                responsive: responsiveImages,
                hotspot
            },
            isHighlight: Boolean(imovel.destaque),
            isPremium: Boolean(imovel.destaque),
            isNew: imovel.dataPublicacao ?
                (new Date().getTime() - new Date(imovel.dataPublicacao).getTime() < 7 * 24 * 60 * 60 * 1000) :
                false,
        };

        // Adicionar ao cache
        propertyCache.set(id, processedProperty);

        return processedProperty;
    } catch (error) {
        console.error('Erro ao processar imóvel:', error);
        return null;
    }
}

/**
 * Filtra uma lista de imóveis, removendo itens nulos
 */
export function filterValidProperties<T>(properties: (T | null | undefined)[]): T[] {
    return properties.filter((item): item is T => item !== null && item !== undefined);
}

/**
 * Processa uma lista de imóveis do Sanity, tratando erros e filtrando inválidos
 * Implementa memoização para evitar processamento repetitivo
 */
export function processProperties(properties: any[]): ProcessedPropertyData[] {
    return filterValidProperties(
        properties.map(property => processProperty(property))
    );
}

/**
 * Hook para processamento eficiente de imóveis com memoização
 */
export function useProcessedProperties(properties: any[]): {
    processedProperties: ProcessedPropertyData[];
    isLoading: boolean;
} {
    const [isLoading, setIsLoading] = useState(true);

    const processedProperties = useMemo(() => {
        if (!properties || !Array.isArray(properties)) return [];
        return processProperties(properties);
    }, [properties]);

    useEffect(() => {
        setIsLoading(false);
    }, [processedProperties]);

    return { processedProperties, isLoading };
}
