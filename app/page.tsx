import { Suspense } from 'react';
import { Montserrat } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';
import OptimizationProvider from './components/OptimizationProvider';
import AnuncioNovaVersao from './components/AnuncioNovaVersao';

// Importações para dados dinâmicos do Sanity
import { getImoveisDestaque, getImoveisAluguel } from '@/lib/queries';
import { normalizeDocuments } from '@/lib/sanity-utils';
import { extractImageUrl, extractAltText } from '@/lib/image-sanity';
import { ensureValidImageUrl } from '@/lib/sanity-image-utils';
import type { ImovelClient } from '@/src/types/imovel-client';

// UI Components
import SectionHeader from './components/ui/SectionHeader';

// Componentes otimizados
import EnhancedHero from "./components/EnhancedHero";
import NavbarResponsive from "./components/NavbarResponsive";
import Footer from "./sections/Footer";
import ClientProgressSteps from './components/ClientProgressSteps';
import BlocoExploracaoSimbolica from './components/BlocoExploracaoSimbolica';
import BlocoCTAConversao from './components/client/BlocoCTAConversao';
import Destaques from './sections/Destaques';
import { ImovelHero } from './components/ImoveisDestaqueComponents';

// Componentes Client otimizados
import ClientCarouselWrapper from './components/ClientCarouselWrapper';
import DestaquesSanityCarousel from './components/DestaquesSanityCarousel';

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

    // Debug da estrutura da imagem para entender melhor o problema
    console.log(`Transformando imóvel ${imovel._id || 'sem ID'}:`, {
      temImagem: !!imovel.imagem,
      tipoImagem: imovel.imagem ? typeof imovel.imagem : 'undefined',
      temAsset: imovel.imagem?.asset ? true : false,
      assetTemUrl: imovel.imagem?.asset?.url ? true : false,
      assetTemRef: imovel.imagem?.asset?._ref ? true : false,
      refValue: imovel.imagem?.asset?._ref || 'não disponível',
    });    // Validar estruturas de dados essenciais
    if (!imovel._id) {
      console.warn('Imóvel sem ID encontrado, gerando ID temporário');
      imovel._id = `temp-${Date.now()}`;
    }    // Extrair e normalizar a imagem usando nossas funções aprimoradas
    console.log(`\n📷 Processando imagem para imóvel ${imovel._id} (${imovel.titulo || 'sem título'})`);

    // Primeiro verificar o formato da imagem para depuração
    if (imovel.imagem) {
      console.log(`- Tipo de imagem: ${typeof imovel.imagem}`);
      if (typeof imovel.imagem === 'object') {
        console.log(`- Propriedades disponíveis: ${Object.keys(imovel.imagem).join(', ')}`);
        if (imovel.imagem.asset) {
          console.log(`- Possui referência Sanity: ${!!imovel.imagem.asset._ref}`);
        }
      }
    } else {
      console.warn(`- ⚠️ Imóvel ${imovel._id} não possui imagem definida`);
    }

    // Agora extrair com tratamento de erro aprimorado
    let processedImage;
    try {
      // Usar a função robusta para normalização de imagem
      processedImage = ensureValidImageUrl(
        imovel.imagem,
        '/images/property-placeholder.jpg',
        imovel.titulo || 'Imóvel'
      );

      if (processedImage.url && !processedImage.url.includes('placeholder')) {
        console.log(`✅ URL extraída com sucesso: ${processedImage.url.substring(0, 60)}...`);
      } else {
        console.warn(`⚠️ Usando imagem placeholder para ${imovel._id}`);
      }
    } catch (error) {
      console.error(`❌ Erro crítico ao processar imagem para imóvel ${imovel._id}:`, error);
      processedImage = {
        url: '/images/property-placeholder.jpg',
        alt: imovel.titulo || 'Imóvel'
      };
    }

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
      typeof imovel.vagas === 'string' ? parseInt(imovel.vagas, 10) : undefined;    // Extrair slug usando a função utilitária que lida com diferentes formatos
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
      parkingSpots, mainImage: processedImage, // Keep the entire processed image object
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

/**
 * Busca e processa dados de propriedades do Sanity com validação robusta
 * e tratamento de erros aprimorado
 */
