import { Suspense } from 'react';
import { getImoveisDestaque, getImoveisAluguel } from '@/lib/queries';
import { normalizeDocuments } from '@/lib/sanity-utils';
import { loadImage } from '@/lib/enhanced-image-loader';
import type { ImovelClient } from '@/src/types/imovel-client';
import { PropertyType } from '@/app/components/OptimizedPropertyCard';
import { extractSlugString, ensureNonNullProperties } from '@/app/PropertyTypeFix';

// Safe static imports to avoid webpack factory errors
import SkipToContent from './components/SkipToContent';
import OptimizationProvider from './components/OptimizationProvider';
import NotificacaoBanner from './components/NotificacaoBanner';
import SectionHeader from './components/ui/SectionHeader';
import EnhancedHero from './components/EnhancedHero';
import NavbarResponsive from './components/NavbarResponsive';
import ValorAprimorado from './sections/ValorAprimorado';
import FormularioContato from './components/FormularioContato';
import FooterAprimorado from './sections/FooterAprimorado';
import BlocoExploracaoSimbolica from './components/BlocoExploracaoSimbolica';
import { ExclusiveAnalysisOffer } from './sections/ExclusiveAnalysisOffer';
import ClientProgressSteps from './components/ClientProgressSteps';
import Referencias from './sections/Referencias';
import WhatsAppButton from './components/WhatsAppButton';
import { FeedbackBanner } from './components/FeedbackBanner';
import BlocoCTAConversao from './components/client/BlocoCTAConversao';

/**
 * Transformação robusta de dados do Sanity
 */
function transformPropertyData(imovel: ImovelClient, propertyType: PropertyType) {
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
            isNew: Boolean(imovel._createdAt && new Date(imovel._createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        };
    } catch (error) {
        console.error(`Erro ao transformar imóvel: ${error}`);
        return null;
    }
}

// Loading refinado e profissional
const ProfessionalLoading = ({ height = "400px", title = "Carregando..." }: { height?: string; title?: string }) => (
    <div
        className="bg-gradient-to-br from-slate-50 to-white animate-pulse rounded-3xl flex flex-col items-center justify-center shadow-xl border border-slate-200"
        style={{ height }}
    >
        <div className="flex flex-col items-center space-y-6">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-blue-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <div className="text-slate-600 font-medium text-lg">{title}</div>
            <div className="flex space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
        </div>
    </div>
);

