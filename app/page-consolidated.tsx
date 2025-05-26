import { Suspense } from 'react';
import { getImoveisDestaque, getImoveisAluguel } from '@/lib/queries';
import { normalizeDocuments } from '@/lib/sanity-utils';
import { loadImage } from '@/lib/enhanced-image-loader';
import type { ImovelClient } from '@/src/types/imovel-client';
import { PropertyType } from '@/components/ui/property/PropertyCard';
import { extractSlugString, ensureNonNullProperties } from '@/app/PropertyTypeFix';

// === CORE IMPORTS - Componentes essenciais ===
import SkipToContent from './components/SkipToContent';
import OptimizationProvider from './components/OptimizationProvider';
import NavbarResponsive from './components/NavbarResponsive';
import ConsolidatedHero from './components/ConsolidatedHero';
import SectionHeader from './components/ui/SectionHeader';
import FormularioContato from './components/FormularioContato';
import FooterAprimorado from './sections/FooterAprimorado';
import WhatsAppButton from './components/WhatsAppButton';
import NotificacaoBanner from './components/NotificacaoBanner';
import { FeedbackBanner } from './components/FeedbackBanner';
import { UnifiedLoading } from './components/ui/UnifiedComponents';
import AnimatedStatsCard from './components/AnimatedStatsCard';
import SafeSuspenseWrapper from './components/SafeSuspenseWrapper';
import AnimatedCTASection from './components/AnimatedCTASection';

// === SECTION IMPORTS - Seções especializadas ===
import ValorAprimorado from './sections/ValorAprimorado';
import Referencias from './sections/Referencias';
import ClientProgressSteps from './components/ClientProgressSteps';
import BlocoExploracaoSimbolica from './components/BlocoExploracaoSimbolica';
import { ExclusiveAnalysisOffer } from './sections/ExclusiveAnalysisOffer';
import BlocoCTAConversao from './components/client/BlocoCTAConversao';

