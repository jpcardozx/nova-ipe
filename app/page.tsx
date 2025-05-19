'use client';

import React, { useState, useEffect } from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import OptimizationProvider from './components/OptimizationProvider';
// Dynamic imports for better performance and Web Vitals during development
import dynamic from 'next/dynamic';
import { ArrowRight, Check, Home as HomeIcon, MapPin } from 'lucide-react';

// Lazy load heavier components with proper type handling
const MotionComponentWrapper = dynamic(
  () => import('framer-motion').then((mod) => ({
    default: mod.motion.div
  })),
  { ssr: false }
);

// Create a typed wrapper for motion components
const motion = {
  div: MotionComponentWrapper,
  section: dynamic(() => import('framer-motion').then((mod) => ({ default: mod.motion.section })), { ssr: false }),
  button: dynamic(() => import('framer-motion').then((mod) => ({ default: mod.motion.button })), { ssr: false }),
};
const HomepageLoadingOptimizer = dynamic(() => import('./components/HomepageLoadingOptimizer'), { ssr: true });
// Lazy load less frequently used icons
const Award = dynamic(() => import('lucide-react').then(mod => mod.Award));
const Building2 = dynamic(() => import('lucide-react').then(mod => mod.Building2));
const Shield = dynamic(() => import('lucide-react').then(mod => mod.Shield));
const Star = dynamic(() => import('lucide-react').then(mod => mod.Star));
const Zap = dynamic(() => import('lucide-react').then(mod => mod.Zap));

// Importações para dados dinâmicos do Sanity
import { getImoveisDestaque, getImoveisAluguel } from '@/lib/queries';
import { normalizeDocuments } from '@/lib/sanity-utils';
import { processEnhancedSanityImage } from '@/lib/enhanced-sanity-image';
import { ensureValidImageUrl } from '@/lib/sanity-image-utils';
import type { ImovelClient } from '@/src/types/imovel-client';

// UI Components - lazy load non-critical components
const SectionHeader = dynamic(() => import('./components/ui/SectionHeader'), { ssr: true });

// Componentes otimizados
import EnhancedHero from "./components/EnhancedHero";
import NavbarResponsive from "./components/NavbarResponsive";
import Footer from "./sections/Footer";
import ClientProgressSteps from './components/ClientProgressSteps';
import WhatsAppButton from './components/WhatsAppButton';
import SkipToContent from './components/SkipToContent';
import BlocoExploracaoSimbolica from './components/BlocoExploracaoSimbolica';
import BlocoCTAConversao from './components/client/BlocoCTAConversao';
import Destaques from './sections/Destaques';
import { ImovelHero } from './components/ImoveisDestaqueComponents';

// Componentes de imóveis otimizados e com informações aprimoradas
import ImprovedPropertiesDisplay from './components/ImprovedPropertiesDisplay';

// Componentes Client otimizados
import ClientCarouselWrapper from './components/ClientCarouselWrapper';
import ClientSidePropertiesProvider from './components/ClientComponents';

// Importando tipos e componentes
import type { PropertyType } from './components/OptimizedPropertyCard';
import Valor from './sections/Valor';
import FormularioContatoAprimorado from './components/FormularioContato';
import Testimonials from './sections/Testimonials';
import { ensureNonNullProperties, extractSlugString } from './PropertyTypeFix';

/**
 * Transforma dados do Sanity para o formato esperado pelos componentes
 * com tratamento robusto de erros e validação
 * 
 * @param imovel Objeto de imóvel do Sanity
 * @param propertyType Tipo de propriedade (venda/aluguel)
 * @returns Objeto formatado para uso nos componentes
 */
