// app/imovel/[slug]/page.tsx
import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { serverClient as sanityServer, serverFetch as sanityFetch } from '@/lib/sanity/sanity.server';
import { formatarArea } from '@/lib/utils';
import { queryImovelPorSlug, queryImoveisRelacionados } from '@lib/queries';
import { getImovelPorSlug } from '@lib/sanity/fetchImoveis';

import type { Metadata } from 'next';
import type { ImovelProjetado , ImovelClient as ImovelDataType } from '@/types/imovel-client';

import { mapImovelToClient } from '@lib/mapImovelToClient';

// Importa o componente de página
import ImovelDetalhes from './ImovelClient';

// Geração estática das rotas dinâmicas
export async function generateStaticParams() {
  const slugs: { slug: { current: string } }[] = await sanityFetch({
    query: `*[_type == "imovel" && defined(slug.current)]{ slug }`,
    tags: ['imoveis'] // Tag para revalidação
  });
  return slugs.map(({ slug }) => ({ slug: slug.current }));
}

// SSR Metadata com gerador otimizado para redes sociais
import { generatePropertyMetadata } from '@/lib/metadata-generators';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;

  const imovel: ImovelProjetado | null = await sanityFetch({
    query: queryImovelPorSlug,
    params: { slug },
    tags: ['imovel', `imovel-${slug}`]
  });

  if (!imovel) return {};

  // Mapear para o formato esperado pelo gerador de metadata
  const clientImovel = mapImovelToClient(imovel);
  // Extrair dados específicos para a função de metadados
  const propertyData = {
    id: clientImovel._id || '',
    title: clientImovel.titulo || 'Imóvel Nova Ipê', // Valor padrão para evitar undefined
    location: (clientImovel.bairro || clientImovel.cidade || 'Guararema'), // Valor padrão
    city: clientImovel.cidade || 'Guararema', // Valor padrão
    price: typeof clientImovel.preco === 'number' ? clientImovel.preco :
      parseFloat(String(clientImovel.preco || '0')),
    propertyType: (clientImovel.finalidade?.toLowerCase() === 'venda' ? 'sale' : 'rent') as 'sale' | 'rent',
    area: typeof clientImovel.areaUtil === 'number' ? clientImovel.areaUtil :
      clientImovel.areaUtil ? parseFloat(String(clientImovel.areaUtil)) : undefined,
    bedrooms: clientImovel.dormitorios ? Number(clientImovel.dormitorios) : undefined,
    bathrooms: clientImovel.banheiros ? Number(clientImovel.banheiros) : undefined,
    parkingSpots: clientImovel.vagas ? Number(clientImovel.vagas) : undefined,
    description: clientImovel.descricao || clientImovel.metaDescription,
    mainImage: {
      url: clientImovel.imagem?.imagemUrl ||
        clientImovel.imagemOpenGraph?.imagemUrl ||
        '/images/og-image-2025.jpg',
      alt: clientImovel.imagem?.alt || clientImovel.titulo || 'Imóvel Nova Ipê'
    },
    slug
  };

  // Usar nosso gerador avançado de metadata
  return generatePropertyMetadata(propertyData);
}

// Componente principal da página (streaming)
export default function Page({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={<div className="h-[70vh] bg-gray-100 animate-pulse" />}>
      <ImovelPage slug={params.slug} />
    </Suspense>
  );
}

// Componente assíncrono que busca e transforma os dados
async function ImovelPage({ slug }: { slug: string }) {
  // Usa a função getImovelPorSlug que já deve estar configurada para servidor
  const imovelClient = await getImovelPorSlug(slug);
  if (!imovelClient) return notFound();

  const preco = imovelClient.preco ?? 0;
  const metragem = imovelClient.areaUtil
    ? formatarArea(imovelClient.areaUtil)
    : null;

  // Busca relacionados pela mesma categoria
  const categoriaId = imovelClient.categoria?._id;
  let relacionados: ImovelProjetado[] = [];

  if (categoriaId) {
    relacionados = await sanityFetch<ImovelProjetado[]>({
      query: queryImoveisRelacionados,
      params: {
        imovelId: imovelClient._id,
        categoriaId,
        cidade: imovelClient.cidade,
      },
      tags: ['imoveis', `categoria-${categoriaId}`]
    });
  }

  // Mapeia para o tipo de cliente
  const relacionadosClient: ImovelDataType[] = relacionados.map(mapImovelToClient);

  // Usa o componente de detalhes
  return (
    <ImovelDetalhes
      imovel={imovelClient}
      relacionados={relacionadosClient}
      preco={preco}
    />
  );
}