import { Metadata } from 'next';
import { Suspense } from 'react';
import RealEstateHomePage from './page-real-estate';
import { fetchProperties } from '../lib/sanity/fetchImoveis';
import type { ImovelClient } from '../src/types/imovel-client';

export const metadata: Metadata = {
  title: 'Ipê Imóveis - Especialistas em Guararema | Compra, Venda e Aluguel',
  description: 'Encontre seu imóvel ideal em Guararema com a Ipê Imóveis. 15 anos de experiência, 500+ imóveis vendidos, atendimento personalizado. Casas, apartamentos e terrenos.',
  keywords: 'imóveis Guararema, casas venda Guararema, apartamentos aluguel Guararema, terrenos Guararema, Ipê Imóveis, imobiliária Guararema SP',
  authors: [{ name: 'Ipê Imóveis', url: 'https://ipeimoveis.vercel.app' }],
  creator: 'Ipê Imóveis',
  publisher: 'Ipê Imóveis',
  metadataBase: new URL('https://ipeimoveis.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Ipê Imóveis - Especialistas em Imóveis em Guararema',
    description: 'Encontre seu imóvel ideal em Guararema. 15 anos de experiência, 500+ imóveis vendidos. Atendimento personalizado e conhecimento local.',
    url: 'https://ipeimoveis.vercel.app',
    siteName: 'Ipê Imóveis',
    images: [
      {
        url: '/images/og-banner-guararema.jpg',
        width: 1200,
        height: 630,
        alt: 'Ipê Imóveis - Especialistas em Guararema'
      }
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ipê Imóveis - Guararema, SP',
    description: 'Especialistas em imóveis em Guararema há 15 anos. Encontre sua casa ideal conosco.',
    images: ['/images/og-banner-guararema.jpg'],
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
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-900">Carregando Ipê Imóveis...</h2>
          <p className="text-gray-600">Preparando os melhores imóveis para você</p>
        </div>
      </div>
    }>
      <RealEstateHomePage
        propertiesForSale={propertiesForSale}
        propertiesForRent={propertiesForRent}
        featuredProperties={featuredProperties}
      />
    </Suspense>
  );
}