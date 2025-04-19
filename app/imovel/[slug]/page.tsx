import { Metadata } from "next"
import { sanityClient } from "lib/sanity"
import { queryImovelPorSlug } from "lib/queries"
import { generateStaticParams as gerarSlugs } from "lib/staticParams"

import HeroImovelSimbolico from "@/components/HeroImovelSimbolico"
import CardCTAImovel from "@/components/CardCTAImovel"
import BlocoLocalizacaoImovel from "@/components/BlocoLocalizacaoImovel"
import Referencias from "@/sections/Referencias"

interface PageProps {
    params: { slug: string }
}

interface ImovelData {
    slug: { current: string }
    titulo: string
    descricao: string
    imagem?: { asset: { url: string } }
    preco?: number
    cidade?: string
    tipo?: string
    metros?: string
    endereco?: string
    mapaLink?: string
    linkPersonalizado?: string
    metaTitle?: string
    metaDescription?: string
    imagemOpenGraph?: { asset: { url: string } }
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
    return gerarSlugs()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const imovel: ImovelData = await sanityClient.fetch(queryImovelPorSlug, { slug: params.slug })

    return {
        title: imovel.metaTitle || imovel.titulo,
        description: imovel.metaDescription || "Veja mais detalhes sobre este imóvel exclusivo em Guararema.",
        openGraph: {
            title: imovel.metaTitle || imovel.titulo,
            description: imovel.metaDescription || imovel.descricao,
            images: imovel.imagemOpenGraph?.asset?.url
                ? [{ url: imovel.imagemOpenGraph.asset.url }]
                : imovel.imagem?.asset?.url
                    ? [{ url: imovel.imagem.asset.url }]
                    : [],
        },
    }
}

export default async function ImovelPage({ params }: PageProps) {
    const imovel: ImovelData = await sanityClient.fetch(queryImovelPorSlug, { slug: params.slug })

    const imagemUrl = imovel.imagem?.asset?.url || "/imoveis/bg3.jpg"

    return (
        <main className="w-full bg-gradient-to-br from-[#f7f6f3] to-[#fff] text-[#0D1F2D]">
            <HeroImovelSimbolico
                titulo={imovel.titulo}
                cidade={imovel.cidade}
                tipo={imovel.tipo}
                metros={imovel.metros}
                imagemFundo={imagemUrl}
            />

            <section className="max-w-6xl mx-auto px-6 md:px-8 mt-20 grid md:grid-cols-2 gap-16 items-start">
                <article className="space-y-8">
                    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight border-l-4 border-[#FFAD43] pl-4">
                        Sobre o imóvel
                    </h2>

                    <p className="text-base md:text-lg leading-relaxed text-[#0D1F2D]/80">
                        {imovel.descricao || "Em breve teremos mais informações sobre este imóvel."}
                    </p>

                    <ul className="flex flex-col gap-4 text-sm text-[#0D1F2D]/70 mt-6">
                        <li className="flex items-center gap-2">📌 Documentação 100% regularizada</li>
                        <li className="flex items-center gap-2">🏞️ Localização residencial com boa vizinhança</li>
                        {imovel.metros && (
                            <li className="flex items-center gap-2">📐 {imovel.metros}</li>
                        )}
                    </ul>
                </article>

                <div className="sticky top-28 self-start">
                    <CardCTAImovel
                        preco={imovel.preco?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        titulo={imovel.titulo}
                        linkPersonalizado={imovel.linkPersonalizado}
                    />
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-6 md:px-8 mt-24">
                <BlocoLocalizacaoImovel
                    endereco={imovel.endereco || ""}
                    cidade={imovel.cidade || ""}
                    mapaLink={imovel.mapaLink || ""}
                />
            </div>

            <div className="mt-24">
                <Referencias />
            </div>
        </main>
    )
}