// Seção de credibilidade e números
const CredibilitySection = () => (
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
                {[
                    { 
                        icon: "🏆", 
                        number: "15+", 
                        label: "Anos de Experiência", 
                        description: "Liderando o mercado imobiliário de Guararema com expertise e dedicação",
                        color: "amber"
                    },
                    { 
                        icon: "🏠", 
                        number: "500+", 
                        label: "Famílias Atendidas", 
                        description: "Mais de 500 famílias encontraram o lar dos sonhos conosco",
                        color: "blue"
                    },
                    { 
                        icon: "📈", 
                        number: "98%", 
                        label: "Taxa de Satisfação", 
                        description: "Excelência comprovada no atendimento e resultados entregues",
                        color: "green"
                    },
                    { 
                        icon: "⚡", 
                        number: "30", 
                        label: "Dias Médios", 
                        description: "Tempo médio para encontrar o imóvel ideal para nossos clientes",
                        color: "purple"
                    }
                ].map((item, index) => (
                    <div key={index} className="group">
                        <div className="bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-700 border border-slate-100 hover:border-amber-200 hover:-translate-y-4 h-full relative overflow-hidden">
                            {/* Background gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            {/* Content */}
                            <div className="relative z-10">
                                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500">
                                    {item.icon}
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors duration-300">
                                    {item.number}
                                </h3>
                                <p className="text-amber-600 font-semibold mb-4 text-sm uppercase tracking-wide">
                                    {item.label}
                                </p>
                                <p className="text-slate-600 leading-relaxed text-sm">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// Seção de imóveis em destaque com grid profissional (sem componentes problemáticos)
const PropertyShowcaseSection = ({ destaques }: { destaques: any[] }) => (
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

            {/* Grid de imóveis premium */}
            <div className="max-w-7xl mx-auto">
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl shadow-2xl border border-slate-100 p-8 lg:p-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {destaques.slice(0, 6).map((property, index) => (
                            <div key={property.id || index} className="group">
                                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100 hover:border-blue-200 hover:-translate-y-2">
                                    {/* Image */}
                                    <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 relative overflow-hidden">
                                        {property.mainImage && (
                                            <img 
                                                src={property.mainImage.url || property.mainImage} 
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

// Componente principal refinado e profissional
export default async function ProfessionalHomePage() {
    // Buscar dados do Sanity com tratamento seguro de erros
    let imoveisDestaque = [];
    let imoveisAluguel = [];

    try {
        [imoveisDestaque, imoveisAluguel] = await Promise.all([
            getImoveisDestaque(),
            getImoveisAluguel()
        ]);
    } catch (error) {
        console.error('Erro ao buscar imóveis:', error);
    }

    // Processar dados
    const destaqueNormalizados = normalizeDocuments(imoveisDestaque) || [];
    const aluguelNormalizados = normalizeDocuments(imoveisAluguel) || [];

    const destaqueFormatados = ensureNonNullProperties(
        destaqueNormalizados.map(imovel => transformPropertyData(imovel, 'sale'))
    );

    const aluguelFormatados = ensureNonNullProperties(
        aluguelNormalizados.map(imovel => transformPropertyData(imovel, 'rent'))
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
                    {/* Hero Section Premium */}
                    <EnhancedHero />

                    {/* Seção de Credibilidade */}
                    <CredibilitySection />

                    {/* Análise Exclusiva do Mercado */}
                    <section id="analise-mercado" className="py-24 bg-gradient-to-b from-slate-50 to-white">
                        <div className="container mx-auto px-6 lg:px-8">
                            <SectionHeader
                                badge="Consultoria Especializada"
                                badgeColor="purple"
                                title="Análise Exclusiva do Mercado"
                                description="Insights personalizados e dados exclusivos para sua decisão de investimento"
                                align="center"
                                className="mb-16"
                            />

                            <div className="max-w-6xl mx-auto">
                                <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                                    <Suspense fallback={<ProfessionalLoading height="400px" title="Carregando análise..." />}>
                                        <ExclusiveAnalysisOffer variant="investor" />
                                    </Suspense>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Showcase de Imóveis */}
                    <PropertyShowcaseSection destaques={destaqueFormatados} />

                    {/* Proposta de Valor da Empresa */}
                    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
                        <div className="container mx-auto px-6 lg:px-8">
                            <Suspense fallback={<ProfessionalLoading height="500px" title="Carregando valores..." />}>
                                <ValorAprimorado />
                            </Suspense>
                        </div>
                    </section>

                    {/* Jornada do Cliente - COMPONENTE CRÍTICO READICIONADO */}
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
                                    <Suspense fallback={<ProfessionalLoading height="400px" title="Carregando jornada..." />}>
                                        <ClientProgressSteps />
                                    </Suspense>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Referências e Depoimentos */}
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
                                <Suspense fallback={<ProfessionalLoading height="450px" title="Carregando depoimentos..." />}>
                                    <Referencias />
                                </Suspense>
                            </div>
                        </div>
                    </section>

                    {/* Exploração de Mercado */}
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
                                    <Suspense fallback={<ProfessionalLoading height="400px" title="Carregando insights..." />}>
                                        <BlocoExploracaoSimbolica />
                                    </Suspense>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Formulário de Contato Principal */}
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
                                    <Suspense fallback={<ProfessionalLoading height="500px" title="Carregando formulário..." />}>
                                        <FormularioContato />
                                    </Suspense>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Final Premium */}
                    <section className="bg-gradient-to-r from-slate-900 to-slate-800 relative overflow-hidden py-20">
                        <div className="absolute inset-0 bg-[url('/wood-pattern.png')] opacity-5"></div>
                        <div className="container mx-auto relative z-10 px-6 lg:px-8">
                            <Suspense fallback={<ProfessionalLoading height="200px" title="Carregando..." />}>
                                <BlocoCTAConversao
                                    titulo="Pronto para encontrar seu próximo lar?"
                                    subtitulo="Nossa equipe está pronta para transformar sua busca imobiliária em Guararema em uma jornada personalizada e gratificante. Dê o primeiro passo agora."
                                    ctaText="Agendar Consulta Gratuita"
                                    ctaLink="https://wa.me/5511981845016?text=Olá! Gostaria de conhecer opções de imóveis em Guararema (via site)"
                                />
                            </Suspense>
                        </div>
                    </section>
                </main>

                {/* Footer Premium */}
                <Suspense fallback={<ProfessionalLoading height="300px" title="Carregando footer..." />}>
                    <FooterAprimorado />
                </Suspense>

                {/* WhatsApp Button */}
                <WhatsAppButton
                    phoneNumber="5511981845016"
                    message="Olá! Gostaria de mais informações sobre imóveis em Guararema (via site)"
                    pulseAnimation={true}
                    showAfterScroll={true}
                />

                {/* Feedback Banner */}
                <FeedbackBanner />
            </OptimizationProvider>
        </div>
    );
}