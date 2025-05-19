'use client';

import { getImoveisParaAlugar } from '@/lib/sanity/fetchImoveis';
import SuperOptimizedPropertyPage from '../components/SuperOptimizedPropertyPage';
import type { ImovelClient } from '@/types/imovel-client';
import { useState, useEffect } from 'react';

interface TurboAlugarPageProps {
    preloadedProperties?: ImovelClient[];
}

/**
 * Tipo ImovelSimplificado que corresponde exatamente ao tipo esperado pelo SuperOptimizedPropertyPage
 */
interface ImovelSimplificado {
    id: string;
    titulo: string;
    slug: string;
    bairro?: string;
    cidade?: string;
    preco: number;
    finalidade: 'Aluguel' | 'Venda';
    areaUtil?: number;
    dormitorios?: number;
    banheiros?: number;
    vagas?: number;
    imagem?: {
        url: string;
        alt?: string;
        blurDataUrl?: string;
    };
    destaque?: boolean;
    dataPublicacao?: string;
}

/**
 * Adapta os imóveis do formato ImovelClient para o formato ImovelSimplificado
 * necessário para o componente SuperOptimizedPropertyPage
 */
const adaptImovelToSimplificado = (imoveis: ImovelClient[]): ImovelSimplificado[] => {
    return imoveis.map(imovel => {
        // Garante que finalidade seja apenas 'Aluguel' ou 'Venda'
        const finalidade = imovel.finalidade === 'Venda' ? 'Venda' : 'Aluguel';

        return {
            id: imovel._id, // Mapeia _id para id
            titulo: imovel.titulo || '',
            slug: typeof imovel.slug === 'string' ? imovel.slug : '',
            bairro: imovel.bairro,
            cidade: imovel.cidade,
            preco: imovel.preco || 0,
            finalidade, // Já garantido como 'Aluguel' ou 'Venda'
            areaUtil: imovel.areaUtil,
            dormitorios: imovel.dormitorios,
            banheiros: imovel.banheiros,
            vagas: imovel.vagas,
            imagem: imovel.imagem ? {
                url: imovel.imagem.url || '',
                alt: imovel.imagem.alt,
                blurDataUrl: imovel.imagem.imagemUrl
            } : undefined,
            destaque: imovel.destaque,
            dataPublicacao: undefined
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
export default function TurboAlugarPage({ preloadedProperties }: TurboAlugarPageProps) {
    // Estado para armazenar os dados pré-carregados
    const [fetchFunction, setFetchFunction] = useState(() => {
        if (preloadedProperties) {
            // Se temos dados pré-carregados, usamos uma função que os retorna imediatamente
            // e os adaptamos para o formato esperado
            return () => Promise.resolve(adaptImovelToSimplificado(preloadedProperties));
        } else {
            // Caso contrário, usamos a função normal de fetch com adaptador
            return async () => {
                const imoveis = await getImoveisParaAlugar();
                return adaptImovelToSimplificado(imoveis);
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
