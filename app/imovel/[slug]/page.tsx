// app/imovel/[slug]/page.tsx
import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { serverClient as sanityServer, serverFetch as sanityFetch } from '@/lib/sanity/sanity.server';
import { queryImovelPorSlug, queryImoveisRelacionados } from '../../../lib/sanity/queries';
import { getImovelPorSlug } from '../../../lib/sanity/fetchImoveis';
import type { Metadata } from 'next';
import type { ImovelProjetado, ImovelClient as ImovelDataType } from '../../../src/types/imovel-client';
import { mapImovelToClient } from '@lib/mapImovelToClient';

// Importação simples e direta de componentes
import dynamic from 'next/dynamic';

// Importação de componente de fallback
import FallbackComponent from './FallbackComponent';

// Componente principal com carregamento dinâmico e tratamento de erro
import ImovelDetalhesClient from './ImovelDetalhesClient';

// Geração estática das rotas dinâmicas
export async function generateStaticParams() {
  try {
    const slugs: { slug: { current: string } }[] = await sanityFetch(
      `*[_type == "imovel" && defined(slug.current)]{ slug }`
    );

    // Verifica se slugs é um array válido
    if (!Array.isArray(slugs)) {
      console.warn('Sanity returned invalid data for generateStaticParams, returning empty array');
      return [];
    }

    return slugs.map(({ slug }) => ({ slug: slug.current }));
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    // Retorna array vazio para permitir que o build continue
    // As páginas serão geradas sob demanda (ISR)
    return [];
  }
}

// SSR Metadata com gerador otimizado para redes sociais
import { generatePropertyMetadata } from '@/lib/metadata-generators';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const imovel: ImovelProjetado | null = await sanityFetch(
    queryImovelPorSlug,
    { slug }
  );

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
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <Suspense fallback={<div className="h-[70vh] bg-gray-100 animate-pulse" />}>
      <ImovelPage slug={slug} />
    </Suspense>
  );
}

// Componente assíncrono que busca e transforma os dados
async function ImovelPage({ slug }: { slug: string }) {
  try {
    console.log(`🔍 Buscando imóvel com slug: ${slug}`);

    // Primeira tentativa: buscar por slug usando getImovelPorSlug
    let imovelClient = await getImovelPorSlug(slug);

    // Se não encontrou, tentar buscar diretamente por ID (backwards compatibility)
    if (!imovelClient && slug.includes('-')) {
      console.log(`🔄 Tentando buscar por ID: ${slug}`);

      const imovelDireto: ImovelProjetado | null = await sanityFetch(
        `*[_type == "imovel" && _id == $id][0] {
          _id, titulo, slug, preco, destaque, finalidade, bairro, cidade,
          descricao, endereco, estado, aceitaFinanciamento, area, areaUtil,
          documentacaoOk, videoTour, dormitorios, banheiros, vagas, tipoImovel,
          caracteristicas, status,
          categoria->{ _id, "categoriaTitulo": titulo, "categoriaSlug": slug },
          imagem { "asset": asset->, "_type": "image", "imagemUrl": asset->url,
          "alt": alt, "hotspot": hotspot }, galeria[]{ "asset": asset->,
          "_type": "image", "imagemUrl": asset->url, "alt": alt }, corretor,
          valorCondominio, iptu, localizacao
        }`,
        { id: slug }
      );

      if (imovelDireto) {
        imovelClient = mapImovelToClient(imovelDireto);
      }
    }

    // Verificação robusta - se não tem dados ou falta ID, retorna 404
    if (!imovelClient || !imovelClient._id) {
      console.error(`❌ Imóvel com slug ${slug} não encontrado ou dados incompletos`);
      return notFound();
    }

    console.log(`✅ Imóvel encontrado: ${imovelClient.titulo}`);

    // Garantir que imagem existe para evitar o erro "imóvel indisponível"
    if (!imovelClient.imagem || !imovelClient.imagem.imagemUrl) {
      console.warn(`Imóvel ${slug} sem imagem, adicionando placeholder`);
      imovelClient.imagem = {
        imagemUrl: '/images/og-image-2025.jpg',
        alt: imovelClient.titulo || 'Imóvel Nova Ipê',
        asset: {
          _type: 'sanity.imageAsset'
        }
      };
    }

    // Busca relacionados pela mesma categoria
    const categoriaId = imovelClient.categoria?._id;
    let relacionados: ImovelProjetado[] = [];

    if (categoriaId) {
      try {
        relacionados = await sanityFetch(
          queryImoveisRelacionados,
          {
            imovelId: imovelClient._id,
            categoriaId,
            cidade: imovelClient.cidade,
          }
        ) || [];
      } catch (error) {
        console.error('Erro ao buscar imóveis relacionados:', error);
        relacionados = []; // Fallback seguro
      }
    }

    // Mapeia os imóveis relacionados para o formato de cliente
    const relacionadosClient = relacionados.map(mapImovelToClient);

    // Serializar dados para garantir compatibilidade com SSG
    const serializedData = {
      imovel: JSON.parse(JSON.stringify(imovelClient)),
      relacionados: JSON.parse(JSON.stringify(relacionadosClient)),
      preco: typeof imovelClient.preco === 'number' ? imovelClient.preco : 0
    };

    // Usar diretamente o Client Component wrapper com dados serializados
    return (
      <ImovelDetalhesClient
        imovel={serializedData.imovel}
        relacionados={serializedData.relacionados}
        preco={serializedData.preco}
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