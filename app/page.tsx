import { Suspense } from 'react';
import HomePageClient from './page-client';
import { getHomePageData } from '../lib/queries';

export default async function HomePage() {
  const { featuredProperties, rentalProperties, saleProperties } = await getHomePageData();

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-900">Carregando Ipê Imóveis...</h2>
          <p className="text-gray-600">Preparando a melhor experiência imobiliária</p>
        </div>
      </div>
    }>
      <HomePageClient
        propertiesForSale={saleProperties}
        propertiesForRent={rentalProperties}
        featuredProperties={featuredProperties}
      />
    </Suspense>
  );
}