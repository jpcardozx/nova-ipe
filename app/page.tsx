import { Metadata } from 'next';
import { Suspense } from 'react';
import { getImoveisDestaque, getImoveisDestaqueVenda, getImoveisAluguel } from '@/lib/queries';
import { normalizeDocuments } from '@/lib/sanity-utils';
import type { ImovelClient } from '@/src/types/imovel-client';

// Modern Formal Components
import FormalHero from './components/FormalHero';
import ElegantPropertyCard from './components/ElegantPropertyCard';
import FormalContactForm from './components/FormalContactForm';
import SkipToContent from './components/SkipToContent';
import FooterAprimorado from './sections/FooterAprimorado';

// === INTERFACES ===
interface PropertyData {
  id: string;
  titulo: string;
  slug: string;
  preco: number;
  finalidade: 'venda' | 'aluguel';
  bairro?: string;
  cidade?: string;
  dormitorios?: number;
  banheiros?: number;
  vagas?: number;
  areaUtil?: number;
  imagem?: {
    imagemUrl: string;
    alt?: string;
  };
  destaque?: boolean;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpots?: number;
  mainImage: {
    url: string;
    alt: string;
    blurDataURL?: string;
  };
  isHighlight: boolean;
  isPremium: boolean;
  isNew: boolean;
  features?: string[];
  virtualTour?: string;
}

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
      id: imovel._id,
      title: imovel.titulo || 'Imóvel disponível',
      slug: slug || `imovel-${imovel._id}`,
      location: imovel.bairro || 'Guararema',
      city: 'Guararema',
      price: imovel.preco || 0,
      propertyType,
      area: imovel.areaUtil,
      bedrooms: imovel.dormitorios,
      bathrooms: imovel.banheiros,
      parkingSpots: imovel.vagas,
      mainImage: {
        url: processedImage.url,
        alt: processedImage.alt
      },
      isHighlight: Boolean(imovel.destaque),
      isPremium: Boolean(imovel.destaque),
      isNew: Boolean(imovel.dataPublicacao && new Date(imovel.dataPublicacao) > new Date(thirtyDaysAgo)),
      features: imovel.caracteristicas || []
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

      {/* Layout principal com classes de tema premium */}
      <div className="font-sans antialiased bg-white">
        <SkipToContent />

        <main className="min-h-screen flex flex-col">
          <Suspense fallback={
            <div className="w-full h-screen flex items-center justify-center bg-white">
              <UnifiedLoading height="100vh" title="Carregando Nova Ipê..." />
            </div>
          }>
            <HomePageClient
              propertiesForSale={propertiesForSale}
              propertiesForRent={propertiesForRent}
              featuredProperties={featuredProperties}
            />
          </Suspense>
        </main>

        {/* Footer aprimorado com SEO */}
        <FooterAprimorado />
      </div>
    </>
  );
}
