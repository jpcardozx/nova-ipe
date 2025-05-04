// app/imovel/[slug]/page.tsx
"use client";

import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { sanityClient } from '@/lib/sanity';
import { formatarArea } from '@/lib/utils';
import { queryImovelPorSlug, queryImoveisRelacionados } from '@lib/queries';
import { getImovelPorSlug } from '@lib/sanity/fetchImoveis';

import type { Metadata } from 'next';
import type { ImovelProjetado } from '@/types/imovel-client';
// renomeamos o tipo para não colidir com o componente
import type { ImovelClient as ImovelDataType } from '@/types/imovel-client';
import { mapImovelToClient } from '@/lib/mapImovelToClient';

// Importa o componente de página (ImovelClient.tsx), que recebe { imovel, relacionados, preco, metragem }
import ImovelDetalhes from './ImovelClient';

// Geração estática das rotas dinâmicas
export async function generateStaticParams() {
  const slugs: { slug: { current: string } }[] = await sanityClient.fetch(
    `*[_type == "imovel" && defined(slug.current)]{ slug }`
  );
  return slugs.map(({ slug }) => ({ slug: slug.current }));
}

// SSR Metadata com fallback inteligente
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  const imovel: ImovelProjetado | null = await sanityClient.fetch(queryImovelPorSlug, { slug });

  if (!imovel) return {};

  const title = imovel.metaTitle || `${imovel.titulo} | Ipê Imóveis`;
  const description =
    imovel.metaDescription ||
    `Veja os detalhes deste imóvel em ${imovel.cidade}. Curadoria exclusiva da Ipê Imóveis.`;

  const imageUrl =
    imovel.imagemOpenGraph?.imagemUrl || imovel.imagem?.imagemUrl || undefined;

  return {
    title,
    description,
    metadataBase: new URL('https://ipeimoveis.com'),
    alternates: {
      canonical: `https://ipeimoveis.com/imovel/${slug}`,
    },
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
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
    relacionados = await sanityClient.fetch<ImovelProjetado[]>(
      queryImoveisRelacionados,
      {
        imovelId: imovelClient._id,
        categoriaId,
        cidade: imovelClient.cidade,
      }
    );
  }

  // Mapeia para o tipo de cliente
  const relacionadosClient: ImovelDataType[] = relacionados.map(mapImovelToClient);

  // Aqui usamos o componente de detalhes, com props corretas:
  return (
    <ImovelDetalhes
      imovel={imovelClient}
      relacionados={relacionadosClient}
      preco={preco}
    />
  );
}
