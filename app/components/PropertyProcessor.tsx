'use client';

import React from 'react';
import { processImage } from '@/lib/sanity-image-helper';
import type { PropertyType } from './OptimizedPropertyCard';

// Declare global custom property for unique counter
declare global {
    interface Window {
        __PROPERTY_COUNTER?: number;
    }
}

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
    };
    isHighlight: boolean;
    isPremium: boolean;
    isNew: boolean;
}

/**
 * Processa um imóvel do Sanity para o formato esperado pelos componentes
 * com tratamento robusto de erros e validação
 * 
 * @param imovel Objeto do imóvel vindo do Sanity
 * @param propertyType Tipo da propriedade (venda/aluguel)
 * @returns Objeto processado para os componentes de UI ou null em caso de erro
 */
export function processProperty(imovel: any): ProcessedPropertyData | null {
    try {
        // Validação inicial
        if (!imovel || typeof imovel !== 'object') {
            console.error('Objeto de imóvel inválido ou não definido');
            return null;
        }        // Identificar o imóvel para logs        // Use a combination of timestamp and a unique counter to avoid duplicate keys
        let uniqueCounter = 0;
        if (typeof window !== 'undefined') {
            // Client-side execution
            uniqueCounter = (window.__PROPERTY_COUNTER = (window.__PROPERTY_COUNTER || 0) + 1);
        } else {
            // Server-side execution
            uniqueCounter = Math.floor(Math.random() * 1000000);
        }
        const id = imovel._id || `property-${Date.now()}-${uniqueCounter}`;
        console.log(`Processando imóvel: ${id}`);

        // Verificar estrutura básica para diagnóstico
        console.log('Diagnóstico do imóvel:', {
            hasId: !!imovel._id,
            hasTitle: !!imovel.titulo,
            hasImage: !!imovel.imagem,
            hasSlug: !!imovel.slug,
            imageType: imovel.imagem ? typeof imovel.imagem : 'undefined',
            finalidade: imovel.finalidade || 'Não definida'
        });        // 1. Processamento da imagem (usando nosso helper robusto)
        let imageToProcess = imovel.imagem;

        // Logging detalhado da estrutura da imagem
        console.log(`[PropertyProcessor] Estrutura de imagem para imóvel ${id}:`,
            JSON.stringify(imageToProcess, null, 2));

        // Recuperação robusta de imagem com múltiplas estratégias
        if (!imageToProcess || (typeof imageToProcess === 'object' && !imageToProcess.asset)) {
            // Estratégia 1: Buscar em campos alternativos
            if (imovel.imagemPrincipal) {
                console.log(`[PropertyProcessor] Usando imagemPrincipal para imóvel ${id}`);
                imageToProcess = imovel.imagemPrincipal;
            } else if (imovel.imagemCapa) {
                console.log(`[PropertyProcessor] Usando imagemCapa para imóvel ${id}`);
                imageToProcess = imovel.imagemCapa;
            } else if (imovel.imagens && Array.isArray(imovel.imagens) && imovel.imagens.length > 0) {
                console.log(`[PropertyProcessor] Usando primeira imagem do array para imóvel ${id}`);
                imageToProcess = imovel.imagens[0];
            }

            // Estratégia 2: Reconstruir objeto caso só tenha alt ou esteja incompleto
            if (!imageToProcess || !imageToProcess.asset) {
                // Verificar se temos ao menos alguma informação para trabalhar
                const hasAlt = imageToProcess?.alt || imovel.titulo;

                console.log(`[PropertyProcessor] Reconstruindo objeto de imagem para imóvel ${id}`);

                // Reconstruir com valores mínimos necessários
                imageToProcess = {
                    _type: 'image',
                    alt: hasAlt || 'Imóvel disponível',
                    asset: {
                        _type: 'sanity.imageAsset',
                        _ref: ''  // Sem referência, cairá no fallback
                    }
                };
            }
        }

        // Verificação adicional para garantir que temos uma estrutura minimamente válida
        if (!imageToProcess.asset && imageToProcess.url) {
            // Se temos URL mas não asset, criar uma estrutura compatível
            imageToProcess = {
                ...imageToProcess,
                _type: 'image',
                asset: {
                    _type: 'sanity.imageAsset',
                    url: imageToProcess.url
                }
            };
        }

        const processedImageData = processImage(
            imageToProcess,
            imovel.titulo || 'Imóvel'
        );

        // 2. Validação e conversão de tipos numéricos
        const price = typeof imovel.preco === 'number' ? imovel.preco :
            typeof imovel.preco === 'string' ? parseFloat(imovel.preco) || 0 : 0;

        const area = typeof imovel.areaUtil === 'number' ? imovel.areaUtil :
            typeof imovel.areaUtil === 'string' ? parseFloat(imovel.areaUtil) || undefined : undefined;

        const bedrooms = typeof imovel.dormitorios === 'number' ? imovel.dormitorios :
            typeof imovel.dormitorios === 'string' ? parseInt(imovel.dormitorios, 10) || undefined : undefined;

        const bathrooms = typeof imovel.banheiros === 'number' ? imovel.banheiros :
            typeof imovel.banheiros === 'string' ? parseInt(imovel.banheiros, 10) || undefined : undefined;

        const parkingSpots = typeof imovel.vagas === 'number' ? imovel.vagas :
            typeof imovel.vagas === 'string' ? parseInt(imovel.vagas, 10) || undefined : undefined;

        // 3. Determinação do tipo de propriedade
        const propertyType = (imovel.finalidade === 'Venda' ? 'sale' : 'rent') as PropertyType;

        // 4. Extração do slug (suporte para múltiplos formatos)
        const slug = typeof imovel.slug === 'object' ? (imovel.slug?.current || id) :
            typeof imovel.slug === 'string' ? imovel.slug : id;

        // 5. Construção do objeto final
        return {
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
            mainImage: processedImageData,
            isHighlight: Boolean(imovel.destaque),
            isPremium: Boolean(imovel.destaque),
            isNew: propertyType === 'rent' && Math.random() > 0.7,
        };
    } catch (error) {
        console.error('Erro ao processar imóvel:', error);
        return null;
    }
}

/**
 * Filtra uma lista de imóveis, removendo itens nulos
 * 
 * @param properties Lista de imóveis possivelmente com nulos
 * @returns Lista filtrada apenas com imóveis válidos
 */
export function filterValidProperties<T>(properties: (T | null | undefined)[]): T[] {
    return properties.filter((item): item is T => item !== null && item !== undefined);
}

/**
 * Processa uma lista de imóveis do Sanity, tratando erros e filtrando inválidos
 * 
 * @param properties Lista de imóveis do Sanity
 * @returns Lista processada e filtrada
 */
export function processProperties(properties: any[]): ProcessedPropertyData[] {
    // Mapeia e filtra em uma operação
    return filterValidProperties(
        properties.map(property => processProperty(property))
    );
}
