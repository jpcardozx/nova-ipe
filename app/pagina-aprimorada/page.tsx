import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import OptimizationProvider from '../components/OptimizationProvider';
import { Metadata } from 'next';
import WhatsAppButton from '../components/WhatsAppButton';
import NotificacaoBanner from '../components/NotificacaoBanner';
import SkipToContent from '../components/SkipToContent';
import { FeedbackBanner } from '../components/FeedbackBanner';

// Importações para dados dinâmicos do Sanity
import { getImoveisDestaque, getImoveisAluguel } from '@/lib/queries';
import { normalizeDocuments } from '@/lib/sanity-utils';
import { extractImageUrl, extractAltText } from '@/lib/image-sanity';
import { ensureValidImageUrl } from '@/lib/sanity-image-utils';
import { loadImage } from '@/lib/enhanced-image-loader';
import type { ImovelClient } from '@/src/types/imovel-client';
import { PropertyType } from '@/components/ui/property/PropertyCard'; // Updated import for PropertyType
import { extractSlugString, ensureNonNullProperties } from '@/app/PropertyTypeFix';

// Componentes de UI
import SectionHeader from '../components/ui/SectionHeader';

// Componentes aprimorados
import EnhancedHero from "../components/EnhancedHero";
import NavbarResponsive from "../components/NavbarResponsive";
import FooterAprimorado from "../sections/FooterAprimorado";
import ClientProgressSteps from '../components/ClientProgressSteps';
import BlocoExploracaoSimbolica from '../components/BlocoExploracaoSimbolica';
import BlocoCTAConversao from '../components/client/BlocoCTAConversao';
import DestaquesSanityCarousel from '../components/DestaquesSanityCarousel';
import ValorAprimorado from '../sections/ValorAprimorado';
import FormularioContato from '../components/FormularioContato';
import DestaquesEstrategicos from '../sections/Destaques';
import { ExclusiveAnalysisOffer } from '../sections/ExclusiveAnalysisOffer';

/**
 * Transforma dados do Sanity para o formato esperado pelos componentes
 * com tratamento robusto de erros e validação
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
        }        // Processar imagem com nossa solução aprimorada
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
            isPremium: imovel.destaque || false, // Usando destaque como flag para premium
            // Usando uma solução mais segura para determinar imóveis novos - baseada no ID e timestamp atual
            isNew: imovel._id ? imovel._id.startsWith('temp-') || imovel._id.length > 20 : false
        };
    } catch (error) {
        console.error(`Erro ao transformar imóvel: ${error}`);
        return null;
    }
}

// Componente principal da página
export default async function NovaPaginaInicial() {
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

                <NavbarResponsive />

                <main id="main-content" className="overflow-hidden">
                    {/* Hero Section com Formulário de Contato */}
                    <EnhancedHero />

                    {/* Análise estrutural e estratégica do mercado */}
                    <section id="analise-mercado" className="py-24 bg-white">
                        <div className="container mx-auto px-4">
                            <ExclusiveAnalysisOffer variant="investor" />
                        </div>
                    </section>

                    {/* Destaques estratégicos da região */}
                    <section id="destaques-estrategicos" className="py-20 bg-gradient-to-b from-gray-50 to-white">
                        <div className="container mx-auto px-4">
                            <DestaquesEstrategicos />
                        </div>
                    </section>

                    {/* Imóveis em Destaque */}
                    <section id="imoveis-destaque" className="py-16 bg-gray-50">
                        <Suspense fallback={<PropertiesLoadingSkeleton />}>
                            <DestaquesSanityCarousel
                                rawProperties={[...destaqueFormatados]}
                                title="Imóveis em Destaque"
                                subtitle="Selecionamos as melhores opções em Guararema para você conhecer"
                            />
                        </Suspense>
                    </section>

                    {/* Proposta de Valor Diferenciada */}
                    <section id="valor" className="relative bg-white">
                        <div className="absolute inset-0 bg-[url('/texture-elegant.png')] opacity-5 mix-blend-soft-light"></div>
                        <ValorAprimorado />
                    </section>

                    {/* Jornada do Cliente - Transparência no Processo */}
                    <section id="jornada" className="py-24 bg-[#F8FAFC] relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-transparent"></div>
                        <div className="container mx-auto px-4 max-w-7xl relative z-10">
                            <SectionHeader
                                title="Sua Jornada Imobiliária"
                                subtitle="Conduzimos você por cada etapa com transparência e eficiência, transformando a busca pelo imóvel ideal em uma experiência agradável e segura."
                                align="center"
                            />
                            <ClientProgressSteps />
                        </div>
                    </section>

                    {/* Formulário de Contato Principal */}
                    <section id="contato" className="relative py-24 overflow-hidden bg-gradient-to-b from-[#F8FAFC] to-white">
                        <div className="absolute inset-0 bg-[url('/texture-elegant.png')] opacity-5 mix-blend-soft-light"></div>
                        <FormularioContato />
                    </section>

                    {/* CTA Final de Conversão */}
                    <section className="bg-[#0D1F2D] relative overflow-hidden py-16">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1F2D] to-[#1a3040] mix-blend-soft-light"></div>
                        <div className="absolute inset-0 bg-[url('/wood-pattern.png')] opacity-10"></div>
                        <div className="container mx-auto relative z-10">
                            <BlocoCTAConversao
                                titulo="Vamos Encontrar Seu Espaço Ideal?"
                                subtitulo="Nossa equipe está pronta para transformar sua busca imobiliária em Guararema em uma jornada personalizada e gratificante. Dê o primeiro passo agora."
                                ctaText="Agendar Consulta Gratuita"
                                ctaLink="https://wa.me/5511981845016?text=Olá! Gostaria de conhecer opções de imóveis em Guararema (via site)"
                            />
                        </div>
                    </section>
                </main>

                <FooterAprimorado />

                {/* Botão flutuante de WhatsApp */}
                <WhatsAppButton
                    phoneNumber="5511981845016"
                    message="Olá! Gostaria de mais informações sobre imóveis em Guararema (via site)"
                    pulseAnimation={true}
                    showAfterScroll={true}
                />

                {/* Banner de feedback para nova versão */}
                <FeedbackBanner />
            </OptimizationProvider>
        </div>
    );
}

// Componente de loading para propriedades
const PropertiesLoadingSkeleton = () => (
    <div className="container mx-auto px-4 space-y-4">
        <div className="h-8 w-56 bg-neutral-200 animate-pulse rounded-lg mb-8"></div>
        <div className="h-5 w-96 bg-neutral-100 animate-pulse rounded-lg mb-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-80 bg-neutral-100 animate-pulse rounded-xl shadow-sm">
                    <div className="h-40 bg-neutral-200 animate-pulse rounded-t-xl"></div>
                    <div className="p-4 space-y-3">
                        <div className="h-6 bg-neutral-200 animate-pulse rounded-md w-3/4"></div>
                        <div className="h-5 bg-neutral-100 animate-pulse rounded-md w-1/2"></div>
                        <div className="flex gap-3">
                            <div className="h-8 w-8 bg-neutral-100 animate-pulse rounded-md"></div>
                            <div className="h-8 w-8 bg-neutral-100 animate-pulse rounded-md"></div>
                            <div className="h-8 w-8 bg-neutral-100 animate-pulse rounded-md"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
