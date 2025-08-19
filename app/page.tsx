import { Suspense } from 'react';
import HomePageClient from './page-client';
import { fetchProperties } from '../lib/sanity/fetchImoveis';
import { getImoveisEmAlta } from '../lib/sanity/fetchImoveis'; // Nova importação
import type { ImovelClient } from '../src/types/imovel-client';

async function getProperties() {
  try {
    const [imoveis, imoveisEmAlta] = await Promise.all([
      fetchProperties(),
      getImoveisEmAlta() // Nova busca para imóveis em alta
    ]);

    const propertiesForSale = imoveis.filter(p => p.finalidade === 'Venda').slice(0, 12);
    const propertiesForRent = imoveis.filter(p => p.finalidade === 'Aluguel').slice(0, 12);
    const featuredProperties = imoveis.filter(p => p.destaque).slice(0, 6);

    return {
      propertiesForSale,
      propertiesForRent,
      featuredProperties,
      hotProperties: imoveisEmAlta // Novos imóveis em alta
    };
  } catch (error) {
    console.error('Error fetching properties:', error);
    return {
      propertiesForSale: [],
      propertiesForRent: [],
      featuredProperties: [],
      hotProperties: [] // Fallback para imóveis em alta
    };
  }
}

export default async function HomePage() {
  const { propertiesForSale, propertiesForRent, featuredProperties, hotProperties } = await getProperties();

  // Redirect para a versão premium com IpeConcept
  const { default: IpeConceptHomePage } = await import('./page-client');

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
      <IpeConceptHomePage
        propertiesForSale={propertiesForSale}
        propertiesForRent={propertiesForRent}
        featuredProperties={featuredProperties}
        hotProperties={hotProperties}
      />
    </Suspense>
  );
}