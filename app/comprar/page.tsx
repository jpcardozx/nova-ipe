// app/comprar/page.tsx
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { getPreloadedPropertiesForSale, isFreshData } from '../utils/data-prefetcher';
import { PerformanceMonitorInitializer } from '../utils/performance-monitor-advanced';

// VERSÃO TURBO: Usa o componente super otimizado para correção dos problemas de performance 
// - LCP (Largest Contentful Paint): 78056ms (ideal <2500ms)
// - Bloqueio da thread principal: 57778ms
// - Tempo de carregamento da página: ~6860ms
const TurboComprarPage = dynamic(() => import('./TurboComprarPage'), {
    ssr: true,
});

// Export metadata for better SEO
export const metadata = {
    title: "Comprar | Ipê Imóveis",
    description: "Encontre imóveis para compra em Guararema e região. Casas, apartamentos e terrenos com excelente valorização.",
    // Additional metadata for better SEO
    openGraph: {
        title: "Imóveis à Venda | Ipê Imóveis",
        description: "Encontre o imóvel dos seus sonhos para comprar em Guararema e região. Casas, apartamentos e terrenos com excelente valorização e localização.",
        type: "website",
    },
};

// Increase revalidation time to reduce Sanity API calls
export const revalidate = 3600; // 1 hour

/**
 * Componente de página com otimizações RSC (React Server Components)
 * 
 * Implementa:
 * 1. Precarregamento de dados no servidor (Server-side data prefetching)
 * 2. Suspense boundaries para carregamento progressivo
 * 3. Streaming SSR para primeiros bytes rápidos
 */
export default async function Page() {
    // Pré-carregar os dados no servidor antes de renderizar o cliente
    const preloadedData = await getPreloadedPropertiesForSale();

    return (
        <>
            {/* Inicializar monitoramento de performance */}
            <PerformanceMonitorInitializer />

            {/* 
             * Renderizar versão otimizada da página
             * Passando dados pré-carregados do servidor quando disponíveis e válidos
             */}
            <Suspense fallback={<PropertyPageSkeleton />}>
                <TurboComprarPage preloadedProperties={
                    await isFreshData(preloadedData.timestamp) ? preloadedData.data : undefined
                } />
            </Suspense>
        </>
    );
}

// Esqueleto otimizado para ser exibido durante o carregamento
function PropertyPageSkeleton() {
    return (
        <div className="pt-28 pb-20 bg-neutral-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-6">
                <div className="animate-pulse">
                    <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto mb-4" />
                    <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto mb-10" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array(6).fill(0).map((_, i) => (
                            <div key={i} className="bg-white rounded-xl shadow overflow-hidden">
                                <div className="h-48 bg-gray-200" />
                                <div className="p-4">
                                    <div className="h-6 bg-gray-200 rounded mb-4" />
                                    <div className="h-4 bg-gray-100 rounded w-2/3 mb-3" />
                                    <div className="h-8 bg-gray-100 rounded mt-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
