import { Suspense } from 'react';
import { getImoveisDestaque, getImoveisAluguel } from '@/lib/queries';
import { normalizeDocuments } from '@/lib/sanity-utils';
import { ensureValidImageUrl } from '@/lib/sanity-image-utils';
import { loadImage } from '@/lib/enhanced-image-loader';
import type { ImovelClient } from '@/src/types/imovel-client';
import { PropertyType } from '@/app/components/OptimizedPropertyCard';
import { extractSlugString, ensureNonNullProperties } from '@/app/PropertyTypeFix';

// Import dos MELHORES componentes identificados - SEGUROS
import SkipToContent from './components/SkipToContent';
import OptimizationProvider from './components/OptimizationProvider';
import NotificacaoBanner from './components/NotificacaoBanner';
import SectionHeader from './components/ui/SectionHeader';

// USAR UM DOS HEROES EXISTENTES - MUITO MELHOR QUE O ATUAL
import EnhancedHero from './components/EnhancedHero'; // Hero sofisticado com abas e métricas
// import OptimizedHero from './components/OptimizedHero'; // Alternativa com foco em áreas específicas

// Seção de Valores da Empresa - COMPONENTE CRÍTICO ENCONTRADO
import ValorSection from './sections/Valor';

// Seção de confiança usando SectionHeader existente
const TrustSection = () => (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-6 lg:px-8">
            <SectionHeader
                badge="Confiança e Credibilidade"
                badgeColor="amber"
                title="Por que escolher a Ipê Imóveis?"
                description="Transparência, experiência e resultados que falam por si"
                align="center"
                className="mb-16"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {[
                    { icon: "🏆", title: "15+ Anos", subtitle: "Experiência", description: "Liderança no mercado imobiliário de Guararema" },
                    { icon: "📍", title: "Especialistas", subtitle: "Locais", description: "Conhecimento profundo de cada bairro da região" },
                    { icon: "🤝", title: "500+", subtitle: "Famílias", description: "Atendidas com sucesso e satisfação garantida" },
                    { icon: "⚡", title: "98%", subtitle: "Satisfação", description: "Taxa de aprovação dos nossos clientes" }
                ].map((item, index) => (
                    <div key={index} className="group">
                        <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 hover:border-amber-200 hover:-translate-y-3 h-full">
                            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                {item.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                {item.title}
                            </h3>
                            <p className="text-amber-600 font-semibold mb-3 text-sm uppercase tracking-wide">
                                {item.subtitle}
                            </p>
                            <p className="text-slate-600 leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// Componentes SEGUROS - sem riscos webpack
import FormularioContato from './components/FormularioContato';
import FooterAprimorado from './sections/FooterAprimorado';
import BlocoExploracaoSimbolica from './components/BlocoExploracaoSimbolica';
import { ExclusiveAnalysisOffer } from './sections/ExclusiveAnalysisOffer';
import WhatsAppButton from './components/WhatsAppButton';
import { OptimizedFeedbackBanner } from './components/OptimizedFeedbackBanner';

// Navbar moderna aprimorada - design elegante e funcional
import ModernNavbar from './components/ModernNavbar';

// Import direto de componentes de seções essenciais
import DestaquesEstrategicos from './sections/Destaques';
import BlocoCTAConversao from './components/client/BlocoCTAConversao';

/**
 * Transformação robusta de dados do Sanity
 * Baseada na versão aprimorada com tratamento de erros
 */
function transformPropertyData(imovel: ImovelClient, propertyType: PropertyType) {
    try {
        if (!imovel) {
            console.error('Objeto de imóvel inválido ou indefinido');
            return null;
        }

        // Validar estruturas de dados essenciais
        if (!imovel._id) {
            console.warn('Imóvel sem ID encontrado, gerando ID temporário');
            imovel._id = `temp-${Date.now()}`;
        }

        // Processar imagem com nossa solução aprimorada
        const processedImage = loadImage(
            imovel.imagem,
            '/images/property-placeholder.jpg',
            imovel.titulo || 'Imóvel'
        );

        // Extrair o slug de forma segura
        const slug = extractSlugString(imovel.slug);
        if (!slug) {
            console.warn(`Imóvel ${imovel._id} sem slug válido`);
        }

        // Montar objeto padronizado para os componentes de UI
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

// Componente de loading para seções - MELHORADO
const SectionLoading = ({ height = "300px" }: { height?: string }) => (
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

// Componente principal da página premium
export default async function PremiumHomePage() {
    // Buscando dados do Sanity com tratamento de erros
    let imoveisDestaque = [];
    let imoveisAluguel = [];

    try {
        imoveisDestaque = await getImoveisDestaque();
        imoveisAluguel = await getImoveisAluguel();
    } catch (error) {
        console.error('Erro ao buscar imóveis:', error);
    }

    // Normalizando documentos
    const destaqueNormalizados = normalizeDocuments(imoveisDestaque) || [];
    const aluguelNormalizados = normalizeDocuments(imoveisAluguel) || [];

    // Transformando para o formato esperado pelos componentes
    const destaqueFormatados = ensureNonNullProperties(
        destaqueNormalizados.map(imovel => transformPropertyData(imovel, 'sale'))
    );

    const aluguelFormatados = ensureNonNullProperties(
        aluguelNormalizados.map(imovel => transformPropertyData(imovel, 'rent'))
    );

    return (
        <div className="font-body antialiased">
            <SkipToContent />
            <OptimizationProvider>
                <NotificacaoBanner
                    text="Lançamento: Novo condomínio fechado em Guararema!"
                    linkText="Inscreva-se para o pré-lançamento"
                    linkHref="#contato"
                    variant="default"
                    dismissible={true}
                    storageKey="may2025-launch-banner"
                />

                <ModernNavbar />

                <main id="main-content" className="overflow-hidden">
                    {/* Hero Section - USANDO COMPONENTE EXISTENTE SOFISTICADO */}
                    <EnhancedHero />

                    {/* Seção de Confiança - PROGRESSÃO LÓGICA */}
                    <TrustSection />

                    {/* Seção de Valores da Empresa - COMPONENTE CRÍTICO ADICIONADO */}
                    {/* Seção de Valores da Empresa - COMPONENTE INTEGRADO */}
                    <ValorSection />

                    {/* Análise estrutural e estratégica - COM MELHOR CONTAINER E PROGRESSÃO */}
                    <section id="analise-mercado" className="py-24 bg-gradient-to-b from-slate-50 to-white relative">
                        <div className="container mx-auto px-6 lg:px-8">
                            <SectionHeader
                                badge="Consultoria Especializada"
                                badgeColor="blue"
                                title="Análise Exclusiva do Mercado"
                                description="Insights personalizados para sua decisão de investimento"
                                align="center"
                                className="mb-16"
                            />

                            <div className="max-w-6xl mx-auto">
                                <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden hover:shadow-3xl transition-all duration-500">
                                    <div className="p-8 lg:p-12">
                                        <Suspense fallback={<SectionLoading height="350px" />}>
                                            <ExclusiveAnalysisOffer variant="investor" />
                                        </Suspense>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Destaques estratégicos - COM MELHOR ESTRUTURA E PROGRESSÃO */}
                    <section id="destaques-estrategicos" className="py-24 bg-white relative">
                        <div className="container mx-auto px-6 lg:px-8">
                            <SectionHeader
                                badge="Imóveis Selecionados"
                                badgeColor="amber"
                                title={<>Encontre seu <span className="text-amber-600">próximo lar</span></>}
                                description="Cada imóvel em nossa carteira é cuidadosamente selecionado para oferecer qualidade, localização privilegiada e excelente potencial de valorização."
                                align="center"
                                className="mb-16"
                            />

                            <div className="max-w-7xl mx-auto">
                                <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl border border-slate-100 overflow-hidden hover:shadow-3xl transition-all duration-500">
                                    <div className="p-8 lg:p-12">
                                        <Suspense fallback={<SectionLoading height="500px" />}>
                                            <DestaquesEstrategicos />
                                        </Suspense>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Exploração simbólica - COM MELHOR APRESENTAÇÃO E ESTRUTURA */}
                    <section id="exploracao" className="py-24 bg-gradient-to-b from-slate-50 to-slate-100 relative">
                        <div className="container mx-auto px-6 lg:px-8">
                            <SectionHeader
                                badge="Explore Possibilidades"
                                badgeColor="green"
                                title="Descubra o Potencial dos Imóveis"
                                description="Análise aprofundada e insights exclusivos para sua tomada de decisão"
                                align="center"
                                className="mb-16"
                            />

                            <div className="max-w-6xl mx-auto">
                                <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden hover:shadow-3xl transition-all duration-500">
                                    <div className="p-8 lg:p-12">
                                        <Suspense fallback={<SectionLoading height="450px" />}>
                                            <BlocoExploracaoSimbolica />
                                        </Suspense>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Formulário de Contato Principal - MELHORADO */}
                    <section id="contato" className="py-24 bg-white relative">
                        <div className="container mx-auto px-6 lg:px-8">
                            <SectionHeader
                                badge="Entre em Contato"
                                badgeColor="blue"
                                title="Vamos Conversar sobre seu Projeto"
                                description="Nossa equipe está pronta para ajudar você a encontrar o imóvel ideal"
                                align="center"
                                className="mb-16"
                            />

                            <div className="max-w-4xl mx-auto">
                                <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                                    <Suspense fallback={<SectionLoading height="500px" />}>
                                        <FormularioContato />
                                    </Suspense>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Final de Conversão */}
                    <section className="bg-[#0D1F2D] relative overflow-hidden py-16">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1F2D] to-[#1a3040] mix-blend-soft-light"></div>
                        <div className="absolute inset-0 bg-[url('/wood-pattern.png')] opacity-10"></div>
                        <div className="container mx-auto relative z-10">
                            <Suspense fallback={<SectionLoading height="200px" />}>
                                <BlocoCTAConversao
                                    titulo="Vamos Encontrar Seu Espaço Ideal?"
                                    subtitulo="Nossa equipe está pronta para transformar sua busca imobiliária em Guararema em uma jornada personalizada e gratificante. Dê o primeiro passo agora."
                                    ctaText="Agendar Consulta Gratuita"
                                    ctaLink="https://wa.me/5511981845016?text=Olá! Gostaria de conhecer opções de imóveis em Guararema (via site)"
                                />
                            </Suspense>
                        </div>
                    </section>
                </main>

                <Suspense fallback={<SectionLoading height="200px" />}>
                    <FooterAprimorado />
                </Suspense>

                {/* Botão flutuante de WhatsApp */}
                <WhatsAppButton
                    phoneNumber="5511981845016"
                    message="Olá! Gostaria de mais informações sobre imóveis em Guararema (via site)"
                    pulseAnimation={true}
                    showAfterScroll={true}
                />

                {/* Optimized banner de feedback para nova versão */}
                <OptimizedFeedbackBanner />
            </OptimizationProvider>
        </div>
    );
}