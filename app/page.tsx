import { Metadata } from 'next';
import { Suspense } from 'react';
import HomePageClient from './page-client';
import { fetchProperties } from '../lib/sanity/fetchImoveis';
import { UnifiedLoading } from './components/ui/UnifiedComponents';
import type { ImovelClient } from '../src/types/imovel-client';

export const metadata: Metadata = {
  title: 'Ipê Imóveis - Serviços Imobiliários em Guararema e Região',
  description: 'Temos o imóvel que você procura em Guararema e região. Entre em contato conosco e descubra as melhores opções de compra e aluguel. 15 anos de experiência, 500+ imóveis vendidos.',
  keywords: 'imóveis Guararema, casas venda, apartamentos aluguel, terrenos, Nova Ipê, imobiliária, Guararema SP, região, compra, venda, locação, corretor, avaliação', authors: [{ name: 'Ipê Imóveis', url: 'https://ipeimoveis.vercel.app' }],
  creator: 'Ipê Imóveis',
  publisher: 'Ipê Imóveis',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ipeimoveis.vercel.app'),
  alternates: {
    canonical: '/',
  }, openGraph: {
    title: 'Ipê Imóveis - Compra, Venda e Locação em Guararema',
    description: 'O imóvel que você busca está em nosso catálogo. Agende sua visita. 15 anos de experiência, 500+ imóveis vendidos.',
    url: 'https://ipeimoveis.vercel.app',
    siteName: 'Ipê Imóveis', images: [
      {
        url: '/images/og-banner-optimized.png',
        width: 1200,
        height: 630,
        alt: 'Ipê Imóveis - Guararema - Preview Banner'
      }
    ],
    locale: 'pt_BR',
    type: 'website',
  }, twitter: {
    card: 'summary_large_image',
    title: 'Ipê Imóveis - Guararema, SP',
    description: 'Ipê Imóveis te espera. Mais de 15 anos ajudando famílias a encontrar os imóveis perfeitos.',
    images: ['/images/og-banner-optimized.png'],
    creator: '@ipeimoveis',
  },
  other: {
    'fb:app_id': '1234567890123456', // Add your Facebook App ID here
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'business',
};


async function getProperties() {
  try {
    const imoveis = await fetchProperties();

    const propertiesForSale = imoveis.filter(p => p.finalidade === 'Venda').slice(0, 12);
    const propertiesForRent = imoveis.filter(p => p.finalidade === 'Aluguel').slice(0, 12);
    const featuredProperties = imoveis.filter(p => p.destaque).slice(0, 6);

    return {
      propertiesForSale,
      propertiesForRent,
      featuredProperties
    };
  } catch (error) {
    console.error('Error fetching properties:', error);
    return {
      propertiesForSale: [],
      propertiesForRent: [],
      featuredProperties: []
    };
  }
}

export default async function HomePage() {
  const { propertiesForSale, propertiesForRent, featuredProperties } = await getProperties();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <UnifiedLoading height="100vh" title="Carregando Nova Ipê Imóveis..." />
        </div>
      }
    >
      <HomePageClient
        propertiesForSale={propertiesForSale}
        propertiesForRent={propertiesForRent}
        featuredProperties={featuredProperties}
      />
    </Suspense>
  );
}