function transformPropertyData(imovel: ImovelClient, propertyType: PropertyType) {
  try {
    if (!imovel) {
      console.error('Objeto de imóvel inválido ou indefinido');
      return null;
    }

    // Processar a imagem usando nosso utilitário aprimorado
    const processedImage = processEnhancedSanityImage(
      imovel.imagem,
      imovel.titulo || 'Imóvel'
    );

    // Validação e conversão de tipos para todos os campos numéricos
    const price = typeof imovel.preco === 'number' ? imovel.preco :
      typeof imovel.preco === 'string' ? parseFloat(imovel.preco) || 0 : 0;

    const area = typeof imovel.areaUtil === 'number' ? imovel.areaUtil :
      typeof imovel.areaUtil === 'string' ? parseFloat(imovel.areaUtil) : undefined;

    const bedrooms = typeof imovel.dormitorios === 'number' ? imovel.dormitorios :
      typeof imovel.dormitorios === 'string' ? parseInt(imovel.dormitorios, 10) : undefined;

    const bathrooms = typeof imovel.banheiros === 'number' ? imovel.banheiros :
      typeof imovel.banheiros === 'string' ? parseInt(imovel.banheiros, 10) : undefined;

    const parkingSpots = typeof imovel.vagas === 'number' ? imovel.vagas :
      typeof imovel.vagas === 'string' ? parseInt(imovel.vagas, 10) : undefined;

    // Extrair slug usando a função utilitária que lida com diferentes formatos
    const slug = extractSlugString(imovel.slug, imovel._id);

    return {
      id: imovel._id,
      title: imovel.titulo || 'Imóvel em destaque',
      slug,
      location: imovel.bairro || '',
      city: imovel.cidade || 'Guararema',
      price,
      propertyType,
      area,
      bedrooms,
      bathrooms,
      parkingSpots,
      mainImage: {
        url: processedImage.url,
        alt: processedImage.alt,
        responsive: processedImage.responsiveUrls
      },
      isHighlight: true,
      isPremium: Boolean(imovel.destaque),
      isNew: propertyType === 'rent' && Math.random() > 0.7,
    };
  } catch (error) {
    console.error('Erro grave ao transformar dados do imóvel:', error);
    // Retornar objeto null para ser filtrado posteriormente
    return null;
  }
}

// Import the development proxy utility
import { fetchSanityWithProxy } from '@/lib/sanity/development-proxy';
import { queryImoveisDestaque, queryImoveisAluguel } from '@/lib/queries';

/**
 * Busca e processa dados de propriedades do Sanity com validação robusta
 * e tratamento de erros aprimorado usando proxy em ambiente de desenvolvimento
 */
