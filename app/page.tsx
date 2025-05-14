import { Suspense } from 'react';
import { Montserrat } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';
import OptimizationProvider from './components/OptimizationProvider';

// Importações para dados dinâmicos do Sanity
import { getImoveisDestaque, getImoveisAluguel } from '@/lib/queries';
import { normalizeDocuments } from '@/lib/sanity-utils';
import type { ImovelClient } from '@/src/types/imovel-client';

// Componentes otimizados
import OptimizedHero from "./components/OptimizedHero";
import Navbar from "./components/Navbar";
import Footer from "./sections/Footer";
import ClientProgressSteps from './components/ClientProgressSteps';
import BlocoExploracaoSimbolica from './components/BlocoExploracaoSimbolica';
import BlocoCTAConversao from './components/client/BlocoCTAConversao';
import Destaques from './sections/Destaques';
import { ImovelHero } from './components/ImoveisDestaqueComponents';

// Componente Client para o carousel
import ClientCarouselWrapper from './components/ClientCarouselWrapper';

// Configuração da fonte
const montSerrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-montserrat',
});

// Importando tipos e componentes
import type { PropertyType } from './components/OptimizedPropertyCard';
import Valor from './sections/Valor';
import FormularioContatoAprimorado from './components/FormularioContato';
import { default as ClientSidePropertiesProvider } from './components/ClientComponents';
import Testimonials from './sections/Testimonials';

/**
 * Função para buscar imóveis de destaque diretamente do Sanity
 * Usa Server Components para otimizar o carregamento inicial
 */
async function getDestaquesImobiliarios(): Promise<any[]> {
  try {
    // Buscar do Sanity com dados completos
    const imoveisData = await getImoveisDestaque();
    const imoveisNormalizados = normalizeDocuments<ImovelClient>(imoveisData);

    // Converter para o formato esperado pelo componente
    return imoveisNormalizados.map(imovel => ({
      id: imovel._id,
      title: imovel.titulo || 'Imóvel em destaque',
      slug: imovel.slug,
      location: imovel.bairro || '',
      city: imovel.cidade || 'Guararema',
      price: imovel.preco || 0,
      propertyType: imovel.finalidade === 'Venda' ? 'sale' : 'rent' as PropertyType,
      area: imovel.areaUtil || undefined,
      bedrooms: imovel.dormitorios || undefined,
      bathrooms: imovel.banheiros || undefined,
      parkingSpots: imovel.vagas || undefined,
      mainImage: {
        url: imovel.imagem?.url || '/images/property-placeholder.jpg',
        alt: imovel.titulo || 'Imóvel em destaque',
      },
      isHighlight: true,
      isPremium: imovel.destaque,
    }));
  } catch (error) {
    console.error('Erro ao buscar imóveis em destaque:', error);
    return [];
  }
}

/**
 * Função para buscar imóveis para aluguel diretamente do Sanity
 */
async function getImoveisAluguelDestaque(): Promise<any[]> {
  try {
    // Buscar do Sanity com dados completos
    const imoveisData = await getImoveisAluguel();
    const imoveisNormalizados = normalizeDocuments<ImovelClient>(imoveisData);

    // Converter para o formato esperado pelo componente
    return imoveisNormalizados.map(imovel => ({
      id: imovel._id,
      title: imovel.titulo || 'Imóvel para aluguel',
      slug: imovel.slug,
      location: imovel.bairro || '',
      city: imovel.cidade || 'Guararema',
      price: imovel.preco || 0,
      propertyType: 'rent' as PropertyType,
      area: imovel.areaUtil || undefined,
      bedrooms: imovel.dormitorios || undefined,
      bathrooms: imovel.banheiros || undefined,
      parkingSpots: imovel.vagas || undefined,
      mainImage: {
        url: imovel.imagem?.url || '/images/property-placeholder.jpg',
        alt: imovel.titulo || 'Imóvel para aluguel',
      },
      isNew: Math.random() > 0.7, // Simulando propriedade "novo"
      isPremium: imovel.destaque,
    }));
  } catch (error) {
    console.error('Erro ao buscar imóveis para aluguel:', error);
    return [];
  }
}