// === INTERFACES E TIPOS ===
interface ProcessedProperty {
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

// === UTILITY FUNCTIONS ===
function transformPropertyData(imovel: ImovelClient, propertyType: PropertyType): ProcessedProperty | null {
    try {
        if (!imovel || !imovel._id) {
            return null;
        }

        const processedImage = loadImage(
            imovel.imagem,
            '/images/property-placeholder.jpg',
            imovel.titulo || 'Imóvel'
        );

        const slug = extractSlugString(imovel.slug);

        return {
            id: imovel._id,
            title: imovel.titulo || 'Imóvel disponível',
            slug: slug || `imovel-${imovel._id}`,
            location: imovel.bairro || 'Guararema',
            city: 'Guararema',
            price: imovel.preco || 0,
            propertyType: propertyType,
            area: imovel.areaUtil || undefined,
            bedrooms: imovel.dormitorios || undefined,
            bathrooms: imovel.banheiros || undefined,
            parkingSpots: imovel.vagas || undefined,
            mainImage: {
                url: processedImage.url,
                alt: processedImage.alt
            },
            isHighlight: imovel.destaque || false,
            isPremium: imovel.destaque || false,
            isNew: Boolean(imovel.dataPublicacao && new Date(imovel.dataPublicacao) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        };
    } catch (error) {
        console.error(`Erro ao transformar imóvel: ${error}`);
        return null;
    }
}

// === LOADING COMPONENTS ===
// Agora usando o componente unificado
// const UnifiedLoading = ({ height = "400px", title = "Carregando..." }: { height?: string; title?: string }) => (
//     Removido - usando o componente unificado importado
// );

// === SEÇÕES CONSOLIDADAS ===

// Seção de Credibilidade e Confiança
const TrustCredibilitySection = () => {
    const statsData = [
        {
            icon: "🏆",
            number: "15+",
            label: "Anos de Experiência",
            description: "Liderando o mercado imobiliário de Guararema com expertise e dedicação",
        },
        {
            icon: "🏠",
            number: "500+",
            label: "Famílias Atendidas",
            description: "Mais de 500 famílias encontraram o lar dos sonhos conosco",
        },
        {
            icon: "📈",
            number: "98%",
            label: "Taxa de Satisfação",
            description: "Excelência comprovada no atendimento e resultados entregues",
        },
        {
            icon: "⚡",
            number: "30",
            label: "Dias Médios",
            description: "Tempo médio para encontrar o imóvel ideal para nossos clientes",
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-white to-slate-50">
            <div className="container mx-auto px-6 lg:px-8">
                <SectionHeader
                    badge="Credibilidade e Experiência"
                    badgeColor="amber"
                    title="Por que somos a escolha certa?"
                    description="Números que comprovam nossa excelência no mercado imobiliário de Guararema"
                    align="center"
                    className="mb-16"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    {statsData.map((item, index) => (
                        <AnimatedStatsCard
                            key={index}
                            item={item}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

// Seção de Showcase de Imóveis Consolidada
const PropertyShowcaseSection = ({ properties }: { properties: ProcessedProperty[] }) => (
    <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
            <SectionHeader
                badge="Imóveis Selecionados"
                badgeColor="blue"
                title="Encontre seu próximo lar"
                description="Cada imóvel em nossa carteira é cuidadosamente selecionado para oferecer qualidade, localização privilegiada e excelente potencial de valorização."
                align="center"
                className="mb-16"
            />

            <div className="max-w-7xl mx-auto">
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl shadow-2xl border border-slate-100 p-8 lg:p-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {properties.slice(0, 6).map((property, index) => (
                            <div key={property.id || index} className="group">
                                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100 hover:border-blue-200 hover:-translate-y-2">
                                    {/* Image */}
                                    <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 relative overflow-hidden">
                                        {property.mainImage && (
                                            <img
                                                src={property.mainImage.url}
                                                alt={property.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                loading="lazy"
                                            />
                                        )}
                                        {/* Badges */}
                                        <div className="absolute top-4 left-4 flex flex-col space-y-2">
                                            {property.isPremium && (
                                                <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                                                    Destaque
                                                </span>
                                            )}
                                            {property.isNew && (
                                                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                                                    Novo
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                            {property.title}
                                        </h3>
                                        <p className="text-slate-600 mb-4 flex items-center">
                                            <span className="mr-2">📍</span>
                                            {property.location}, {property.city}
                                        </p>

                                        {/* Features */}
                                        <div className="flex justify-between items-center mb-4 text-sm text-slate-600">
                                            <div className="flex items-center space-x-4">
                                                {property.bedrooms && (
                                                    <span className="flex items-center">
                                                        <span className="mr-1">🛏️</span> {property.bedrooms}
                                                    </span>
                                                )}
                                                {property.bathrooms && (
                                                    <span className="flex items-center">
                                                        <span className="mr-1">🚿</span> {property.bathrooms}
                                                    </span>
                                                )}
                                                {property.area && (
                                                    <span className="flex items-center">
                                                        <span className="mr-1">📐</span> {property.area}m²
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Price and CTA */}
                                        <div className="flex justify-between items-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {property.price ? `R$ ${property.price.toLocaleString('pt-BR')}` : 'Consulte'}
                                            </div>
                                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 text-sm font-semibold">
                                                Ver Detalhes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA para ver mais */}
                    <div className="text-center mt-12">
                        <a
                            href="/comprar"
                            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            Ver Todos os Imóveis
                            <span className="ml-2">→</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// === COMPONENTE PRINCIPAL CONSOLIDADO ===
export default async function ConsolidatedHomePage() {
    // Buscar dados do Sanity com tratamento seguro de erros
    let imoveisDestaque: ImovelClient[] = [];
    let imoveisAluguel: ImovelClient[] = [];

    try {
        [imoveisDestaque, imoveisAluguel] = await Promise.all([
            getImoveisDestaque(),
            getImoveisAluguel()
        ]);
    } catch (error) {
        console.error('Erro ao buscar imóveis:', error);
    }

    // Processar dados com verificações adicionais
    const destaqueNormalizados = normalizeDocuments(imoveisDestaque) || [];
    const aluguelNormalizados = normalizeDocuments(imoveisAluguel) || [];

    const destaqueFormatados = ensureNonNullProperties(
        destaqueNormalizados.map(imovel => transformPropertyData(imovel, 'sale')).filter(Boolean)
    );

    const aluguelFormatados = ensureNonNullProperties(
        aluguelNormalizados.map(imovel => transformPropertyData(imovel, 'rent')).filter(Boolean)
    );

    return (
        <div className="font-body antialiased bg-white">
            <SkipToContent />
            <OptimizationProvider>
                {/* Banner de notificação elegante */}
                <NotificacaoBanner
                    text="🚀 Lançamento: Novo condomínio fechado em Guararema com infraestrutura completa!"
                    linkText="Saiba mais"
                    linkHref="#contato"
                    variant="default"
                    dismissible={true}
                    storageKey="may2025-launch-banner"
                />

                <NavbarResponsive />

                <main id="main-content" className="overflow-hidden">
                    {/* === HERO SECTION === */}
                    <ConsolidatedHero />

                    {/* === SEÇÃO DE CREDIBILIDADE === */}
                    <TrustCredibilitySection />

                    {/* === ANÁLISE EXCLUSIVA DO MERCADO === */}
                    <section id="analise-mercado" className="py-24 bg-gradient-to-b from-slate-50 to-white">
                        <div className="container mx-auto px-6 lg:px-8">
                            <SectionHeader
                                badge="Consultoria Especializada"
                                badgeColor="blue"
                                title="Análise Exclusiva do Mercado"
                                description="Insights personalizados e dados exclusivos para sua decisão de investimento"
                                align="center"
                                className="mb-16"
                            />

                            <div className="max-w-6xl mx-auto">
                                <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                                    <Suspense fallback={<UnifiedLoading height="400px" title="Carregando análise..." />}>
                                        <ExclusiveAnalysisOffer variant="investor" />
                                    </Suspense>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* === SHOWCASE DE IMÓVEIS === */}
                    <PropertyShowcaseSection properties={destaqueFormatados} />
                    <PropertyShowcaseSection properties={aluguelFormatados} />                    {/* === PROPOSTA DE VALOR DA EMPRESA === */}
                    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
                        <div className="container mx-auto px-6 lg:px-8">
                            <SafeSuspenseWrapper height="500px" title="Carregando valores...">
                                <ValorAprimorado />
                            </SafeSuspenseWrapper>
                        </div>
                    </section>

                    {/* === JORNADA DO CLIENTE === */}
                    <section id="jornada" className="py-24 bg-white">
                        <div className="container mx-auto px-6 lg:px-8">
                            <SectionHeader
                                badge="Processo Transparente"
                                badgeColor="green"
                                title="Sua Jornada Imobiliária"
                                description="Conduzimos você por cada etapa com transparência total e eficiência comprovada"
                                align="center"
                                className="mb-16"
                            />

                            <div className="max-w-7xl mx-auto">
                                <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl shadow-2xl border border-slate-100 p-8 lg:p-12">
                                    <SafeSuspenseWrapper height="400px" title="Carregando jornada...">
                                        <ClientProgressSteps />
                                    </SafeSuspenseWrapper>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* === REFERÊNCIAS E DEPOIMENTOS === */}
                    <section className="py-24 bg-gradient-to-b from-slate-50 to-slate-100">
                        <div className="container mx-auto px-6 lg:px-8">
                            <SectionHeader
                                badge="Depoimentos Reais"
                                badgeColor="amber"
                                title="O que nossos clientes dizem"
                                description="Histórias reais de pessoas que encontraram o imóvel ideal com nossa ajuda"
                                align="center"
                                className="mb-16"
                            />

                            <div className="max-w-6xl mx-auto">
                                <Suspense fallback={<UnifiedLoading height="450px" title="Carregando depoimentos..." />}>
                                    <Referencias />
                                </Suspense>
                            </div>
                        </div>
                    </section>

                    {/* === EXPLORAÇÃO DE MERCADO === */}
                    <section id="exploracao" className="py-24 bg-white">
                        <div className="container mx-auto px-6 lg:px-8">
                            <SectionHeader
                                badge="Insights de Mercado"
                                badgeColor="blue"
                                title="Explore as Oportunidades"
                                description="Análise aprofundada do potencial de valorização e tendências do mercado"
                                align="center"
                                className="mb-16"
                            />

                            <div className="max-w-6xl mx-auto">
                                <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl shadow-2xl border border-slate-100 p-8 lg:p-12">
                                    <Suspense fallback={<UnifiedLoading height="400px" title="Carregando insights..." />}>
                                        <BlocoExploracaoSimbolica />
                                    </Suspense>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* === FORMULÁRIO DE CONTATO PRINCIPAL === */}
                    <section id="contato" className="py-24 bg-gradient-to-b from-slate-50 to-white">
                        <div className="container mx-auto px-6 lg:px-8">
                            <SectionHeader
                                badge="Fale Conosco"
                                badgeColor="green"
                                title="Vamos conversar sobre seu projeto"
                                description="Nossa equipe está pronta para ajudar você a encontrar o imóvel perfeito"
                                align="center"
                                className="mb-16"
                            />

                            <div className="max-w-5xl mx-auto">
                                <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                                    <Suspense fallback={<UnifiedLoading height="500px" title="Carregando formulário..." />}>
                                        <FormularioContato />
                                    </Suspense>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* === CTA FINAL PREMIUM === */}
                    <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden py-20">
                        {/* Enhanced background patterns */}
                        <div className="absolute inset-0 bg-[url('/images/wood-pattern.svg')] opacity-5"></div>
                        <div className="absolute top-0 left-0 w-full h-full">
                            <div className="absolute top-10 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
                            <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                        </div>                        <div className="container mx-auto relative z-10 px-6 lg:px-8">
                            <div className="text-center max-w-4xl mx-auto">
                                <Suspense fallback={<UnifiedLoading height="200px" title="Carregando..." />}>
                                    <BlocoCTAConversao
                                        titulo="Pronto para encontrar seu próximo lar?"
                                        subtitulo="Nossa equipe está pronta para transformar sua busca imobiliária em Guararema em uma jornada personalizada e gratificante. Dê o primeiro passo agora."
                                        ctaText="Agendar Consulta Gratuita"
                                        ctaLink="https://wa.me/5511981845016?text=Olá! Gostaria de conhecer opções de imóveis em Guararema"
                                    />
                                </Suspense>
                            </div>
                        </div>
                    </section>
                </main>

                {/* === FOOTER PREMIUM === */}
                <Suspense fallback={<UnifiedLoading height="300px" title="Carregando footer..." />}>
                    <FooterAprimorado />
                </Suspense>

                {/* === WHATSAPP BUTTON === */}
                <WhatsAppButton
                    phoneNumber="5511981845016"
                    message="Olá! Gostaria de mais informações sobre imóveis em Guararema (via site)"
                    pulseAnimation={true}
                    showAfterScroll={true}
                />

                {/* === FEEDBACK BANNER === */}
                <FeedbackBanner />
            </OptimizationProvider>
        </div>
    );
}
