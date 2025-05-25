import { Suspense } from 'react';
import { getImoveisDestaque, getImoveisAluguel } from '@/lib/queries';
import { normalizeDocuments } from '@/lib/sanity-utils';
import { ensureValidImageUrl } from '@/lib/sanity-image-utils';
import { loadImage } from '@/lib/enhanced-image-loader';
import type { ImovelClient } from '@/src/types/imovel-client';
import { PropertyType } from '@/app/components/OptimizedPropertyCard';
import { extractSlugString, ensureNonNullProperties } from '@/app/PropertyTypeFix';

// Import dos componentes essenciais
import SkipToContent from './components/SkipToContent';
import OptimizationProvider from './components/OptimizationProvider';
import NotificacaoBanner from './components/NotificacaoBanner';
import SectionHeader from './components/ui/SectionHeader';
import FormularioContato from './components/FormularioContato';
import FooterAprimorado from './sections/FooterAprimorado';
import BlocoExploracaoSimbolica from './components/BlocoExploracaoSimbolica';
import { ExclusiveAnalysisOffer } from './sections/ExclusiveAnalysisOffer';
import WhatsAppButton from './components/WhatsAppButton';
import { FeedbackBanner } from './components/FeedbackBanner';
import NavbarResponsive from './components/NavbarResponsive';
import DestaquesEstrategicos from './sections/Destaques';
import BlocoCTAConversao from './components/client/BlocoCTAConversao';

/**
 * REDESIGN CRÍTICO DA PÁGINA INICIAL
 * 
 * Problemas identificados e corrigidos:
 * 1. ❌ Componentes desalinhados → ✅ Sistema de grid consistente
 * 2. ❌ Sem proporção visual → ✅ Proporções matemáticas harmoniosas
 * 3. ❌ Falta de sombras/profundidade → ✅ Sistema de sombras em camadas
 * 4. ❌ Progressão lógica fraca → ✅ Funil de conversão estruturado
 * 5. ❌ Elementos "jogados" → ✅ Layout sistemático e intencional
 */

