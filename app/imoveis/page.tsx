import { sanityClient } from "lib/sanity"
import { queryTodosImoveis } from "lib/queries"
import ImovelCard from "@/components/ImovelCard"
import HeroInstitucional from "@/components/HeroInstitucional"
import BlocoExploracaoSimbolica from "@/components/BlocoExploracaoSimbolica"
import BlocoCTAConversao from "@/components/BlocoCTAConversao"

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
                subtitulo="Cada imóvel listado aqui passou por verificação documental e foi visitado pela equipe. Temos compromisso com clareza e boa experiência."
            />

            <BlocoExploracaoSimbolica />

            {imoveisDestaque.length > 0 && (
                <section className="max-w-6xl mx-auto px-6 md:px-8 py-24 space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-playfair tracking-tight text-[#0D1F2D]">
                            Destaques do momento
                        </h2>
                        <p className="text-sm text-[#0D1F2D]/60 leading-relaxed">
                            Imóveis com localização privilegiada, alta procura ou condições especiais de negociação.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {imoveisDestaque.map((imovel) => (
                            <ImovelCard
                                key={imovel._id}
                                titulo={imovel.titulo}
                                slug={imovel.slug.current}
                                preco={imovel.preco}
                                cidade={imovel.cidade}
                                categoria={imovel.categoria?.titulo}
                                imagem={imovel.imagem?.asset.url}
                            />
                        ))}
                    </div>
                </section>
            )}

            <section className="max-w-6xl mx-auto px-6 md:px-8 py-24 space-y-8 border-t border-dashed border-[#0D1F2D]/10">
                <div className="space-y-2">
                    <h2 className="text-3xl font-playfair tracking-tight text-[#0D1F2D]">
                        Todos os imóveis disponíveis
                    </h2>
                    <p className="text-sm text-[#0D1F2D]/60 max-w-2xl leading-relaxed">
                        Catálogo completo da Nova Ipê. Converse com a gente para visitas, dúvidas ou indicações personalizadas.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {imoveisRestantes.map((imovel) => (
                        <ImovelCard
                            key={imovel._id}
                            titulo={imovel.titulo}
                            slug={imovel.slug.current}
                            preco={imovel.preco}
                            cidade={imovel.cidade}
                            categoria={imovel.categoria?.titulo}
                            imagem={imovel.imagem?.asset.url}
                        />
                    ))}
                </div>
            </section>

            <BlocoCTAConversao
                titulo="Quer ajuda para encontrar o imóvel certo?"
                subtitulo="Nossa equipe conhece pessoalmente todos os imóveis do catálogo. Podemos indicar boas opções com base nas suas preferências."
                ctaText="Falar com um especialista"
                ctaLink="https://wa.me/5511981845016?text=Olá! Vi os imóveis no site da Nova Ipê e gostaria de conversar com um especialista."
            />
        </main>
    )
}