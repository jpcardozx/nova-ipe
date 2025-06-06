import React from 'react';
import { Suspense } from 'react';
import { UnifiedLoading } from '../ui/UnifiedComponents';
import { getHeroData } from '@/lib/server-data';

/**
 * Server Component para Hero Section
 * Busca dados no servidor e renderiza componente client
 */

// Tipos para dados do hero (server-side)
interface HeroServerData {
    marketMetrics: {
        id: string;
        title: string;
        value: string;
        subtitle: string;
        growth?: number;
    }[];
    neighborhoods: {
        name: string;
        priceRange: string;
        characteristics: string;
        distance: string;
        highlight: string;
    }[];
    stats: {
        totalProperties: number;
        soldThisYear: number;
        averagePrice: string;
        clientSatisfaction: number;
    };
}

// Função para buscar dados do hero no servidor
async function fetchHeroData(): Promise<HeroServerData> {
    try {
        // Dados em cache para performance
        return {
            marketMetrics: [
                {
                    id: 'growth',
                    title: 'Valorização Imóveis',
                    value: '9.4%',
                    subtitle: 'média anual em Guararema',
                    growth: 9.4
                },
                {
                    id: 'properties',
                    title: 'Imóveis Disponíveis',
                    value: '120+',
                    subtitle: 'casas e apartamentos'
                },
                {
                    id: 'sales',
                    title: 'Vendas Realizadas',
                    value: '350+',
                    subtitle: 'nos últimos 2 anos'
                },
                {
                    id: 'satisfaction',
                    title: 'Satisfação',
                    value: '98%',
                    subtitle: 'dos nossos clientes'
                }
            ],
            neighborhoods: [
                {
                    name: 'Centro',
                    priceRange: 'R$ 280k - 450k',
                    characteristics: 'Comércio próximo, infraestrutura completa',
                    distance: '0km do centro',
                    highlight: 'Localização privilegiada'
                },
                {
                    name: 'Jardim das Flores',
                    priceRange: 'R$ 320k - 580k',
                    characteristics: 'Área nobre, casas grandes, muito verde',
                    distance: '2km do centro',
                    highlight: 'Qualidade de vida'
                },
                {
                    name: 'Portal da Montanha',
                    priceRange: 'R$ 400k - 750k',
                    characteristics: 'Condomínios fechados, segurança 24h',
                    distance: '3km do centro',
                    highlight: 'Máxima segurança'
                }
            ],
            stats: {
                totalProperties: 127,
                soldThisYear: 89,
                averagePrice: 'R$ 420.000',
                clientSatisfaction: 98
            }
        };
    } catch (error) {
        console.error('Error fetching hero data:', error);
        // Return fallback data
        return {
            marketMetrics: [],
            neighborhoods: [],
            stats: {
                totalProperties: 0,
                soldThisYear: 0,
                averagePrice: 'R$ 0',
                clientSatisfaction: 0
            }
        };
    }
}

// Server Component principal
export default async function HeroServer() {
    const heroData = await fetchHeroData();

    return (
        <div id="hero-server-container" data-hero-data={JSON.stringify(heroData)}>
            <Suspense fallback={
                <UnifiedLoading
                    variant="detailed"
                    height="80vh"
                    title="Carregando seção principal..."
                />
            }>
                {/* O componente client será hidratado aqui */}
                <div className="min-h-[80vh] bg-gradient-to-br from-slate-50 to-amber-50/30">
                    {/* Conteúdo estático para SEO */}
                    <div className="max-w-7xl mx-auto px-6 py-20">
                        <div className="text-center space-y-6">
                            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 leading-tight">
                                Encontre o <span className="text-amber-600">Imóvel dos seus Sonhos</span> em Guararema
                            </h1>
                            <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
                                Especialistas em imóveis de alto padrão com mais de 15 anos de experiência no mercado de Guararema e região.
                            </p>

                            {/* Métricas básicas para SEO */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                                {heroData.marketMetrics.map((metric) => (
                                    <div key={metric.id} className="text-center p-4 bg-white/60 rounded-xl">
                                        <div className="text-2xl font-bold text-amber-600">{metric.value}</div>
                                        <div className="text-sm text-neutral-600">{metric.subtitle}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Suspense>
        </div>
    );
}

// Export para uso em outras páginas
export type { HeroServerData };
