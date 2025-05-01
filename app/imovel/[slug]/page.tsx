import { use, Suspense } from 'react'
import { notFound } from 'next/navigation'
import { sanityClient } from '@/lib/sanity'
import { formatarArea } from '@/src/lib/utils'
import { queryImovelPorSlug, queryImoveisRelacionados } from '@/lib/queries'

import type { Metadata } from 'next'
import type { Imovel as SanityImovel } from '@/src/types/sanity-schema'
import type { ImovelClient as ImovelClientType } from '@/src/types/imovel-client'

import { mapImovelToClient } from '@/src/lib/mapImovelToClient'
import ImovelClient from './ImovelClient'

// Geração estática das rotas dinâmicas
export async function generateStaticParams() {
  const slugs: { slug: { current: string } }[] = await sanityClient.fetch(
    `*[_type == "imovel" && defined(slug.current)]{ slug }`
  )
  return slugs.map(({ slug }) => ({ slug: slug.current }))
}

// SSR Metadata com fallback inteligente
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const imovel: SanityImovel | null = await sanityClient.fetch(queryImovelPorSlug, { slug })

  if (!imovel) return {}

  const title = imovel.metaTitle || `${imovel.titulo} | Ipê Imóveis`
  const description =
    imovel.metaDescription ||
    `Veja os detalhes deste imóvel em ${imovel.cidade}. Curadoria exclusiva da Ipê Imóveis.`

  const imageUrl =
    imovel.imagemOpenGraph?.asset?._ref || imovel.imagem?.asset?._ref || undefined

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
  }
}

// Componente principal da página (streaming)
export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)

  return (
    <Suspense fallback={<div className="h-[70vh] bg-gray-100 animate-pulse" />}>
      <ImovelPage slug={slug} />
    </Suspense>
  )
}

// Componente assíncrono que busca e transforma os dados
async function ImovelPage({ slug }: { slug: string }) {
  const imovel: SanityImovel | null = await sanityClient.fetch(queryImovelPorSlug, { slug })
  if (!imovel) return notFound()

  const preco = imovel.preco ?? 0
  const metragem = imovel.areaUtil ? formatarArea(imovel.areaUtil) : null

  // ⚠️ Evita erro ao passar categoriaId undefined
  let relacionados: SanityImovel[] = []
  const categoriaRef = imovel.categoria?._ref
  if (categoriaRef) {
    relacionados = await sanityClient.fetch(queryImoveisRelacionados, {
      id: imovel._id,
      categoriaId: categoriaRef,
      cidade: imovel.cidade,
    })
  }

  const imovelClient: ImovelClientType = mapImovelToClient(imovel)
  const relacionadosClient: ImovelClientType[] = relacionados.map(mapImovelToClient)

  return (
    <ImovelClient
      imovel={imovelClient}
      relacionados={relacionadosClient}
      preco={preco}
      metragem={metragem}
    />
  )
}
