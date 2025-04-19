import { Metadata } from "next"
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

// ⚠️ ATENÇÃO: NÃO TIPAR COMO PageProps!
export async function generateStaticParams() {
    const slugs = await gerarSlugs()
    return slugs.map((slug: { current: string }) => ({ slug: slug.current }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
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

export default async function ImovelPage({ params }: { params: { slug: string } }) {
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
                        Detalhes do imóvel
                    </h2>

                    <p className="text-base md:text-lg leading-relaxed text-[#0D1F2D]/80 whitespace-pre-line">
                        {imovel.descricao || "Em breve teremos mais informações sobre este imóvel."}
                    </p>

                    <ul className="flex flex-col gap-4 text-sm text-[#0D1F2D]/70 mt-6">
                        <li className="flex items-center gap-2" title="Documentação verificada">📌 Documentação 100% regularizada</li>
                        <li className="flex items-center gap-2" title="Boa vizinhança">🏞️ Localização residencial com boa vizinhança</li>
                        {imovel.metros && <li className="flex items-center gap-2">📐 {imovel.metros}</li>}
                    </ul>

                    <div className="flex items-center gap-2 mt-8 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-full w-fit">
                        ✅ Imóvel verificado pela equipe Ipê
                    </div>
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
