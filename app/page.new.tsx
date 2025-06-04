import { Suspense } from 'react';
import { getImoveisDestaque, getImoveisDestaqueVenda, getImoveisAluguel } from '@/lib/queries';
import { normalizeDocuments } from '@/lib/sanity-utils';
import { loadImage } from '@/lib/enhanced-image-loader';
import type { ImovelClient } from '@/src/types/imovel-client';
import { PropertyType } from '@/app/components/ui/property/PropertyCardUnified';
import { extractSlugString, ensureNonNullProperties } from '@/app/PropertyTypeFix';

// === CORE IMPORTS ===
import SkipToContent from './components/SkipToContent';
import OptimizationProvider from './components/OptimizationProvider';
import ClientOnlyNavbar from './components/ClientOnlyNavbar';
import SectionHeader from './components/ui/SectionHeader';
import FormularioContatoSubtil from './components/FormularioContatoSubtil';
import FooterAprimorado from './sections/FooterAprimorado';
import WhatsAppButton from './components/WhatsAppButton';
import NotificacaoBanner from './components/NotificacaoBanner';
import { FeedbackBanner } from './components/FeedbackBanner';
import { UnifiedLoading } from './components/ui/UnifiedComponents';
import SafeSuspenseWrapper from './components/SafeSuspenseWrapper';
import ScrollAnimations from './components/ScrollAnimations';
import BlocoExploracaoGuararema from './components/BlocoExploracaoSimbolica';

// === SECTION IMPORTS ===
import ValorAprimorado from './sections/ValorAprimorado';
import Referencias from './sections/Referencias';
import ClientProgressSteps from './components/ClientProgressSteps';
import { ExclusiveAnalysisOffer } from './sections/ExclusiveAnalysisOffer';
import { MarketAnalysisSection } from './components/MarketAnalysisSection';
import TrustAndCredibilitySection from './components/TrustAndCredibilitySection';
import ConsolidatedHero from './components/ConsolidatedHero';

// === PROFESSIONAL PROPERTY COMPONENTS ===
import { DestaquesSanityCarousel } from './components/DestaquesSanityCarousel';
import { PropertyCarousel } from '@/app/components/ui/property/PropertyCarousel';
import { PropertyCard, PropertyCardProps } from '@/app/components/ui/property/PropertyCardUnified';

// === UTILITY FUNCTIONS ===
async function fetchAndTransformProperties(fetchFunction: () => Promise<ImovelClient[]>, propertyType: PropertyType): Promise<PropertyCardProps[]> {
    const imoveis = await fetchFunction();
    return imoveis.map(imovel => transformPropertyData(imovel, propertyType)).filter(Boolean) as PropertyCardProps[];
}

function transformPropertyData(imovel: ImovelClient, propertyType: PropertyType): PropertyCardProps | null {
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
            status: 'available',
            isHighlight: Boolean(imovel.destaque),
            isPremium: Boolean(imovel.destaque),
            isNew: Boolean(imovel.dataPublicacao && new Date(imovel.dataPublicacao) > new Date(thirtyDaysAgo))
        };
    } catch (error) {
        console.error(`Erro ao transformar imóvel: ${error}`);
        return null;
    }
}

// === COMPONENTES PROFISSIONAIS ===
// Hero Section Premium SSR - Usando ConsolidatedHero com Suspense boundary
const HeroSection = () => (
    <SafeSuspenseWrapper height="600px" title="Carregando hero premium...">
        <ConsolidatedHero />
    </SafeSuspenseWrapper>
);

