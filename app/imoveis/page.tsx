'use client'

// app/imoveis/page.tsx
import { sanityClient } from "lib/sanity"
import { queryTodosImoveis } from "lib/queries"
import dynamic from "next/dynamic"
import ImovelCard from "@/components/ImovelCard"

// Importa blocos pesados como client-only (evita erros no build)
const HeroInstitucional = dynamic(
    () => import("@/components/HeroInstitucional"),
    { ssr: false }
)
const BlocoExploracaoSimbolica = dynamic(
    () => import("@/components/BlocoExploracaoSimbolica"),
    { ssr: false }
)
const BlocoCTAConversao = dynamic(
    () => import("@/components/BlocoCTAConversao"),
    { ssr: false }
)

type ImovelPreview = {
    _id: string
    titulo: string
    slug: { current: string }
    preco?: number
    cidade?: string
    categoria?: { titulo: string }
    imagem?: { asset: { url: string } }
    destaque?: boolean
}

export default async function ListaImoveisPage() {
    const imoveis: ImovelPreview[] = await sanityClient.fetch(queryTodosImoveis)

    const imoveisDestaque = imoveis.filter((i) => i.destaque)
    const imoveisRestantes = imoveis.filter((i) => !i.destaque)

    return (
        <main className="w-full bg-[#fafafa] text-[#0D1F2D]">
            <HeroInstitucional
                tagline="Apresentação selecionada"
                titulo="Imóveis disponíveis em Guararema"
                subtitulo="Cada imóvel listado passou por verificação documental e visita. Transparência e experiência garantidas."
            />

            <BlocoExploracaoSimbolica />

            {imoveisDestaque.length > 0 && (
                <section className="max-w-6xl mx-auto px-6 md:px-8 py-24 space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-playfair">Destaques do momento</h2>
                        <p className="text-sm text-[#0D1F2D]/60">
                            Localizações privilegiadas, alta procura e condições especiais.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {imoveisDestaque.map((i) => (
                            <ImovelCard
                                key={i._id}
                                slug={i.slug.current}
                                titulo={i.titulo}
                                cidade={i.cidade ?? ""}
                                tipo={i.categoria?.titulo ?? "Imóvel"}
                                preco={i.preco}
                                imagem={i.imagem?.asset.url ?? "/placeholder.jpg"}
                                destaque
                            />
                        ))}
                    </div>
                </section>
            )}

            <section className="max-w-6xl mx-auto px-6 md:px-8 py-24 space-y-8 border-t border-dashed border-[#0D1F2D]/10">
                <div className="space-y-2">
                    <h2 className="text-3xl font-playfair">Todos os imóveis disponíveis</h2>
                    <p className="text-sm text-[#0D1F2D]/60 max-w-2xl">
                        Catálogo completo. Fale conosco para visitas, dúvidas ou indicação.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {imoveisRestantes.map((i) => (
                        <ImovelCard
                            key={i._id}
                            slug={i.slug.current}
                            titulo={i.titulo}
                            cidade={i.cidade ?? ""}
                            tipo={i.categoria?.titulo ?? "Imóvel"}
                            preco={i.preco}
                            imagem={i.imagem?.asset.url ?? "/placeholder.jpg"}
                        />
                    ))}
                </div>
            </section>

            <BlocoCTAConversao
                titulo="Não encontrou o imóvel ideal?"
                subtitulo="Nossa equipe conhece pessoalmente cada opção e pode sugerir algo feito sob medida."
                ctaText="Falar com especialista"
                ctaLink="https://wa.me/5511981845016?text=Olá! Vi os imóveis no site da Nova Ipê e gostaria de conversar."
            />
        </main>
    )
}