async function fetchPropertiesData() {
  try {
    console.log('Iniciando busca de propriedades do Sanity');

    // Buscar dados com tratamento de erro para cada chamada
    let imoveisDestaque = [];
    let imoveisAluguel = [];

    try {
      imoveisDestaque = await getImoveisDestaque();
      console.log(`Obtidos ${imoveisDestaque.length} imóveis em destaque`);
    } catch (error) {
      console.error('Erro ao buscar imóveis em destaque:', error);
      imoveisDestaque = [];
    }

    try {
      imoveisAluguel = await getImoveisAluguel();
      console.log(`Obtidos ${imoveisAluguel.length} imóveis para aluguel`);
    } catch (error) {
      console.error('Erro ao buscar imóveis para aluguel:', error);
      imoveisAluguel = [];
    }

    console.log('Imóveis recebidos:',
      `Destaques: ${imoveisDestaque.length},`,
      `Aluguel: ${imoveisAluguel.length}`
    );

    // Diagnóstico detalhado do formato recebido
    if (imoveisDestaque.length > 0) {
      const sample = imoveisDestaque[0];
      console.log('Exemplo de estrutura de imóvel recebido:', {
        id: sample._id,
        temImagem: !!sample?.imagem,
        tipoImagem: typeof sample?.imagem,
        estruturaImagemResumo: sample?.imagem ?
          `asset: ${!!sample.imagem.asset}, ref: ${!!sample.imagem.asset?._ref}` :
          'sem imagem',
        amostraRef: sample?.imagem?.asset?._ref ?
          sample.imagem.asset._ref.substring(0, 30) + '...' :
          'N/A'
      });
    }

    // Normalização com validação
    const destaques = normalizeDocuments<ImovelClient>(imoveisDestaque);
    const aluguel = normalizeDocuments<ImovelClient>(imoveisAluguel);

    console.log('Imóveis normalizados:',
      `Destaques: ${destaques.length},`,
      `Aluguel: ${aluguel.length}`
    );    // Transformação com filtragem de valores nulos usando função especializada
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

export default async function Home() {
  // Buscar dados de propriedades
  const { destaques, aluguel } = await fetchPropertiesData(); return (
    <div className={`${montSerrat.className} flex flex-col min-h-screen bg-[#fafaf9]`}>
      <OptimizationProvider>
        <AnuncioNovaVersao />
        <NavbarResponsive />

        <EnhancedHero />

        {/* Provider de dados para componentes client-side */}
        <ClientSidePropertiesProvider destaques={destaques} aluguel={aluguel} />        <BlocoExploracaoSimbolica />

        {/* Seção de Imóveis em Destaque - Versão Aprimorada */}
        <Suspense fallback={<section className="py-24 bg-white"><div className="container mx-auto px-4 max-w-7xl"><PropertiesLoadingSkeleton /></div></section>}>          <DestaquesSanityCarousel
          rawProperties={destaques}
          title="Imóveis Cuidadosamente Selecionados"
          subtitle="Descubra propriedades que se destacam pela arquitetura impecável, localização estratégica e potencial de valorização excepcional em Guararema."
        />
        </Suspense>

        {/* Componente legacy escondido (temporário) */}
        <div className="hidden">
          <ClientCarouselWrapper
            properties={destaques}
            config={{
              title: "",
              subtitle: "",
              slidesToShow: 3,
              showControls: true,
              autoplay: true,
              autoplayInterval: 5000,
              viewAllLink: "/comprar",
              viewAllLabel: "Explorar todo o portfólio",
              className: "mb-16",
              hasAccentBackground: false,
              showEmptyState: destaques.length === 0,
              emptyStateMessage: "Carregando imóveis em destaque...",
              mobileLayout: "stack",
            }}
          />
        </div>        <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white to-[#F8FAFC]" style={{ position: 'relative' }}>
          <div className="absolute inset-0 bg-[url('/texture-elegant.png')] opacity-5 mix-blend-soft-light"></div>
          <Destaques />        </section>        {/* Seção de Imóveis para Alugar - Versão Aprimorada */}
        <section className="py-24 bg-[#F8FAFC]" style={{ position: 'relative' }}>
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent"></div>
          <Suspense fallback={<div className="container mx-auto px-4 max-w-7xl relative z-10"><PropertiesLoadingSkeleton /></div>}>            <DestaquesSanityCarousel
            rawProperties={aluguel}
            title="Seu Próximo Lar Está Aqui"
            subtitle="Uma seleção de imóveis para alugar que prioriza qualidade de vida, ótima localização e custo-benefício real. Experimente morar com qualidade em Guararema."
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
            <ClientProgressSteps />
          </div>
        </section>

        <section className="relative py-24 overflow-hidden bg-gradient-to-b from-[#F8FAFC] to-white">
          <div className="absolute inset-0 bg-[url('/texture-elegant.png')] opacity-5 mix-blend-soft-light"></div>
          <FormularioContatoAprimorado />
        </section>

        <Footer />
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