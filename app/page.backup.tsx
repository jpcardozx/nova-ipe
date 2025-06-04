import { Suspense } from 'react';
import dynamic from 'next/dynamic';

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

// === FALLBACK COMPONENTS ===
import { HeroLoadingFallback, PropertyLoadingFallback, ErrorFallback } from './components/ErrorBoundaryComponents';

// === DYNAMIC IMPORTS - PROPER CLIENT/SERVER SEPARATION ===
const ProfessionalHero = dynamic(() => import('./components/ProfessionalHero'), {
  ssr: false,
  loading: () => <HeroLoadingFallback />
});

const ClientPropertySection = dynamic(() => import('./components/ClientPropertySection').then(mod => ({ default: mod.ClientPropertySection })), {
  ssr: false,
  loading: () => <PropertyLoadingFallback />
});

export default async function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <OptimizationProvider>
        <ClientOnlyNavbar />        {/* Hero Section - Premium */}
        <Suspense fallback={<HeroLoadingFallback />}>
          <ProfessionalHero />
        </Suspense>

        {/* Seção de Exploração - Contextualização Premium */}
        <Suspense fallback={<UnifiedLoading />}>
          <BlocoExploracaoGuararema />
        </Suspense>        {/* === PROFESSIONAL PROPERTY SECTIONS === */}
        {/* SEÇÃO 1: IMÓVEIS À VENDA EM DESTAQUE - Premium Sales Highlights */}
        <Suspense fallback={
          <div className="min-h-[400px] bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 animate-pulse rounded-lg flex items-center justify-center">
            <div className="text-amber-800 text-lg">Carregando vendas...</div>
          </div>
        }>
          <ClientPropertySection
            type="sale"
            title="Oportunidades Exclusivas de Compra"
            subtitle="Imóveis premium selecionados em Guararema - Investimentos com alta valorização"
            viewAllLink="/comprar"
            viewAllLabel="Ver todos os imóveis à venda"
            className="py-20 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50"
          />
        </Suspense>

        {/* SEÇÃO 2: IMÓVEIS PARA ALUGUEL EM DESTAQUE - Premium Rental Highlights */}
        <Suspense fallback={
          <div className="min-h-[400px] bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 animate-pulse rounded-lg flex items-center justify-center">
            <div className="text-orange-800 text-lg">Carregando aluguéis...</div>
          </div>
        }>
          <ClientPropertySection
            type="rent"
            title="Aluguéis Premium Selecionados"
            subtitle="Propriedades para locação com filtros inteligentes e qualidade superior"
            viewAllLink="/alugar"
            viewAllLabel="Ver todos os imóveis para alugar"
            className="py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50"
          />
        </Suspense>{/* Seção de Valor Aprimorado - SSR com dados reais */}
        <ValorAprimorado
          properties={[]}
          title="Histórico de Valorizações em Guararema"
          description="Acompanhe a evolução do mercado imobiliário e as oportunidades de investimento."
          ctaLink="/valorizar"
          ctaText="Ver relatório de valorização"
          badge="Mercado"
        />

        {/* Seção de Referências - SSR com dados reais */}
        <Referencias
          title="Depoimentos de Clientes"
          description="A confiança dos nossos clientes é o nosso maior patrimônio."
          ctaLink="/depoimentos"
          ctaText="Ver todos os depoimentos"
          badge="Credibilidade"
        />

        {/* Seção de Análise de Mercado - SSR com dados reais */}
        <MarketAnalysisSection
          title="Relatório do Mercado Imobiliário"
          description="Análises técnicas e tendências do setor em Guararema e região."
          ctaLink="/download"
          ctaText="Baixar relatório completo"
          badge="Relatório"
        />

        {/* Client Progress Steps */}
        <Suspense fallback={<UnifiedLoading />}>
          <ClientProgressSteps />
        </Suspense>        {/* Seção de Contato - SSR com dados reais */}
        <FormularioContatoSubtil
          title="Consultoria Imobiliária Especializada"
          description="Solicite uma avaliação gratuita ou tire suas dúvidas com nossos especialistas."
          ctaText="Solicitar contato"
          badge="Atendimento"
        />

        {/* Rodapé Aprimorado - SSR com dados reais */}
        <FooterAprimorado />
      </OptimizationProvider>
    </main>
  );
}
