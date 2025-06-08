import { Metadata } from 'next';
import { Suspense } from 'react';
import { getImoveisDestaque, getImoveisDestaqueVenda, getImoveisAluguel } from '@/lib/queries';
import { normalizeDocuments } from '@/lib/sanity-utils';
import { loadImage } from '@/lib/enhanced-image-loader';
import type { ImovelClient } from '@/src/types/imovel-client';
import { PropertyType } from './components/ui/property/PropertyCardUnified';
import { extractSlugString, ensureNonNullProperties } from '@/app/PropertyTypeFix';
import { ProcessedProperty } from './types/property';

// Importações server-side otimizadas
import SkipToContent from './components/SkipToContent';
import SectionHeader from './components/ui/SectionHeader';
import FooterAprimorado from './sections/FooterAprimorado';
import { UnifiedLoading } from './components/ui/UnifiedComponents';

// Importação do Client Component principal
import HomePageClient from './page-client';

// === SSR UTILITY FUNCTIONS ===
function transformPropertyData(imovel: ImovelClient, propertyType: PropertyType): ProcessedProperty | null {
    try {
        if (!imovel || !imovel._id) return null;

        const processedImage = loadImage(
            imovel.imagem,
            '/images/property-placeholder.jpg',
            imovel.titulo || 'Imóvel'
        );

        const slug = extractSlugString(imovel.slug);
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

        return {
            _id: imovel._id,
            id: imovel._id,
            titulo: imovel.titulo || 'Imóvel disponível',
            title: imovel.titulo || 'Imóvel disponível',
            tipo: propertyType,
            propertyType,
            preco: imovel.preco || 0,
            price: imovel.preco || 0,
            descricao: imovel.descricao || '',
            description: imovel.descricao || '',
            localizacao: imovel.bairro || 'Guararema',
            location: imovel.bairro || 'Guararema',
            imagens: [],
            quartos: imovel.dormitorios,
            bedrooms: imovel.dormitorios,
            banheiros: imovel.banheiros,
            bathrooms: imovel.banheiros,
            area: imovel.areaUtil,
            garagem: Boolean(imovel.vagas),
            parkingSpots: imovel.vagas,
            slug: { current: slug || `imovel-${imovel._id}` },
            categoria: propertyType === 'sale' ? 'venda' : 'aluguel',
            destaque: Boolean(imovel.destaque),
            featured: Boolean(imovel.destaque),
            isPremium: Boolean(imovel.destaque),
            isNew: Boolean(imovel.dataPublicacao && new Date(imovel.dataPublicacao) > new Date(thirtyDaysAgo)),
            mainImage: {
                url: processedImage.url,
                alt: processedImage.alt
            },
            isHighlight: Boolean(imovel.destaque)
        };
    } catch (error) {
        console.error(`Erro ao transformar imóvel: ${error}`);
        return null;
    }
}

// === SEO METADATA ===
export const metadata: Metadata = {
    title: 'Ipê Imóveis | Investimentos Imobiliários Premium em Guararema',
    description: 'Há 15 anos criando legados familiares através de investimentos imobiliários inteligentes em Guararema. Assessoria especializada em propriedades de alto padrão.',
    keywords: 'imóveis guararema, investimento imobiliário, casas alto padrão guararema, imobiliária premium, ipê imóveis',
    openGraph: {
        title: 'Ipê Imóveis - Investimentos Imobiliários Premium',
        description: 'Assessoria especializada em propriedades de alto padrão em Guararema',
        type: 'website',
        locale: 'pt_BR',
        siteName: 'Ipê Imóveis',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Ipê Imóveis - Investimentos Premium',
        description: 'Encontre o imóvel perfeito em Guararema',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

// === MAIN COMPONENT ===
export default async function HomePage() {
    // Busca de dados em paralelo com tratamento de erros
    let imoveisDestaque: ImovelClient[] = [];
    let imoveisAluguel: ImovelClient[] = [];
    let imoveisDestaqueGeral: ImovelClient[] = [];

    try {
        const [destaqueResult, aluguelResult, destaqueGeralResult] = await Promise.allSettled([
            getImoveisDestaqueVenda(),
            getImoveisAluguel(),
            getImoveisDestaque()
        ]);

        if (destaqueResult.status === 'fulfilled') {
            imoveisDestaque = destaqueResult.value;
        }
        if (aluguelResult.status === 'fulfilled') {
            imoveisAluguel = aluguelResult.value;
        }
        if (destaqueGeralResult.status === 'fulfilled') {
            imoveisDestaqueGeral = destaqueGeralResult.value;
        }
    } catch (error) {
        console.error('Erro ao buscar imóveis:', error);
    }

    // Processamento otimizado dos dados
    const destaqueNormalizados = normalizeDocuments(imoveisDestaque) || [];
    const aluguelNormalizados = normalizeDocuments(imoveisAluguel) || [];
    const destaqueGeralNormalizados = normalizeDocuments(imoveisDestaqueGeral) || [];

    const propertiesForSale = ensureNonNullProperties(
        destaqueNormalizados
            .map((imovel) => transformPropertyData(imovel, 'sale'))
            .filter((item): item is ProcessedProperty => item !== null)
    );

    const propertiesForRent = ensureNonNullProperties(
        aluguelNormalizados
            .map((imovel) => transformPropertyData(imovel, 'rent'))
            .filter((item): item is ProcessedProperty => item !== null)
    );

    const featuredProperties = ensureNonNullProperties(
        destaqueGeralNormalizados
            .map((imovel) => transformPropertyData(imovel, imovel.finalidade === 'Aluguel' ? 'rent' : 'sale'))
            .filter((item): item is ProcessedProperty => item !== null)
    );

    return (
        <>
            {/* SEO Schema Markup */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "RealEstateAgent",
                        "name": "Ipê Imóveis",
                        "description": "Investimentos Imobiliários Premium em Guararema",
                        "url": "https://www.ipeimoveis.com.br",
                        "telephone": "+5511981845016",
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": "Guararema",
                            "addressRegion": "SP",
                            "addressCountry": "BR"
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": "-23.4123",
                            "longitude": "-46.0312"
                        },
                        "openingHours": "Mo-Fr 09:00-18:00, Sa 09:00-13:00",
                        "priceRange": "$$$",
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.9",
                            "reviewCount": "523"
                        }
                    })
                }}
            />

            {/* Estrutura principal com SkipToContent para acessibilidade */}
            <div className="font-sans antialiased bg-white text-gray-900 selection:bg-amber-200 selection:text-amber-900">
                <SkipToContent />

                {/* Client component com todos os dados necessários */}
                <Suspense fallback={<UnifiedLoading height="100vh" title="Carregando Nova Ipê..." />}>
                    <HomePageClient
                        propertiesForSale={propertiesForSale}
                        propertiesForRent={propertiesForRent}
                        featuredProperties={featuredProperties}
                    />
                </Suspense>

                {/* Footer - mantido no server component para melhor SEO */}
                <FooterAprimorado />
            </div>

            {/* Estilos globais premium */}
            <style jsx global>{`
        .animate-fade-in-up {
          animation: premium-fade-in 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes premium-fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Premium scrollbar */
        ::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #d97706, #f59e0b);
          border-radius: 6px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #b45309, #d97706);
        }

        /* Premium selection */
        ::selection {
          background: rgba(251, 191, 36, 0.2);
          color: #92400e;
        }

        /* Focus styles for accessibility */
        *:focus {
          outline: 2px solid #f59e0b;
          outline-offset: 2px;
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
        </>
    );
}
