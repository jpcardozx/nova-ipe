import { sanityClient } from "lib/sanity"
import { queryTodosImoveis } from "lib/queries"
import HeroInstitucional from "@/components/HeroInstitucional"
import ImovelCard from "@/components/ImovelCard"

interface Imovel {
    _id: string
    slug: { current: string }
    titulo: string
    cidade?: string
    preco?: number
    imagem?: { asset: { url: string } }
    categoria?: { titulo: string }
    finalidade: string
}

export default async function ComprarPage() {
    const imoveis: Imovel[] = await sanityClient.fetch(queryTodosImoveis)

    const imoveisDeAluguel = imoveis.filter((imovel) => imovel.finalidade === "Aluguel")

    return (
        <main className="w-full bg-[#F2EFEA] text-[#0D1F2D]">
            <HeroInstitucional
                titulo="Imóveis para alugar em Guararema"
                subtitulo="Casas e espaços comerciais disponíveis para locação de longo prazo"
                tagline="📍 Alugue com segurança"
            />

            <section className="max-w-6xl mx-auto px-6 md:px-8 py-16 grid md:grid-cols-3 gap-8">
                {imoveisDeAluguel.map((imovel) => (
                    <ImovelCard
                        key={imovel._id}
                        titulo={imovel.titulo}
                        slug={imovel.slug.current}
                        cidade={imovel.cidade}
                        categoria={imovel.categoria?.titulo}
                        imagem={imovel.imagem?.asset.url}
                        preco={imovel.preco}
                    />
                ))}
            </section>
        </main>
    )
}
