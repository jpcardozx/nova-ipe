import { Suspense } from 'react';
import { getImoveisDestaque, getImoveisAluguel } from '@/lib/queries';
import { normalizeDocuments } from '@/lib/sanity-utils';
import { loadImage } from '@/lib/enhanced-image-loader';
import type { ImovelClient } from '@/src/types/imovel-client';
import { PropertyType } from '@/components/ui/property/PropertyCard';
import { extractSlugString, ensureNonNullProperties } from '@/app/PropertyTypeFix';

// === CORE IMPORTS ===
import SkipToContent from './components/SkipToContent';
import OptimizationProvider from './components/OptimizationProvider';
import NavbarResponsive from './components/NavbarResponsive';
import SectionHeader from './components/ui/SectionHeader';
import FormularioContato from './components/FormularioContato';
import FooterAprimorado from './sections/FooterAprimorado';
import WhatsAppButton from './components/WhatsAppButton';
import NotificacaoBanner from './components/NotificacaoBanner';
import { FeedbackBanner } from './components/FeedbackBanner';
import { UnifiedLoading } from './components/ui/UnifiedComponents';
import SafeSuspenseWrapper from './components/SafeSuspenseWrapper';
import ScrollAnimations from './components/ScrollAnimations';

// === SECTION IMPORTS ===
import ValorAprimorado from './sections/ValorAprimorado';
import Referencias from './sections/Referencias';
import ClientProgressSteps from './components/ClientProgressSteps';
import { ExclusiveAnalysisOffer } from './sections/ExclusiveAnalysisOffer';
import { MarketAnalysisSection } from './components/MarketAnalysisSection';
import { TrustAndCredibilitySection } from './components/TrustAndCredibilitySection';
import ConsolidatedHero from './components/ConsolidatedHero';

// === INTERFACES ===
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
            isNew: Boolean(imovel.dataPublicacao && new Date(imovel.dataPublicacao) > new Date(thirtyDaysAgo))
        };
    } catch (error) {
        console.error(`Erro ao transformar imóvel: ${error}`);
        return null;
    }
}

// === COMPONENTES APRIMORADOS ===

// Hero Section Premium SSR - Usando ConsolidatedHero com Suspense boundary
const HeroSection = () => (
    <SafeSuspenseWrapper height="600px" title="Carregando hero premium...">
        <ConsolidatedHero />
    </SafeSuspenseWrapper>
);

