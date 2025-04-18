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
    preco?: string
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
            {/* Hero editorial e simbólico */}
            <HeroInstitucional
                tagline="Curadoria Nova Ipê"
                titulo="Imóveis selecionados em Guararema"
                subtitulo="Mais do que metragem: oferecemos imóveis com localização estratégica, valor simbólico e documentação validada. Nossa equipe acompanha pessoalmente cada oportunidade."
            />

            {/* Bloco simbólico de exploração */}
            <BlocoExploracaoSimbolica />

            {/* Destaques */}
            {imoveisDestaque.length > 0 && (
                <section className="max-w-6xl mx-auto px-6 md:px-8 py-24 space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-playfair tracking-tight text-[#0D1F2D]">
                            ⭐ Imóveis em destaque
                        </h2>
                        <p className="text-sm text-[#0D1F2D]/60 leading-relaxed italic">
                            Oportunidades com características únicas, prontas para visitação ou negociação assistida.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {imoveisDestaque.map((imovel) => (
                            <ImovelCard
                                key={imovel._id}
                                titulo={imovel.titulo}
                                slug={imovel.slug.current}
                                preco={imovel.preco}
                                cidade={imovel.cidade || ""}
                                categoria={imovel.categoria?.titulo || "Imóvel"}
                                imagemPrincipal={imovel.imagem?.asset?.url || ""}
                                destaque // <-- Selo pode ser tratado internamente no card
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Todos os imóveis */}
            <section className="max-w-6xl mx-auto px-6 md:px-8 py-24 space-y-8 border-t border-dashed border-[#0D1F2D]/10">
                <div className="space-y-2">
                    <h2 className="text-3xl font-playfair tracking-tight text-[#0D1F2D]">
                        📋 Todos os imóveis disponíveis
                    </h2>
                    <p className="text-sm text-[#0D1F2D]/60 max-w-2xl leading-relaxed italic">
                        Esses são todos os imóveis ativos, disponíveis para visitação. Explore com calma ou fale com nossa equipe para uma curadoria personalizada.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {imoveisRestantes.map((imovel) => (
                        <ImovelCard
                            key={imovel._id}
                            titulo={imovel.titulo}
                            slug={imovel.slug.current}
                            preco={imovel.preco}
                            cidade={imovel.cidade || ""}
                            categoria={imovel.categoria?.titulo || "Imóvel"}
                            imagemPrincipal={imovel.imagem?.asset?.url || ""}
                        />
                    ))}
                </div>
            </section>

            {/* CTA consultivo refinado */}
            <BlocoCTAConversao
                titulo="Não encontrou o imóvel ideal?"
                subtitulo="Nossa equipe local pode te apresentar oportunidades sob medida, com privacidade e curadoria. Atendimento sem compromisso via WhatsApp ou telefone."
                ctaText="Falar com um especialista"
                ctaLink="https://wa.me/5511981845016?text=Olá! Vi os imóveis no site da Nova Ipê e gostaria de conversar com um especialista."
            />
        </main>
    )
}