export default async function Home() {
    // Fetch data for different sections concurrently
    const [
        destaqueVendaProperties,
        destaqueAluguelProperties,
        rawImoveisDestaque
    ] = await Promise.all([
        fetchAndTransformProperties(getImoveisDestaqueVenda, 'sale'),
        fetchAndTransformProperties(getImoveisAluguel, 'rent'),
        getImoveisDestaque() // Para o DestaquesSanityCarousel
    ]);

    return (
        <main className="min-h-screen flex flex-col">
            <OptimizationProvider>
                <ClientOnlyNavbar />

                {/* Hero Section - Premium */}
                <HeroSection />

                {/* Seções de Destaque - Usando Suspense para carregamento otimizado */}
                <Suspense fallback={<UnifiedLoading />}>
                    <BlocoExploracaoGuararema />
                </Suspense>

                {/* === SEÇÃO DE DESTAQUES COM FILTROS - SANITY CAROUSEL === */}
                <Suspense fallback={<UnifiedLoading />}>
                    <DestaquesSanityCarousel
                        rawProperties={rawImoveisDestaque}
                        title="Imóveis em Destaque"
                        subtitle="Propriedades exclusivamente selecionadas com filtros inteligentes e interface moderna"
                    />
                </Suspense>

                {/* === SEÇÃO DE IMÓVEIS À VENDA - PROPERTY CAROUSEL === */}
                <Suspense fallback={<UnifiedLoading />}>
                    <section className="py-16 bg-gradient-to-br from-neutral-50 via-white to-primary-50/30">
                        <div className="container mx-auto px-6">
                            <PropertyCarousel
                                properties={destaqueVendaProperties}
                                title="Imóveis à Venda em Destaque"
                                subtitle="Oportunidades exclusivas de compra em Guararema"
                                variant="featured"
                                slidesToShow={3}
                                showControls={true}
                                autoplay={true}
                                autoplayInterval={6000}
                                viewAllLink="/comprar"
                                viewAllLabel="Ver todos os imóveis à venda"
                            />
                        </div>
                    </section>
                </Suspense>

                {/* === SEÇÃO DE IMÓVEIS PARA ALUGUEL - PROPERTY CAROUSEL === */}
                <Suspense fallback={<UnifiedLoading />}>
                    <section className="py-16 bg-gradient-to-br from-white via-neutral-50 to-secondary-50/30">
                        <div className="container mx-auto px-6">
                            <PropertyCarousel
                                properties={destaqueAluguelProperties}
                                title="Imóveis para Alugar em Destaque"
                                subtitle="Opções selecionadas de aluguel com excelente localização"
                                variant="featured"
                                slidesToShow={3}
                                showControls={true}
                                autoplay={true}
                                autoplayInterval={7000}
                                viewAllLink="/alugar"
                                viewAllLabel="Ver todos os imóveis para alugar"
                            />
                        </div>
                    </section>
                </Suspense>

                {/* Seção de Valor Aprimorado - SSR com dados reais */}
                <ValorAprimorado
                    properties={[]}
                    title="Valorizações Recentes em Guararema"
                    description="Descubra como nossos imóveis têm se valorizado."
                    ctaLink="/valorizar"
                    ctaText="Saiba mais sobre valorização"
                    badge="Destaque"
                />

                {/* Seção de Referências - SSR com dados reais */}
                <Referencias
                    title="O que dizem nossos clientes"
                    description="Depoimentos reais de clientes satisfeitos."
                    ctaLink="/depoimentos"
                    ctaText="Veja todos os depoimentos"
                    badge="Confiança"
                />

                {/* Seção de Análise de Mercado - SSR com dados reais */}
                <MarketAnalysisSection
                    title="Análise de Mercado Imobiliário"
                    description="Entenda as tendências do mercado em Guararema."
                    ctaLink="/download"
                    ctaText="Acesse a análise completa"
                    badge="Exclusivo"
                />

                {/* Client Progress Steps */}
                <Suspense fallback={<UnifiedLoading />}>
                    <ClientProgressSteps />
                </Suspense>

                {/* Seção de Contato - SSR com dados reais */}
                <FormularioContatoSubtil
                    title="Interessado em um imóvel?"
                    description="Entre em contato conosco para uma consulta personalizada."
                    ctaText="Fale conosco"
                    badge="Atendimento"
                />

                {/* Rodapé Aprimorado - SSR com dados reais */}
                <FooterAprimorado />
            </OptimizationProvider>
        </main>
    );
}