// Property Card Component Premium
const PropertyCard = ({ property, index }: { property: ProcessedProperty; index: number }) => (
    <article
        className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100 hover:border-blue-200 hover-lift"
        style={{
            animationDelay: `${index * 100}ms`,
            animation: 'fadeInUp 0.6s ease-out forwards',
            opacity: 0
        }}
    >
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden bg-slate-200">
            <img
                src={property.mainImage.url}
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Badges Premium */}
            <div className="absolute top-4 left-4 flex gap-2">
                {property.isPremium && (
                    <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg animate-pulse-glow">
                        ⭐ Exclusivo
                    </span>
                )}
                {property.isNew && (
                    <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        Novidade
                    </span>
                )}
            </div>

            {/* Trust Badge */}
            <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="glass text-white px-3 py-1 rounded-full text-xs font-medium">
                    ✓ Verificado Ipê
                </div>
            </div>

            {/* Quick Actions */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="w-10 h-10 glass hover:bg-white/20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover-scale">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
                <button className="w-10 h-10 glass hover:bg-white/20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover-scale">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                </button>
            </div>
        </div>

        {/* Content */}
        <div className="p-6">
            {/* Title and Location */}
            <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                {property.title}
            </h3>
            <p className="text-slate-600 mb-4 flex items-center">
                <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {property.location}, Guararema
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                {property.bedrooms && (
                    <div className="text-center p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors duration-300">
                        <div className="text-xs text-slate-500 mb-1">🛏️ Quartos</div>
                        <div className="font-semibold text-slate-900">{property.bedrooms}</div>
                    </div>
                )}
                {property.bathrooms && (
                    <div className="text-center p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors duration-300">
                        <div className="text-xs text-slate-500 mb-1">🚿 Banheiros</div>
                        <div className="font-semibold text-slate-900">{property.bathrooms}</div>
                    </div>
                )}
                {property.area && (
                    <div className="text-center p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors duration-300">
                        <div className="text-xs text-slate-500 mb-1">📐 Área</div>
                        <div className="font-semibold text-slate-900">{property.area}m²</div>
                    </div>
                )}
            </div>

            {/* Price and CTA */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <div>
                    <div className="text-sm text-slate-500 font-medium">
                        {property.propertyType === 'sale' ? '🏷️ Venda' : '🔑 Aluguel'}
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                        {property.price ? `R$ ${property.price.toLocaleString('pt-BR')}` : 'Consulte-nos'}
                    </div>
                </div>
                <a
                    href={`/imovel/${property.slug}`}
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover-lift group"
                >
                    Ver detalhes
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </a>
            </div>

            {/* Trust elements */}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center">
                    <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Documentação OK
                </span>
                <span className="text-slate-400">Cód: {property.id.slice(-6)}</span>
            </div>
        </div>
    </article>
);

// Properties Section Otimizada
const PropertiesSection = ({
    properties,
    title,
    badge,
    type
}: {
    properties: ProcessedProperty[];
    title: string;
    badge: string;
    type: 'sale' | 'rent';
}) => {
    if (!properties.length) return null;

    return (
        <section className="py-20 bg-gradient-to-b from-white to-slate-50">
            <div className="container mx-auto px-6 lg:px-8">
                <SectionHeader
                    badge={badge}
                    badgeColor={type === 'sale' ? 'blue' : 'green'}
                    title={title}
                    description="Imóveis selecionados com o padrão de qualidade Ipê"
                    align="center"
                    className="mb-12"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {properties.slice(0, 6).map((property, index) => (
                        <PropertyCard key={property.id} property={property} index={index} />
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center">
                    <a
                        href={type === 'sale' ? '/comprar' : '/alugar'}
                        className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl group"
                    >
                        Ver todos os imóveis
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
};

// === MAIN COMPONENT ===
export default async function EnhancedHomePage() {
    // Fetch data
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

    // Process data
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
            <OptimizationProvider>
                {/* Notification Banner */}
                <NotificacaoBanner
                    text="🎯 Oportunidade: Casas em condomínio com 20% de entrada facilitada"
                    linkText="Saiba mais"
                    linkHref="/contato"
                    variant="default"
                    dismissible={true}
                    storageKey="promo-banner-2025"
                />

                <NavbarResponsive />

                <main id="main-content">
                    {/* Hero Section */}
                    <HeroSection />

                    {/* Properties for Sale */}
                    {destaqueFormatados.length > 0 && (
                        <PropertiesSection
                            properties={destaqueFormatados}
                            title="Imóveis à venda em destaque"
                            badge="Oportunidades exclusivas"
                            type="sale"
                        />
                    )}                    {/* Trust and Credibility Section */}
                    <div className="fade-in-section">
                        <TrustAndCredibilitySection />
                    </div>                    {/* Market Analysis Section */}
                    <div className="fade-in-section">
                        <MarketAnalysisSection />
                    </div>

                    {/* Properties for Rent */}
                    {aluguelFormatados.length > 0 && (
                        <PropertiesSection
                            properties={aluguelFormatados}
                            title="Imóveis para alugar"
                            badge="Locação descomplicada"
                            type="rent"
                        />
                    )}                    {/* Value Proposition */}
                    <div className="fade-in-section">
                        <section className="py-20 bg-white">
                            <div className="container mx-auto px-6 lg:px-8">
                                <SafeSuspenseWrapper height="500px" title="Carregando...">
                                    <ValorAprimorado />
                                </SafeSuspenseWrapper>
                            </div>
                        </section>
                    </div>                    {/* Client Journey */}
                    <div className="fade-in-section">
                        <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
                            <div className="container mx-auto px-6 lg:px-8">
                                <SectionHeader
                                    badge="Processo transparente"
                                    badgeColor="green"
                                    title="Como funciona"
                                    description="Do primeiro contato às chaves na mão"
                                    align="center"
                                    className="mb-12"
                                />

                                <div className="max-w-5xl mx-auto">
                                    <SafeSuspenseWrapper height="400px" title="Carregando processo...">
                                        <ClientProgressSteps />
                                    </SafeSuspenseWrapper>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Testimonials */}
                    <section className="py-20 bg-white">
                        <div className="container mx-auto px-6 lg:px-8">
                            <SectionHeader
                                badge="Clientes satisfeitos"
                                badgeColor="amber"
                                title="Histórias de sucesso"
                                description="Veja o que dizem sobre nossa parceria"
                                align="center"
                                className="mb-12"
                            />

                            <Suspense fallback={<UnifiedLoading height="450px" title="Carregando depoimentos..." />}>
                                <Referencias />
                            </Suspense>
                        </div>
                    </section>

                    {/* Contact Section */}
                    <section id="contato" className="py-20 bg-gradient-to-b from-slate-50 to-white">
                        <div className="container mx-auto px-6 lg:px-8">
                            <SectionHeader
                                badge="Fale conosco"
                                badgeColor="blue"
                                title="Pronto para dar o próximo passo?"
                                description="Nossa equipe está esperando para ajudar você"
                                align="center"
                                className="mb-12"
                            />

                            <div className="max-w-3xl mx-auto">
                                <Suspense fallback={<UnifiedLoading height="500px" title="Carregando formulário..." />}>
                                    <FormularioContato />
                                </Suspense>
                            </div>
                        </div>
                    </section>

                    {/* Final CTA */}
                    <section className="py-20 bg-gradient-to-br from-blue-900 to-slate-900 text-white">
                        <div className="container mx-auto px-6 lg:px-8 text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Não encontrou o que procura?
                            </h2>
                            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                                Temos acesso a imóveis exclusivos que ainda não estão no site.
                                Entre em contato e encontraremos o imóvel perfeito para você.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href="https://wa.me/5511981845016" className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-xl group">
                                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                    Falar no WhatsApp
                                </a>
                                <a href="tel:+5511981845016" className="inline-flex items-center justify-center bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 group">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    Ligar agora
                                </a>
                            </div>
                        </div>
                    </section>
                </main>

                <FooterAprimorado />                <WhatsAppButton
                    phoneNumber="5511981845016"
                    message="Olá! Vi o site e gostaria de mais informações sobre imóveis."
                    pulseAnimation={true}
                    showAfterScroll={true}
                />                <FeedbackBanner />
                <ScrollAnimations />
            </OptimizationProvider>
        </div>
    );
}