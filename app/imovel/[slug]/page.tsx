import { Metadata } from "next"
import { sanityClient } from "lib/sanity"
import { queryImovelPorSlug } from "lib/queries"
import { generateStaticParams as gerarSlugs } from "lib/staticParams"

import HeroImovelSimbolico from "@/app/components/HeroImovelSimbolico"
import CardCTAImovel from "@/app/components/CardCTAImovel"
import BlocoLocalizacaoImovel from "@/app/components/BlocoLocalizacaoImovel"
import Referencias from "@/app/sections/Referencias"

import { formatarMoeda, formatarArea } from "@/src/lib/utils"

interface ImovelData {
    slug: { current: string }
    titulo: string
    descricao?: string
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
    const slugs: { current: string }[] = await gerarSlugs()
    return slugs.map(({ current }: { current: string }) => ({ slug: current }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const slug = params.slug
    const imovel: ImovelData = await sanityClient.fetch(queryImovelPorSlug, { slug })

    const title = imovel.metaTitle || `${imovel.tipo} em ${imovel.cidade} | Ipê Imóveis`
    const description = imovel.metaDescription || `Veja os detalhes deste imóvel em ${imovel.cidade}. Curadoria exclusiva da Ipê Imóveis.`

    return {
        title,
        description,
        metadataBase: new URL("https://ipeimoveis.com"),
        alternates: {
            canonical: `https://ipeimoveis.com/imovel/${slug}`,
        },
        openGraph: {
            title,
            description,
            images: imovel.imagemOpenGraph
                ? [{ url: imovel.imagemOpenGraph.asset.url }]
                : imovel.imagem
                    ? [{ url: imovel.imagem.asset.url }]
                    : [],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        robots: {
            index: true,
            follow: true,
        },
    }
}

export default async function ImovelPage({ params }: { params: { slug: string } }) {
    const slug = params.slug
    const imovel: ImovelData = await sanityClient.fetch(queryImovelPorSlug, { slug })
    const imagemUrl = imovel.imagem?.asset.url || "/imoveis/bg3.jpg"

    return (
        <main className="w-full bg-gradient-to-br from-[#f7f6f3] to-[#fff] text-[#0D1F2D]">
            <HeroImovelSimbolico
                titulo={imovel.titulo}
                cidade={imovel.cidade}
                tipo={imovel.tipo}
                metros={imovel.metros}
                imagemFundo={imagemUrl}
                destaque
            />

            <section className="max-w-6xl mx-auto px-6 md:px-8 mt-20 grid md:grid-cols-2 gap-16 items-start">
                <article className="space-y-8">
                    <h2 className="text-3xl md:text-4xl font-semibold border-l-4 border-[#FFAD43] pl-4">
                        Detalhes do imóvel
                    </h2>

                    <p className="text-base md:text-lg text-[#0D1F2D]/80 whitespace-pre-line leading-relaxed">
                        {imovel.descricao ??
                            "Este imóvel está em processo de curadoria. Em breve traremos todos os detalhes para você."}
                    </p>

                    <div className="grid gap-3 text-sm text-[#0D1F2D]/80">
                        {imovel.metros && (
                            <div className="flex items-center gap-2">
                                <span className="text-[#FFAD43] font-semibold">📐 Área:</span>
                                {formatarArea(Number(imovel.metros))}
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <span className="text-[#FFAD43] font-semibold">📄 Documentação:</span>
                            100% regularizada
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[#FFAD43] font-semibold">🏘️ Vizinhança:</span>
                            Local tranquilo e seguro
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-full text-sm">
                        ✅ Verificado pela equipe Ipê
                    </div>
                </article>

                <aside className="sticky top-28">
                    <CardCTAImovel
                        preco={imovel.preco}
                        titulo={imovel.titulo}
                        linkPersonalizado={imovel.linkPersonalizado}
                    />
                </aside>
            </section>

            <div className="max-w-6xl mx-auto px-6 md:px-8 mt-24">
                <BlocoLocalizacaoImovel
                    endereco={imovel.endereco ?? ""}
                    cidade={imovel.cidade ?? ""}
                    mapaLink={imovel.mapaLink ?? ""}
                />
            </div>

            <div className="mt-24">
                <Referencias />
            </div>
        </main>
    )
}