export default async function Home() {
  // Buscar dados do Sanity de forma otimizada
  const [imoveisDestaque, imoveisAluguel] = await Promise.all([
    getDestaquesImobiliarios(),
    getImoveisAluguelDestaque(),
  ]);

  return (
    <div className={`${montSerrat.className} flex flex-col min-h-screen bg-[#fafaf9]`}>
      {/* Optimization provider for client-side optimizations */}
      <OptimizationProvider>
        {/* Navegação - Com marcação de página atual */}
        <Navbar />

        {/* Hero principal com experiência visual aprimorada */}
        <OptimizedHero />

        {/* Provider para passar dados de propriedades para componentes client-side */}
        <ClientSidePropertiesProvider
          destaques={imoveisDestaque}
          aluguel={imoveisAluguel}
        />

        {/* Seção de Busca aprimorada - UI moderna e totalmente responsiva */}
        <BlocoExploracaoSimbolica />

        {/* Seção de Imóveis em Destaque - Agora com dados reais do Sanity */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-semibold mb-4 animate-fade-in">
                Portfólio Exclusivo
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-[#0D1F2D] mb-6 tracking-tight">
                Imóveis Cuidadosamente Selecionados
              </h2>
              <p className="text-lg md:text-xl text-[#0D1F2D]/70 leading-relaxed max-w-2xl mx-auto">
                Descubra propriedades que se destacam pela arquitetura impecável, localização estratégica e potencial de valorização excepcional em Guararema.
              </p>
            </div>

            <Suspense fallback={
              <div className="space-y-4">
                <div className="h-8 w-56 bg-neutral-200 animate-pulse rounded-lg mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-80 bg-neutral-100 animate-pulse rounded-lg shadow-md"></div>
                  ))}
                </div>
              </div>
            }>
              <ClientCarouselWrapper
                properties={imoveisDestaque}
                config={{
                  title: "Em Destaque",
                  subtitle: "Oportunidades exclusias em Guararema",
                  slidesToShow: 3,
                  showControls: true,
                  autoplay: true,
                  autoplayInterval: 5000,
                  viewAllLink: "/comprar",
                  viewAllLabel: "Explorar todo o portfólio",
                  className: "mb-16",
                  hasAccentBackground: false,
                  showEmptyState: imoveisDestaque.length === 0,
                  emptyStateMessage: "Carregando imóveis em destaque...",
                  mobileLayout: "stack",
                }}
              />
            </Suspense>
          </div>
        </section>

        {/* Nova seção visual de destaques com animações suaves */}
        <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white to-[#F8FAFC]">
          <div className="absolute inset-0 bg-[url('/texture-elegant.png')] opacity-5 mix-blend-soft-light"></div>
          <Destaques />
        </section>

        {/* Seção de Imóveis para Alugar - Com dados reais e UI aprimorada */}
        <section className="py-24 bg-[#F8FAFC] relative">
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent"></div>
          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-4 animate-fade-in">
                Conforto e Praticidade
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-[#0D1F2D] mb-6 tracking-tight">
                Seu Próximo Lar Está Aqui
              </h2>
              <p className="text-lg md:text-xl text-[#0D1F2D]/70 leading-relaxed max-w-2xl mx-auto">
                Uma seleção de imóveis para alugar que prioriza qualidade de vida, ótima localização e custo-benefício real. Experimente morar com qualidade em Guararema.
              </p>
            </div>

            <Suspense fallback={
              <div className="space-y-4">
                <div className="h-8 w-56 bg-neutral-200 animate-pulse rounded-lg mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-80 bg-neutral-100 animate-pulse rounded-lg shadow-md"></div>
                  ))}
                </div>
              </div>
            }>
              <ClientCarouselWrapper
                properties={imoveisAluguel}
                config={{
                  title: "Aluguel Premium",
                  subtitle: "Imóveis selecionados para seu conforto",
                  slidesToShow: 3,
                  showControls: true,
                  autoplay: true,
                  autoplayInterval: 6000,
                  viewAllLink: "/alugar",
                  viewAllLabel: "Ver todas as opções de aluguel",
                  hasAccentBackground: true,
                  showEmptyState: imoveisAluguel.length === 0,
                  emptyStateMessage: "Carregando imóveis para aluguel...",
                  mobileLayout: "stack",
                }}
              />
            </Suspense>
          </div>
        </section>

        {/* Seção de proposta de valor com UI aprimorada e animações */}
        <div className="relative bg-white">
          <div className="absolute inset-0 bg-[url('/texture-elegant.png')] opacity-5 mix-blend-soft-light"></div>
          <Valor />
        </div>

        {/* Seção de depoimentos de clientes - Nova adição para social proof */}
        <section className="py-24 bg-gradient-to-b from-white to-[#F8FAFC]">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-semibold mb-4 animate-fade-in">
                Histórias de Sucesso
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-[#0D1F2D] mb-6 tracking-tight">
                O que Nossos Clientes Dizem
              </h2>
              <p className="text-lg md:text-xl text-[#0D1F2D]/70 leading-relaxed max-w-2xl mx-auto">
                Descubra como ajudamos famílias e investidores a encontrarem o imóvel perfeito em Guararema.
              </p>
            </div>

            <Testimonials />
          </div>
        </section>

        {/* Seção de Processo do Cliente com UI modernizada */}
        <section className="py-24 bg-[#F8FAFC] relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-transparent"></div>
          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-semibold mb-4 animate-fade-in">
                Processo Simplificado
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-[#0D1F2D] mb-6 tracking-tight">
                Sua Jornada Imobiliária
              </h2>
              <p className="text-lg md:text-xl text-[#0D1F2D]/70 leading-relaxed max-w-2xl mx-auto">
                Conduzimos você por cada etapa com transparência e eficiência, transformando a busca pelo imóvel ideal em uma experiência agradável e segura.
              </p>
            </div>
            <ClientProgressSteps />
          </div>
        </section>

        {/* Formulário de contato aprimorado com validação e melhor UX */}
        <section className="relative py-24 overflow-hidden bg-gradient-to-b from-[#F8FAFC] to-white">
          <div className="absolute inset-0 bg-[url('/texture-elegant.png')] opacity-5 mix-blend-soft-light"></div>
          <FormularioContatoAprimorado />
        </section>

        {/* CTA de Conversão com elementos visuais mais atraentes */}
        <section className="bg-[#0D1F2D] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D1F2D] to-[#1a3040] mix-blend-soft-light"></div>
          <div className="absolute inset-0 bg-[url('/wood-pattern.png')] opacity-10"></div>
          <div className="container mx-auto relative z-10">
            <BlocoCTAConversao
              titulo="Vamos Encontrar Seu Espaço Ideal?"
              subtitulo="Nossa equipe está pronta para transformar sua busca imobiliária em Guararema em uma jornada personalizada e gratificante. Dê o primeiro passo agora."
              ctaText="Iniciar Conversa"
              ctaLink="https://wa.me/5511981845016?text=Olá! Gostaria de conhecer opções de imóveis em Guararema (via site)"
            />
          </div>
        </section>

        {/* Footer com links úteis e informações atualizadas */}
        <Footer />
      </OptimizationProvider>
    </div>
  );
}