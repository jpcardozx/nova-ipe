'use client';

import { getImoveisParaVenda } from '@/lib/sanity/fetchImoveis';
import SuperOptimizedPropertyPage from '../components/SuperOptimizedPropertyPage';
import type { ImovelClient } from '@/types/imovel-client';
import { useState, useEffect } from 'react';

interface TurboComprarPageProps {
    preloadedProperties?: ImovelClient[];
}

/**
 * TurboComprarPage - Nova versão ultra otimizada da página de compra
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
export default function TurboComprarPage({ preloadedProperties }: TurboComprarPageProps) {
    // Estado para armazenar os dados pré-carregados
    const [fetchFunction] = useState(() => {
        if (preloadedProperties) {
            // Se temos dados pré-carregados, usamos uma função que os retorna imediatamente
            return () => Promise.resolve(preloadedProperties.map(imovel => {
                // Convertendo finalidade para garantir que seja apenas 'Venda' ou 'Aluguel'
                const finalidade = imovel.finalidade === 'Temporada' ? 'Venda' : (imovel.finalidade || 'Venda');
                
                return {
                    id: imovel._id,
                    titulo: imovel.titulo || '',
                    slug: imovel.slug,
                    preco: imovel.preco || 0,
                    finalidade: finalidade as 'Venda' | 'Aluguel',
                    bairro: imovel.bairro,
                    cidade: imovel.cidade,
                    areaUtil: imovel.areaUtil,
                    dormitorios: imovel.dormitorios,
                    banheiros: imovel.banheiros,
                    vagas: imovel.vagas,
                    destaque: imovel.destaque,
                    dataPublicacao: imovel.dataPublicacao,
                    imagem: imovel.imagem ? {
                        url: imovel.imagem.url,
                        alt: imovel.imagem.alt || '',
                        blurDataUrl: imovel.imagem.alt || undefined
                    } : undefined
                };
            }));
        } else {
            // Caso contrário, usamos a função normal de fetch e mapeamos o resultado
            return async () => {
                const imoveis = await getImoveisParaVenda();
                return imoveis.map(imovel => {
                    // Convertendo finalidade para garantir que seja apenas 'Venda' ou 'Aluguel'
                    const finalidade = imovel.finalidade === 'Temporada' ? 'Venda' : (imovel.finalidade || 'Venda');
                    
                    return {
                        id: imovel._id,
                        titulo: imovel.titulo || '',
                        slug: imovel.slug,
                        preco: imovel.preco || 0,
                        finalidade: finalidade as 'Venda' | 'Aluguel',
                        bairro: imovel.bairro,
                        cidade: imovel.cidade,
                        areaUtil: imovel.areaUtil,
                        dormitorios: imovel.dormitorios,
                        banheiros: imovel.banheiros,
                        vagas: imovel.vagas,
                        destaque: imovel.destaque,
                        dataPublicacao: imovel.dataPublicacao,
                        imagem: imovel.imagem ? {
                            url: imovel.imagem.url,
                            alt: imovel.imagem.alt || '',
                            blurDataUrl: imovel.imagem.alt || undefined
                        } : undefined
                    };
                });
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
            pageTitle="Imóveis à Venda"
            pageDescription="Encontre o imóvel dos seus sonhos para comprar em Guararema e região com excelente valorização e localização."
            fetchPropertiesFunction={fetchFunction}
            propertyType="sale"
            usingPreloadedData={Boolean(preloadedProperties)}
        />
    );
}