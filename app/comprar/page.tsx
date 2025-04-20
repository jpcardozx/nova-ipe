import { sanityClient } from "lib/sanity"
import { queryTodosImoveis } from "lib/queries"
import HeroInstitucional from "@/app/components/HeroInstitucional"
import ImovelCard from "@/app/components/ImovelCard"

interface Imovel {
    _id: string
    slug: { current: string }
    titulo: string
    cidade: string
    tipo: string
    preco?: number
    imagem?: { asset: { url: string } }
    categoria?: { titulo: string }
    finalidade: string
}

export default async function ComprarPage() {
    const imoveis: Imovel[] = await sanityClient.fetch(queryTodosImoveis)
    const imoveisDeVenda = imoveis.filter((i) => i.finalidade === "Venda")

    return (
        <main className="w-full bg-[#F2EFEA] text-[#0D1F2D]">
            <HeroInstitucional
                tagline="🏡 Encontre seu novo lar"
                titulo="Imóveis à venda em Guararema"
                subtitulo="Casas, chácaras e terrenos verificados pela equipe Nova Ipê. Prontos para morar ou investir com segurança."
            />

            <section className="max-w-6xl mx-auto px-6 md:px-8 py-16 grid md:grid-cols-3 gap-8">
                {imoveisDeVenda.map((imovel) => (
                    <ImovelCard
                        key={imovel._id}
                        titulo={imovel.titulo}
                        slug={imovel.slug.current}
                        categoria={imovel.categoria?.titulo || "Imóvel"}
                        imagem={imovel.imagem?.asset.url || "/imoveis/bg3.jpg"}
                        cidade={imovel.cidade}
                        tipo={imovel.tipo}
                        preco={imovel.preco}
                    />
                ))}
            </section>
        </main>
    )
}
