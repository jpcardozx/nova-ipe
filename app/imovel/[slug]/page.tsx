import { Metadata, } from "next"
import { sanityClient } from "lib/sanity"
import { queryImovelPorSlug } from "lib/queries"
import { generateStaticParams as gerarSlugs } from "lib/staticParams"

import HeroImovelSimbolico from "@/components/HeroImovelSimbolico"
import CardCTAImovel from "@/components/CardCTAImovel"
import BlocoLocalizacaoImovel from "@/components/BlocoLocalizacaoImovel"
import Referencias from "@/sections/Referencias"

interface ImovelData {
    slug: { current: string }
    titulo: string
    descricao: string
    imagem?: { asset: { url: string } }
    preco?: string
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

export async function generateMetadata(
    { params }: { params: { slug: string } },
): Promise<Metadata> {
    const imovel: ImovelData = await sanityClient.fetch(queryImovelPorSlug, { slug: params.slug })

    return {
        title: imovel.metaTitle || imovel.titulo,
        description: imovel.metaDescription,
        openGraph: {
            title: imovel.metaTitle || imovel.titulo,
            description: imovel.metaDescription,
            images: imovel.imagemOpenGraph?.asset?.url ? [{ url: imovel.imagemOpenGraph.asset.url }] : [],
        },
    }
}

export default async function ImovelPage({
    params,
}: {
    params: { slug: string }
}) {
    const imovel: ImovelData = await sanityClient.fetch(queryImovelPorSlug, { slug: params.slug })

    return (
        <main className="w-full bg-[#fafafa] text-[#0D1F2D]">
            <HeroImovelSimbolico
                titulo={imovel.titulo}
                cidade={imovel.cidade}
                tipo={imovel.tipo}
                metros={imovel.metros}
                imagemFundo="/imoveis/bg3.jpg"
            />

            <section className="max-w-6xl mx-auto px-6 md:px-8 mt-20 grid md:grid-cols-2 gap-14">
                <article className="space-y-6">
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight border-l-4 border-[#FFAD43] pl-4">
                        Sobre o imóvel
                    </h2>

                    <p className="text-base md:text-lg leading-relaxed text-[#0D1F2D]/80">
                        {imovel.descricao || "Em breve teremos mais informações sobre este imóvel."}
                    </p>

                    <ul className="flex flex-col gap-3 text-sm text-[#0D1F2D]/70 mt-6">
                        <li className="flex items-center gap-2">📌 Documentação 100% regularizada</li>
                        <li className="flex items-center gap-2">🏞️ Localização residencial com boa vizinhança</li>
                        {imovel.metros && (
                            <li className="flex items-center gap-2">📐 {imovel.metros}</li>
                        )}
                    </ul>
                </article>

                <CardCTAImovel
                    preco={imovel.preco}
                    titulo={imovel.titulo}
                    linkPersonalizado={imovel.linkPersonalizado}
                />
            </section>

            <BlocoLocalizacaoImovel
                endereco={imovel.endereco || ""}
                cidade={imovel.cidade || ""}
                mapaLink={imovel.mapaLink || ""}
            />

            <Referencias />
        </main>
    )
}
