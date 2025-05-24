// app/imovel/[slug]/page.tsx
import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { serverClient as sanityServer, serverFetch as sanityFetch } from '@/lib/sanity/sanity.server';
import { formatarArea } from '@/lib/utils';
import { queryImovelPorSlug, queryImoveisRelacionados } from '@lib/queries';
import { getImovelPorSlug } from '@lib/sanity/fetchImoveis';

import type { Metadata } from 'next';
import type { ImovelProjetado, ImovelClient as ImovelDataType } from '@/types/imovel-client';

import { mapImovelToClient } from '@lib/mapImovelToClient';

// Importação simples e direta de componentes
import dynamic from 'next/dynamic';

// Importação de componente de fallback
import FallbackComponent from './FallbackComponent';

// Componente principal com carregamento dinâmico e tratamento de erro
import ImovelDetalhesClient from './ImovelDetalhesClient';

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
  try {
    // Usa a função getImovelPorSlug que já deve estar configurada para servidor
    const imovelClient = await getImovelPorSlug(slug);
    console.log('DEBUG: imovelClient', JSON.stringify(imovelClient, null, 2));

    // Verificação robusta - se não tem dados ou falta ID, retorna 404
    if (!imovelClient || !imovelClient._id) {
      console.error(`Imóvel com slug ${slug} não encontrado ou dados incompletos`);
      return notFound();
    }

    // Garantir que imagem existe para evitar o erro "imóvel indisponível"
    if (!imovelClient.imagem || (!imovelClient.imagem.imagemUrl && !imovelClient.imagem.url)) {
      console.warn(`Imóvel ${slug} sem imagem, adicionando placeholder`);
      imovelClient.imagem = {
        _type: 'image',
        url: '/images/og-image-2025.jpg',
        imagemUrl: '/images/og-image-2025.jpg',
        alt: imovelClient.titulo || 'Imóvel Nova Ipê',
        asset: {
          _type: 'sanity.imageAsset',
          _ref: ''
        }
      };
    }

    // Busca relacionados pela mesma categoria
    const categoriaId = imovelClient.categoria?._id;
    let relacionados: ImovelProjetado[] = [];

    if (categoriaId) {
      try {
        relacionados = await sanityFetch({
          query: queryImoveisRelacionados,
          params: {
            imovelId: imovelClient._id,
            categoriaId,
            cidade: imovelClient.cidade,
          },
          tags: ['imoveis', `categoria-${categoriaId}`]
        }) || [];
      } catch (error) {
        console.error('Erro ao buscar imóveis relacionados:', error);
        relacionados = []; // Fallback seguro
      }
    }

    // Mapeia os imóveis relacionados para o formato de cliente
    const relacionadosClient = relacionados.map(mapImovelToClient);

    // Usar diretamente o Client Component wrapper
    return (
      <ImovelDetalhesClient
        imovel={imovelClient}
        relacionados={relacionadosClient}
        preco={imovelClient.preco}
      />
    );
  } catch (error) {
    console.error('❌ Erro ao renderizar página de imóvel:', error);
    return <FallbackComponent
      message="Erro ao carregar a página do imóvel"
      error={error instanceof Error ? error : new Error(String(error))}
      slug={slug}
    />;
  }
}