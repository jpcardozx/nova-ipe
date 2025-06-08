import { Metadata } from 'next';
import { Suspense } from 'react';
import { motion } from 'framer-motion';

// Modern Formal Components
import FormalHero from './components/FormalHero';
import ElegantPropertyCard from './components/ElegantPropertyCard';
import FormalContactForm from './components/FormalContactForm';
import FooterAprimorado from './sections/FooterAprimorado';

// Utilities
import { getImoveisDestaque } from '@/lib/queries';
import type { ImovelClient } from '@/src/types/imovel-client';

export const metadata: Metadata = {
  title: 'Nova Ipê Imóveis - Sua Casa dos Sonhos Te Espera | Guararema, SP',
  description: 'Há mais de 15 anos conectando famílias aos imóveis perfeitos em Guararema e região. Casas, apartamentos e terrenos com transparência e profissionalismo.',
  keywords: 'imóveis Guararema, casas venda, apartamentos aluguel, terrenos, Nova Ipê, imobiliária',
  openGraph: {
    title: 'Nova Ipê Imóveis - Imobiliária Premium em Guararema',
    description: 'Encontre seu imóvel ideal com a Nova Ipê. 15+ anos de experiência, 500+ imóveis vendidos.',
    images: [
      {
        url: '/images/og-image-2025.jpg',
        width: 1200,
        height: 630,
        alt: 'Nova Ipê Imóveis - Guararema'
      }
    ],
    locale: 'pt_BR',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nova Ipê Imóveis - Guararema, SP',
    description: 'Sua casa dos sonhos te espera. Mais de 15 anos conectando famílias aos imóveis perfeitos.',
    images: ['/images/og-image-2025.jpg']
  }
};

// Property data transformation
const transformImovelToCardProps = (imovel: ImovelClient) => ({
  id: imovel._id || '',
  titulo: imovel.titulo || 'Imóvel Disponível',
  slug: imovel.slug?.current || imovel.slug || '',
  preco: imovel.preco || 0,
  finalidade: (imovel.finalidade?.toLowerCase() === 'venda' ? 'venda' : 'aluguel') as 'venda' | 'aluguel',
  bairro: imovel.bairro,
  cidade: imovel.cidade || 'Guararema',
  dormitorios: imovel.dormitorios,
  banheiros: imovel.banheiros,
  vagas: imovel.vagas,
  areaUtil: imovel.areaUtil,
  imagem: imovel.imagem ? {
    imagemUrl: imovel.imagem.imagemUrl || '/images/property-placeholder.jpg',
    alt: imovel.imagem.alt || imovel.titulo || 'Imóvel Nova Ipê'
  } : undefined,
  destaque: true
});

// Featured Properties Section
const FeaturedProperties = async () => {
  try {
    const imoveis = await getImoveisDestaque();
    const properties = imoveis?.slice(0, 6).map(transformImovelToCardProps) || [];

    if (properties.length === 0) {
      return (
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-light text-slate-900 mb-4">
              Imóveis em <span className="font-semibold text-amber-600">Destaque</span>
            </h2>
            <p className="text-slate-600">Novos imóveis em breve. Entre em contato conosco!</p>
          </div>
        </section>
      );
    }

    return (
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-slate-900 mb-4">
              Imóveis em <span className="font-semibold text-amber-600">Destaque</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Seleção especial dos melhores imóveis disponíveis em Guararema e região
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property, index) => (
              <ElegantPropertyCard
                key={property.id}
                {...property}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <a 
              href="/comprar"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-medium transition-colors"
            >
              Ver Todos os Imóveis
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error loading featured properties:', error);
    return (
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-light text-slate-900 mb-4">
            Imóveis em <span className="font-semibold text-amber-600">Destaque</span>
          </h2>
          <p className="text-slate-600">
            Estamos atualizando nosso catálogo. Entre em contato para conhecer as opções disponíveis.
          </p>
        </div>
      </section>
    );
  }
};

// Trust & Credibility Section
const TrustSection = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-light text-slate-900 mb-4">
          Por que escolher a <span className="font-semibold text-amber-600">Nova Ipê</span>?
        </h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Mais de uma década de experiência no mercado imobiliário de Guararema
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            title: "Experiência Comprovada",
            description: "Mais de 15 anos no mercado imobiliário de Guararema e região",
            icon: "🏆"
          },
          {
            title: "Transparência Total",
            description: "Documentação completa e processos claros em todas as negociações",
            icon: "🤝"
          },
          {
            title: "Atendimento Personalizado",
            description: "Cada cliente é único e merece uma abordagem personalizada",
            icon: "⭐"
          }
        ].map((item, index) => (
          <div key={index} className="text-center p-8 rounded-2xl hover:bg-slate-50 transition-colors">
            <div className="text-4xl mb-4">{item.icon}</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">{item.title}</h3>
            <p className="text-slate-600 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Loading Components
const LoadingProperties = () => (
  <section className="py-20 bg-slate-50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <div className="h-8 bg-slate-200 rounded w-64 mx-auto mb-4 animate-pulse" />
        <div className="h-6 bg-slate-200 rounded w-96 mx-auto animate-pulse" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-200">
            <div className="h-64 bg-slate-200 animate-pulse" />
            <div className="p-6 space-y-4">
              <div className="h-6 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Main Homepage Component
export default function ModernHomePage() {
  return (
    <main className="min-h-screen">
      {/* Skip to content for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-slate-900 text-white px-4 py-2 rounded-lg z-50"
      >
        Pular para o conteúdo principal
      </a>

      {/* Hero Section */}
      <FormalHero />

      {/* Main Content */}
      <div id="main-content">
        {/* Featured Properties */}
        <Suspense fallback={<LoadingProperties />}>
          <FeaturedProperties />
        </Suspense>

        {/* Trust Section */}
        <TrustSection />

        {/* Contact Form */}
        <FormalContactForm />
      </div>

      {/* Footer */}
      <FooterAprimorado />
    </main>
  );
}

// CSS for animations
const styles = `
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in-up {
    animation: fade-in-up 0.6s ease-out forwards;
    opacity: 0;
  }
`;