async function fetchPropertiesData() {
  try {
    console.log('Iniciando busca de propriedades do Sanity');

    // Buscar dados com tratamento de erro aprimorado para cada chamada
    let imoveisDestaque = [];
    let imoveisAluguel = []; try {
      // Aumentado timeout para 30 segundos para dar mais tempo em ambientes lentos
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Fetch destaques timeout')), 30000);
      });

      // Retry mechanism for fetchDestaques
      const fetchWithRetry = async (fetchFunction: () => Promise<any>, retries = 3, delay = 5000): Promise<any> => {
        for (let attempt = 1; attempt <= retries; attempt++) {
          try {
            return await fetchFunction();
          } catch (error) {
            if (attempt < retries) {
              console.warn(`Retrying fetch (attempt ${attempt} of ${retries})...`);
              await new Promise(resolve => setTimeout(resolve, delay));
            } else {
              throw error;
            }
          }
        }
      };

      // Updated fetchDestaques with retry mechanism
      const fetchDestaques = async () => {
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Fetch destaques timeout')), 30000);
        });

        const fetchFunction = process.env.NODE_ENV === 'development'
          ? () => fetchSanityWithProxy(queryImoveisDestaque)
          : () => getImoveisDestaque();

        return await Promise.race([
          fetchWithRetry(fetchFunction),
          timeoutPromise
        ]);
      };

      // Replace the original fetchDestaques call
      imoveisDestaque = await fetchDestaques();

      console.log(`Obtidos ${imoveisDestaque?.length || 0} imóveis em destaque`);
    } catch (error) {
      console.error('Erro ao buscar imóveis em destaque:', error);
      imoveisDestaque = [];
    } try {
      // Aumentado timeout para 30 segundos para dar mais tempo em ambientes lentos
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Fetch aluguel timeout')), 30000);
      });

      // Retry mechanism for fetchAluguel
      const fetchWithRetry = async (fetchFunction: () => Promise<any>, retries = 3, delay = 5000): Promise<any> => {
        for (let attempt = 1; attempt <= retries; attempt++) {
          try {
            return await fetchFunction();
          } catch (error) {
            if (attempt < retries) {
              console.warn(`Retrying fetch (attempt ${attempt} of ${retries})...`);
              await new Promise(resolve => setTimeout(resolve, delay));
            } else {
              throw error;
            }
          }
        }
      };

      // Updated fetchAluguel with retry mechanism
      const fetchAluguel = async () => {
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Fetch aluguel timeout')), 30000);
        });

        const fetchFunction = process.env.NODE_ENV === 'development'
          ? () => fetchSanityWithProxy(queryImoveisAluguel)
          : () => getImoveisAluguel();

        return await Promise.race([
          fetchWithRetry(fetchFunction),
          timeoutPromise
        ]);
      };

      // Replace the original fetchAluguel call
      imoveisAluguel = await fetchAluguel();

      console.log(`Obtidos ${imoveisAluguel?.length || 0} imóveis para aluguel`);
    } catch (error) {
      console.error('Erro ao buscar imóveis para aluguel:', error);
      imoveisAluguel = [];
    }

    // Normalização com validação após retry
    const destaques = normalizeDocuments<ImovelClient>(imoveisDestaque);
    const aluguel = normalizeDocuments<ImovelClient>(imoveisAluguel);

    // Processamento com validação de valores nulos
    const destaquesProcessados = ensureNonNullProperties(
      destaques.map(imovel => transformPropertyData(
        imovel,
        imovel.finalidade === 'Venda' ? 'sale' : 'rent' as PropertyType
      ))
    );

    const aluguelProcessados = ensureNonNullProperties(
      aluguel.map(imovel => transformPropertyData(imovel, 'rent' as PropertyType))
    );

    console.log('Imóveis processados com sucesso:',
      `Destaques: ${destaquesProcessados.length},`,
      `Aluguel: ${aluguelProcessados.length}`
    );

    return {
      destaques: destaquesProcessados,
      aluguel: aluguelProcessados,
    };
  } catch (error) {
    console.error('Erro ao buscar propriedades:', error);
    return { destaques: [], aluguel: [] };
  }
}

