'use client';

import { getImoveisParaAlugar } from '@lib/sanity/fetchImoveis';
import SuperOptimizedPropertyPage from '../components/SuperOptimizedPropertyPage';
import type { ImovelClient } from '../../src/types/imovel-client';
import type { ImovelClientType } from '../../types/imovel';
import { useState, useEffect } from 'react';

interface TurboAlugarPageProps {
    preloadedProperties?: ImovelClient[];
}

/**
 * Adapta os imóveis do formato ImovelClient para o formato ImovelClientType
 * necessário para o componente SuperOptimizedPropertyPage
 */
const adaptImovelToClientType = (imoveis: ImovelClient[]): ImovelClientType[] => {
    return imoveis.map(imovel => {
        // Garante que propertyType seja apenas 'rent' ou 'sale'
        const propertyType = imovel.finalidade === 'Venda' ? 'sale' : 'rent';

        return {
            id: imovel._id, // Mapeia _id para id
            title: imovel.titulo || '',
            slug: typeof imovel.slug === 'string' ? imovel.slug : '',
            location: imovel.bairro || '',
            city: imovel.cidade,
            price: imovel.preco || 0,
            propertyType, // Já garantido como 'rent' ou 'sale'
            area: imovel.areaUtil,
            bedrooms: imovel.dormitorios,
            bathrooms: imovel.banheiros,
            parkingSpots: imovel.vagas,
            mainImage: {
                url: imovel.imagem?.imagemUrl || '',
                alt: imovel.imagem?.alt || imovel.titulo || '',
                blurDataUrl: imovel.imagem?.imagemUrl
            },
            isHighlight: imovel.destaque,
            status: 'available'
        };
    });
};

/**
 * TurboAlugarPage - Nova versão ultra otimizada da página de aluguel
 * 
 * Implementa as melhores práticas de performance para resolver os problemas críticos:
 * - LCP (Largest Contentful Paint): 78056ms
 * - Bloqueio da thread principal: 57778ms
 * - Tempo de carregamento da página: ~6860ms
 * 
 * Melhorias v2:
 * - Suporte para dados pré-carregados do servidor
 * - Integração com React Server Components
 * - Suspense estratégico para streaming de UI
 */
export default function TurboAlugarPage({ preloadedProperties }: TurboAlugarPageProps) {    // Estado para armazenar os dados pré-carregados
    const [fetchFunction, setFetchFunction] = useState(() => {
        if (preloadedProperties) {
            // Se temos dados pré-carregados, usamos uma função que os retorna imediatamente
            // e os adaptamos para o formato esperado
            return () => Promise.resolve(adaptImovelToClientType(preloadedProperties));
        } else {
            // Caso contrário, usamos a função normal de fetch com adaptador
            return async () => {
                const imoveis = await getImoveisParaAlugar();
                return adaptImovelToClientType(imoveis);
            };
        }
    });

    // Sempre log o status do pré-carregamento em desenvolvimento
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            if (preloadedProperties) {
                console.log(`[Performance] Usando ${preloadedProperties.length} imóveis pré-carregados do servidor`);
            } else {
                console.log('[Performance] Sem dados pré-carregados disponíveis, fazendo fetch no cliente');
            }
        }
    }, [preloadedProperties]);

    return (
        <SuperOptimizedPropertyPage
            pageTitle="Imóveis para Alugar"
            pageDescription="Confira imóveis disponíveis para aluguel com ótimas condições, localização privilegiada e segurança."
            fetchPropertiesFunction={fetchFunction}
            propertyType="rent"
            usingPreloadedData={Boolean(preloadedProperties)}
        />
    );
}
