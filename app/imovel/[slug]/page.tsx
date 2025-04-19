import { Metadata } from "next"
import { sanityClient } from "lib/sanity"
import { queryImovelPorSlug } from "lib/queries"
import { generateStaticParams as gerarSlugs } from "lib/staticParams"

import HeroImovelSimbolico from "@/components/HeroImovelSimbolico"
import CardCTAImovel from "@/components/CardCTAImovel"
import BlocoLocalizacaoImovel from "@/components/BlocoLocalizacaoImovel"
import Referencias from "@/sections/Referencias"

// — shape dos dados retornados pelo Sanity
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

// — gera todos os slugs estaticamente
export async function generateStaticParams(): Promise<{ slug: string }[]> {
    // explicita tipo do array e do destructuring
    const slugs: Array<{ current: string }> = await gerarSlugs()
    return slugs.map(({ current }: { current: string }) => ({ slug: current }))
}

// — metadados dinâmicos para SEO / OpenGraph
export async function generateMetadata({
    params,
}: {
    params: { slug: string }
}): Promise<Metadata> {
    const imovel: ImovelData = await sanityClient.fetch(
        queryImovelPorSlug,
        { slug: params.slug }
    )

    return {
        title: imovel.metaTitle || imovel.titulo,
        description:
            imovel.metaDescription ||
            "Veja mais detalhes sobre este imóvel exclusivo em Guararema.",
        openGraph: {
            title: imovel.metaTitle || imovel.titulo,
            description: imovel.metaDescription || imovel.descricao,
            images: imovel.imagemOpenGraph
                ? [{ url: imovel.imagemOpenGraph.asset.url }]
                : imovel.imagem
                    ? [{ url: imovel.imagem.asset.url }]
                    : [],
        },
    }
}

// — componente de página (App Router)
// • Recebe params possivelmente como Promise, então fazemos await
export default async function ImovelPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    // agora params é uma Promise<{ slug }>
    const { slug } = await params
    const imovel: ImovelData = await sanityClient.fetch(
        queryImovelPorSlug,
        { slug }
    )

    // fallback de imagem
    const imagemUrl = imovel.imagem?.asset.url || "/imoveis/bg3.jpg"

    return (
        <main className="w-full bg-gradient-to-br from-[#f7f6f3] to-[#fff] text-[#0D1F2D]">
            {/* Hero com overlay sutil */}
            <HeroImovelSimbolico
                titulo={imovel.titulo}
                cidade={imovel.cidade}
                tipo={imovel.tipo}
                metros={imovel.metros}
                imagemFundo={imagemUrl}
            />

            {/* Detalhes + CTA fixo */}
            <section className="max-w-6xl mx-auto px-6 md:px-8 mt-20 grid md:grid-cols-2 gap-16 items-start">
                <article className="space-y-8">
                    <h2 className="text-3xl md:text-4xl font-semibold border-l-4 border-[#FFAD43] pl-4">
                        Detalhes do imóvel
                    </h2>
                    <p className="text-base md:text-lg text-[#0D1F2D]/80 whitespace-pre-line">
                        {imovel.descricao ||
                            "Em breve teremos mais informações sobre este imóvel."}
                    </p>
                    <ul className="space-y-4 text-sm text-[#0D1F2D]/70">
                        <li className="flex items-center gap-2">📌 Documentação 100% regularizada</li>
                        <li className="flex items-center gap-2">🏞️ Boa vizinhança</li>
                        {imovel.metros && (
                            <li className="flex items-center gap-2">📐 {imovel.metros}</li>
                        )}
                    </ul>
                    <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-full text-sm">
                        ✅ Verificado pela equipe Ipê
                    </div>
                </article>

                <aside className="sticky top-28">
                    <CardCTAImovel
                        preco={imovel.preco?.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        })}
                        titulo={imovel.titulo}
                        linkPersonalizado={imovel.linkPersonalizado}
                    />
                </aside>
            </section>

            {/* Localização */}
            <div className="max-w-6xl mx-auto px-6 md:px-8 mt-24">
                <BlocoLocalizacaoImovel
                    endereco={imovel.endereco || ""}
                    cidade={imovel.cidade || ""}
                    mapaLink={imovel.mapaLink || ""}
                />
            </div>

            {/* Referências */}
            <div className="mt-24">
                <Referencias />
            </div>
        </main>
    )
}
