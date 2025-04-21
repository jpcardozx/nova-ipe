"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"

import { ChevronLeft, ChevronRight } from "lucide-react"
import ImovelCard, { ImovelCardProps } from "../components/ImovelCard"

// Adaptando os dados para corresponder à nova interface do ImovelCard
const imoveisAVenda: ImovelCardProps[] = [
    {
        slug: "casa-com-piscina-guararema",
        titulo: "Casa com Piscina e Área Gourmet",
        cidade: "Guararema",
        bairro: "Centro",
        finalidade: "Venda", // Adicionando a finalidade
        categoria: {
            titulo: "Casa",  // Agora como objeto categoria
            slug: "casa"
        },
        imagem: "/images/imoveis/teste/imovel1.jpg",
        preco: 750_000,
        destaque: true,
        metros: "180"
    },
    {
        slug: "chacara-santa-isabel",
        titulo: "Chácara com Pomar e Nascente",
        cidade: "Guararema",
        bairro: "Freguesia da Escada",
        finalidade: "Venda", // Adicionando a finalidade
        categoria: {
            titulo: "Chácara", // Agora como objeto categoria
            slug: "chacara"
        },
        imagem: "/images/imoveis/teste/imovel2.jpg",
        preco: 980_000,
        metros: "2500"
    },
    // ... outros imóveis
]

export default function SecaoImoveisAVenda() {
    return (
        <section className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-6 text-center mb-12">
                <h2 className="text-4xl font-bold">
                    Imóveis <span className="text-amber-500">à Venda</span>
                </h2>
                <p className="mt-3 text-gray-600">
                    Espaços selecionados com potencial de valorização e pronta entrega.
                </p>
            </div>

            <div className="relative max-w-7xl mx-auto">
                <Swiper
                    modules={[Navigation]}
                    navigation={{
                        nextEl: ".btn-next-venda",
                        prevEl: ".btn-prev-venda",
                    }}
                    spaceBetween={24}
                    slidesPerView={1.2}
                    breakpoints={{
                        640: { slidesPerView: 1.5 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 }
                    }}
                    className="px-6"
                >
                    {imoveisAVenda.map((item) => (
                        <SwiperSlide key={item.slug}>
                            <ImovelCard {...item} />
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 z-10 pointer-events-none">
                    <button className="btn-prev-venda p-3 rounded-full bg-white shadow-lg text-amber-500 hover:bg-amber-50 transition-all transform-gpu hover:scale-110 pointer-events-auto focus:outline-none">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button className="btn-next-venda p-3 rounded-full bg-white shadow-lg text-amber-500 hover:bg-amber-50 transition-all transform-gpu hover:scale-110 pointer-events-auto focus:outline-none">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Adicione um link "Ver todos" que combina com o design */}
            <div className="text-center mt-12">
                <a
                    href="/imoveis/venda"
                    className="inline-flex items-center text-amber-600 font-medium border-b-2 border-amber-300 hover:border-amber-600 transition-colors pb-1"
                >
                    Ver todos os imóveis à venda
                    <ChevronRight className="ml-1 w-4 h-4" />
                </a>
            </div>
        </section>
    )
}