// Hero completamente redesenhado com proporções perfeitas
function RedesignedHero() {
    return (
        <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
            {/* Background layers com profundidade */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[url('/images/hero-bg.png')] bg-cover bg-center opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-800/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 to-transparent" />
            </div>            {/* Geometric pattern overlay */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
            </div>

            {/* Content com estrutura em grid perfeita */}
            <div className="relative z-10 container mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-12 gap-8 min-h-screen items-center">
                    {/* Coluna principal de conteúdo - 8 colunas */}
                    <div className="lg:col-span-8 py-20 lg:py-32">
                        {/* Badge com sombra sutil */}
                        <div className="mb-8">
                            <span className="inline-flex items-center bg-gradient-to-r from-amber-500 to-amber-400 text-slate-900 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/40 transition-all duration-300">
                                <span className="w-2 h-2 bg-slate-900 rounded-full mr-2 animate-pulse"></span>
                                Especialistas em Guararema
                            </span>
                        </div>

                        {/* Título principal com hierarquia visual clara */}
                        <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
                            Encontre seu{' '}
                            <span className="relative">
                                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 bg-clip-text text-transparent">
                                    Imóvel dos Sonhos
                                </span>
                                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-300 rounded-full opacity-60"></div>
                            </span>
                            {' '}em Guararema
                        </h1>

                        {/* Subtítulo com contraste otimizado */}
                        <p className="text-xl lg:text-2xl mb-12 text-slate-300 max-w-2xl leading-relaxed font-light">
                            Mais de <strong className="text-white font-semibold">15 anos</strong> conectando pessoas aos melhores imóveis da região.
                            Especialistas em vendas, locações e investimentos imobiliários.
                        </p>

                        {/* CTAs com design sistemático */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-16">
                            <a
                                href="#imoveis-destaque"
                                className="group relative bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 text-center shadow-xl shadow-amber-500/25 hover:shadow-2xl hover:shadow-amber-500/40"
                            >
                                <span className="relative z-10">Ver Imóveis em Destaque</span>
                                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </a>
                            <a
                                href="#contato"
                                className="group relative border-2 border-white/30 hover:border-white bg-white/5 hover:bg-white hover:text-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 text-center backdrop-blur-sm shadow-lg hover:shadow-2xl"
                            >
                                <span className="relative z-10">Falar com Especialista</span>
                            </a>
                        </div>

                        {/* Stats com cards elegantes */}
                        <div className="grid grid-cols-3 gap-6 max-w-2xl">
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/10">
                                <div className="text-3xl lg:text-4xl font-bold text-amber-400 mb-2">15+</div>
                                <div className="text-sm text-slate-400 font-medium">Anos de Experiência</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/10">
                                <div className="text-3xl lg:text-4xl font-bold text-amber-400 mb-2">500+</div>
                                <div className="text-sm text-slate-400 font-medium">Famílias Atendidas</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/10">
                                <div className="text-3xl lg:text-4xl font-bold text-amber-400 mb-2">98%</div>
                                <div className="text-sm text-slate-400 font-medium">Satisfação</div>
                            </div>
                        </div>
                    </div>

                    {/* Coluna lateral com visual adicional - 4 colunas */}
                    <div className="lg:col-span-4 relative">
                        <div className="relative z-10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl border border-white/20 p-8 shadow-2xl">
                            <h3 className="text-2xl font-bold mb-6 text-white">Início Rápido</h3>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 text-slate-300 hover:text-white transition-colors">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                                    <span>Avaliação gratuita do imóvel</span>
                                </div>
                                <div className="flex items-center space-x-3 text-slate-300 hover:text-white transition-colors">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                                    <span>Consultoria especializada</span>
                                </div>
                                <div className="flex items-center space-x-3 text-slate-300 hover:text-white transition-colors">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                                    <span>Documentação completa</span>
                                </div>
                                <div className="flex items-center space-x-3 text-slate-300 hover:text-white transition-colors">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                                    <span>Suporte pós-venda</span>
                                </div>
                            </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-400/20 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-8 -left-4 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl"></div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
                </div>
            </div>
        </section>
    );
}

// Seção de Confiança e Credibilidade
function TrustSection() {
    return (<section className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%23f1f5f9%22%20fill-opacity%3D%220.3%22%3E%3Cpolygon%20points%3D%2250%200%2060%2040%20100%2050%2060%2060%2050%20100%2040%2060%200%2050%2040%2040%22/%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                    Por que escolher a <span className="text-amber-600">Ipê Imóveis</span>?
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                    Nossa experiência e compromisso garantem que você tenha a melhor experiência imobiliária em Guararema.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    {
                        icon: "🏆",
                        title: "Experiência Comprovada",
                        description: "15+ anos no mercado imobiliário de Guararema com centenas de famílias satisfeitas."
                    },
                    {
                        icon: "📍",
                        title: "Conhecimento Local",
                        description: "Especialistas na região, conhecemos cada bairro e suas particularidades."
                    },
                    {
                        icon: "🤝",
                        title: "Atendimento Personalizado",
                        description: "Cada cliente é único. Oferecemos soluções sob medida para suas necessidades."
                    },
                    {
                        icon: "⚡",
                        title: "Processos Ágeis",
                        description: "Documentação rápida, processos otimizados e suporte em todas as etapas."
                    }
                ].map((item, index) => (
                    <div key={index} className="group">
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-amber-200 hover:-translate-y-2">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">
                                {item.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section >
    );
}

// Seção de Destaques Redesenhada
function FeaturedPropertiesSection({ destaqueFormatados, aluguelFormatados }: { destaqueFormatados: any[], aluguelFormatados: any[] }) {
    return (
        <section id="imoveis-destaque" className="py-24 bg-white relative">
            <div className="container mx-auto px-6 lg:px-8">
                {/* Header da seção com design melhorado */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                        <span className="w-2 h-2 bg-amber-600 rounded-full mr-2"></span>
                        Imóveis Selecionados
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                        Encontre seu <span className="text-amber-600">próximo lar</span>
                    </h2>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Cada imóvel em nossa carteira é cuidadosamente selecionado para oferecer
                        qualidade, localização privilegiada e excelente potencial de valorização.
                    </p>
                </div>

                {/* Container com sombra e bordas elegantes */}
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                    <div className="p-8 lg:p-12">
                        {/* Seção de Venda */}
                        <div className="mb-16">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-3xl font-bold text-slate-900">
                                    Imóveis para <span className="text-amber-600">Compra</span>
                                </h3>                                <a href="/comprar" className="text-amber-600 hover:text-amber-700 font-semibold flex items-center group">
                                    Ver todos
                                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                            </div>
                            <Suspense fallback={<div className="h-96 bg-slate-100 animate-pulse rounded-2xl"></div>}>
                                <DestaquesEstrategicos />
                            </Suspense>
                        </div>

                        {/* Divisor elegante */}
                        <div className="flex items-center my-16">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                            <div className="px-6">
                                <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                        </div>

                        {/* Seção de Aluguel */}
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-3xl font-bold text-slate-900">
                                    Imóveis para <span className="text-blue-600">Aluguel</span>
                                </h3>                                <a href="/alugar" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center group">
                                    Ver todos
                                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                            </div>
                            <Suspense fallback={<div className="h-96 bg-slate-100 animate-pulse rounded-2xl"></div>}>
                                <DestaquesEstrategicos />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Transformação de dados com melhor tratamento de erros
function transformPropertyData(imovel: ImovelClient, propertyType: PropertyType) {
    try {
        if (!imovel) {
            console.error('Objeto de imóvel inválido ou indefinido');
            return null;
        }

        if (!imovel._id) {
            console.warn('Imóvel sem ID encontrado, gerando ID temporário');
            imovel._id = `temp-${Date.now()}`;
        }

        const processedImage = loadImage(
            imovel.imagem,
            '/images/property-placeholder.jpg',
            imovel.titulo || 'Imóvel'
        );

        const slug = extractSlugString(imovel.slug);
        if (!slug) {
            console.warn(`Imóvel ${imovel._id} sem slug válido`);
        }

        return {
            id: imovel._id,
            title: imovel.titulo || 'Imóvel sem título',
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
            isNew: Boolean(imovel._id && imovel._id.startsWith('temp-'))
        };
    } catch (error) {
        console.error(`Erro ao transformar imóvel: ${error}`);
        return null;
    }
}

// Loading component com design aprimorado
const SectionLoading = ({ height = "400px" }: { height?: string }) => (
    <div
        className="bg-gradient-to-br from-slate-100 to-slate-50 animate-pulse rounded-2xl flex items-center justify-center shadow-lg border border-slate-200"
        style={{ height }}
    >
        <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-slate-300 border-t-amber-500 rounded-full animate-spin"></div>
            <div className="text-slate-500 font-medium">Carregando...</div>
        </div>
    </div>
);

// Componente principal redesenhado
export default async function RedesignedHomePage() {
    let imoveisDestaque = [];
    let imoveisAluguel = [];

    try {
        imoveisDestaque = await getImoveisDestaque();
        imoveisAluguel = await getImoveisAluguel();
    } catch (error) {
        console.error('Erro ao buscar imóveis:', error);
    }

    const destaqueNormalizados = normalizeDocuments(imoveisDestaque) || [];
    const aluguelNormalizados = normalizeDocuments(imoveisAluguel) || [];

    const destaqueFormatados = ensureNonNullProperties(
        destaqueNormalizados.map(imovel => transformPropertyData(imovel, 'sale'))
    );

    const aluguelFormatados = ensureNonNullProperties(
        aluguelNormalizados.map(imovel => transformPropertyData(imovel, 'rent'))
    );

    return (
        <div className="font-sans antialiased bg-white">
            <SkipToContent />
            <OptimizationProvider>
                {/* Banner de notificação redesenhado */}
                <NotificacaoBanner
                    text="🎉 Lançamento: Novo condomínio fechado em Guararema com lazer completo!"
                    linkText="Garanta sua unidade →"
                    linkHref="#contato"
                    variant="default"
                    dismissible={true}
                    storageKey="may2025-launch-banner"
                />

                <NavbarResponsive />

                <main id="main-content" className="overflow-hidden">
                    {/* Hero completamente redesenhado */}
                    <RedesignedHero />

                    {/* Seção de confiança */}
                    <TrustSection />

                    {/* Análise de mercado com melhor posicionamento */}
                    <section id="analise-mercado" className="py-24 bg-gradient-to-b from-white to-slate-50 relative">
                        <div className="container mx-auto px-6 lg:px-8">
                            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                                <div className="p-8 lg:p-12">
                                    <Suspense fallback={<SectionLoading height="400px" />}>
                                        <ExclusiveAnalysisOffer variant="investor" />
                                    </Suspense>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Imóveis em destaque redesenhados */}
                    <FeaturedPropertiesSection
                        destaqueFormatados={destaqueFormatados}
                        aluguelFormatados={aluguelFormatados}
                    />

                    {/* Exploração simbólica com melhor integração */}
                    <section id="exploracao" className="py-24 bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/images/texture-light.png')] opacity-30 mix-blend-soft-light"></div>
                        <div className="container mx-auto px-6 lg:px-8 relative z-10">
                            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                                <div className="p-8 lg:p-12">
                                    <Suspense fallback={<SectionLoading height="500px" />}>
                                        <BlocoExploracaoSimbolica />
                                    </Suspense>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Formulário de contato redesenhado */}
                    <section id="contato" className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/images/texture-dark.png')] opacity-20 mix-blend-soft-light"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>

                        <div className="container mx-auto px-6 lg:px-8 relative z-10">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                                    Vamos encontrar seu <span className="text-amber-400">imóvel ideal</span>?
                                </h2>
                                <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                                    Nossa equipe está pronta para transformar sua busca em realidade.
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                                <div className="p-8 lg:p-12">
                                    <Suspense fallback={<SectionLoading height="500px" />}>
                                        <FormularioContato />
                                    </Suspense>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA final redesenhado */}
                    <section className="py-20 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/images/pattern-gold.png')] opacity-20 mix-blend-multiply"></div>

                        <div className="container mx-auto px-6 lg:px-8 relative z-10">
                            <Suspense fallback={<SectionLoading height="300px" />}>
                                <BlocoCTAConversao
                                    titulo="Pronto para dar o próximo passo?"
                                    subtitulo="Nossa equipe está aguardando para transformar sua busca imobiliária em Guararema em uma jornada personalizada e gratificante."
                                    ctaText="Começar agora →"
                                    ctaLink="https://wa.me/5511981845016?text=Olá! Gostaria de conhecer opções de imóveis em Guararema (via site)"
                                />
                            </Suspense>
                        </div>
                    </section>
                </main>

                {/* Footer redesenhado */}
                <Suspense fallback={<SectionLoading height="300px" />}>
                    <FooterAprimorado />
                </Suspense>

                {/* WhatsApp button com posicionamento melhorado */}
                <WhatsAppButton
                    phoneNumber="5511981845016"
                    message="Olá! Gostaria de mais informações sobre imóveis em Guararema (via site)"
                    pulseAnimation={true}
                    showAfterScroll={true}
                />

                <FeedbackBanner />
            </OptimizationProvider>
        </div>
    );
}
