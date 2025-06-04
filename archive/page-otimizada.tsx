import { Suspense } from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

// === IMPORTS DE DADOS SSR ===
import { getImoveisDestaque, getImoveisDestaqueVenda, getImoveisAluguel } from '@/lib/queries';
import { normalizeDocuments } from '@/lib/sanity-utils';
import type { ImovelClient } from '@/src/types/imovel-client';

// === IMPORT DINÂMICO DO COMPONENTE PRINCIPAL ===
const PaginaInicialOtimizada = dynamic(() => import('./components/PaginaInicialOtimizada'), {
    loading: () => (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="text-4xl lg:text-5xl font-bold text-white">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white">
                        Nova Ipê
                    </span>
                </div>
                <div className="text-xl text-blue-100">
                    Carregando experiência premium...
                </div>
                <div className="flex justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"
                            style={{
                                animationDelay: `${i * 200}ms`,
                                animationDuration: '1s'
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    ),
    ssr: false // Client-side only para evitar hydration issues
});

// === METADATA OTIMIZADA ===
export const metadata: Metadata = {
    title: 'Nova Ipê - Imóveis Premium em Guararema e Região | Compra, Venda e Locação',
    description: 'Encontre seu imóvel ideal em Guararema com a Nova Ipê. Especialistas em compra, venda e locação de imóveis residenciais e comerciais. Experiência premium garantida.',
    keywords: 'imóveis guararema, casas venda guararema, apartamentos aluguel, nova ipê imóveis, corretora guararema',
    authors: [{ name: 'Nova Ipê Imóveis' }],
    creator: 'Nova Ipê Imóveis',
    publisher: 'Nova Ipê Imóveis',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://novaipe.com.br'),
    alternates: {
        canonical: '/',
        languages: {
            'pt-BR': '/',
        },
    },
    openGraph: {
        title: 'Nova Ipê - Imóveis Premium em Guararema e Região',
        description: 'Encontre seu imóvel ideal em Guararema com a Nova Ipê. Experiência premium em compra, venda e locação.',
        url: '/',
        siteName: 'Nova Ipê Imóveis',
        images: [
            {
                url: '/images/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Nova Ipê Imóveis - Guararema',
            },
        ],
        locale: 'pt_BR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Nova Ipê - Imóveis Premium em Guararema',
        description: 'Encontre seu imóvel ideal em Guararema com a Nova Ipê.',
        images: ['/images/og-image.jpg'],
    },
    robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'your-google-verification-code',
    },
};

// === FUNÇÃO PARA PROCESSAR DADOS DO SANITY ===
async function processImoveisData() {
    try {
        // Buscar dados em paralelo para melhor performance
        const [imoveisDestaque, imoveisVenda, imoveisAluguel] = await Promise.all([
            getImoveisDestaque().catch(() => []),
            getImoveisDestaqueVenda().catch(() => []),
            getImoveisAluguel().catch(() => [])
        ]);

        // Normalizar documentos
        const normalizedDestaque = normalizeDocuments(imoveisDestaque || []);
        const normalizedVenda = normalizeDocuments(imoveisVenda || []);
        const normalizedAluguel = normalizeDocuments(imoveisAluguel || []);

        return {
            imoveisDestaque: normalizedDestaque,
            imoveisVenda: normalizedVenda,
            imoveisAluguel: normalizedAluguel
        };
    } catch (error) {
        console.error('Erro ao carregar dados dos imóveis:', error);
        return {
            imoveisDestaque: [],
            imoveisVenda: [],
            imoveisAluguel: []
        };
    }
}

// === COMPONENTE PRINCIPAL DA PÁGINA ===
export default async function HomePage() {
    // Carregar dados no servidor (SSR)
    const { imoveisDestaque, imoveisVenda, imoveisAluguel } = await processImoveisData();

    return (
        <div className="min-h-screen bg-white">
            {/* Suspense boundary para componentes que podem falhar */}
            <Suspense
                fallback={
                    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
                        <div className="text-center space-y-4">
                            <div className="text-4xl lg:text-5xl font-bold text-white">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white">
                                    Nova Ipê
                                </span>
                            </div>
                            <div className="text-xl text-blue-100">
                                Preparando experiência premium...
                            </div>
                            <div className="w-64 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                }
            >
                <PaginaInicialOtimizada
                    imoveisDestaque={imoveisDestaque}
                    imoveisVenda={imoveisVenda}
                    imoveisAluguel={imoveisAluguel}
                />
            </Suspense>
        </div>
    );
}

// === CONFIGURAÇÕES DE PERFORMANCE ===
export const runtime = 'edge'; // Edge runtime para melhor performance
export const revalidate = 3600; // Revalidar a cada hora