// Componente da página inicial otimizado para exibição de propriedades
export default function Home() {
  // Using React state to handle async data
  const [properties, setProperties] = useState<{ destaques: any[], aluguel: any[] }>({ destaques: [], aluguel: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchPropertiesData();
        setProperties(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Erro ao carregar imóveis"));
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const { destaques, aluguel } = properties;

  return (
    <div className="flex flex-col min-h-screen bg-[#fafaf9]">
      {/* Otimizador de carregamento específico para a página inicial */}
      <Suspense fallback={null}>
        <HomepageLoadingOptimizer />
      </Suspense>

      <OptimizationProvider>
        <NavbarResponsive />
        <EnhancedHero />

        {/* Provider de dados para componentes client-side */}
        <ClientSidePropertiesProvider destaques={destaques} aluguel={aluguel} />

        <BlocoExploracaoSimbolica />

        {/* Seção de Imóveis em Destaque - Versão Aprimorada */}
        <Suspense fallback={<section className="py-24 bg-white"><div className="container mx-auto px-4 max-w-7xl"><div className="animate-pulse space-y-4"><div className="h-8 w-56 bg-neutral-200 rounded-lg mb-8"></div><div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[1, 2, 3].map(i => (<div key={i} className="h-80 bg-neutral-100 rounded-lg shadow-md"></div>))}</div></div></div></section>}>
          <ImprovedPropertiesDisplay
            rawProperties={destaques}
            title={
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-amber-500" />
                <span>Imóveis Cuidadosamente Selecionados</span>
              </div>
            }
            subtitle="Descubra propriedades que se destacam pela arquitetura impecável, localização estratégica e potencial de valorização excepcional em Guararema."
            viewAllLink="/comprar"
            maxCards={6}
          />
        </Suspense>

        <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white to-[#F8FAFC]" style={{ position: 'relative' }}>
          <div className="absolute inset-0 bg-[url('/texture-elegant.png')] opacity-5 mix-blend-soft-light"></div>
          <Destaques />
        </section>

        {/* Seção de Imóveis para Alugar - Versão Aprimorada */}
        <section className="py-24 bg-[#F8FAFC]" style={{ position: 'relative' }}>
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent"></div>
          <Suspense fallback={<div className="container mx-auto px-4 max-w-7xl relative z-10"><div className="animate-pulse space-y-4"><div className="h-8 w-56 bg-neutral-200 rounded-lg mb-8"></div><div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[1, 2, 3].map(i => (<div key={i} className="h-80 bg-neutral-100 rounded-lg shadow-md"></div>))}</div></div></div>}>
            <ImprovedPropertiesDisplay
              rawProperties={aluguel}
              title={
                <div className="flex items-center gap-2">
                  <HomeIcon className="w-6 h-6 text-blue-500" />
                  <span>Seu Próximo Lar Está Aqui</span>
                </div>
              }
              subtitle="Uma seleção de imóveis para alugar que prioriza qualidade de vida, ótima localização e custo-benefício real. Experimente morar com qualidade em Guararema."
              viewAllLink="/alugar"
              maxCards={6}
            />
          </Suspense>
        </section>

        <div className="relative bg-white">
          <div className="absolute inset-0 bg-[url('/texture-elegant.png')] opacity-5 mix-blend-soft-light"></div>
          <Valor />
        </div>

        <section className="py-24 bg-gradient-to-b from-white to-[#F8FAFC]">
          <div className="container mx-auto px-4 max-w-7xl">
            <SectionHeader
              badge="Histórias de Sucesso"
              badgeColor="amber"
              title="O que Nossos Clientes Dizem"
              description="Descubra como ajudamos famílias e investidores a encontrarem o imóvel perfeito em Guararema."
            />
            <Testimonials />
          </div>
        </section>

        <section className="py-24 bg-[#F8FAFC] relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-transparent"></div>
          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <SectionHeader
              badge="Processo Simplificado"
              badgeColor="green"
              title="Sua Jornada Imobiliária"
              description="Conduzimos você por cada etapa com transparência e eficiência, transformando a busca pelo imóvel ideal em uma experiência agradável e segura."
            />
            <div className='rounded-lg bg-white shadow-xl p-8 ease-in-out duration-300 hover:shadow-2xl'>
              <ClientProgressSteps />
            </div>
          </div>
        </section>        <section className="relative py-24 overflow-hidden bg-gradient-to-b from-[#F8FAFC] to-white">
          <div className="absolute inset-0 bg-[url('/texture-elegant.png')] opacity-5 mix-blend-soft-light"></div>
          <FormularioContatoAprimorado />
        </section>

        <Footer />

        {/* Renderização dos componentes de Web Vitals no modo de desenvolvimento */}
        {process.env.NODE_ENV !== 'production' && (
          <Suspense fallback={null}>
            <WebVitalsDebuggerWrapper />
          </Suspense>
        )}
        <Suspense fallback={null}>
          <ClientWebVitals />
        </Suspense>
      </OptimizationProvider>
    </div>
  );
}

// Componente de loading para propriedades
const PropertiesLoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="h-8 w-56 bg-neutral-200 animate-pulse rounded-lg mb-8"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-80 bg-neutral-100 animate-pulse rounded-lg shadow-md"></div>
      ))}
    </div>
  </div>
);

// Carregamento dinâmico do WebVitalsDebugger apenas em desenvolvimento
const WebVitalsDebuggerWrapper = dynamic(
  () => import('./components/WebVitalsDebuggerWrapper'),
  { ssr: false }
);

// Carregamento dinâmico do ClientWebVitals para qualquer ambiente
const ClientWebVitals = dynamic(
  () => import('./components/ClientWebVitals'),
  { ssr: false }
);