"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"

import { ChevronLeft, ChevronRight } from "lucide-react"
import ImovelCard, { ImovelCardProps } from "../components/ImovelCard"

const imoveisAVenda: ImovelCardProps[] = [
    {
        slug: "casa-com-piscina-guararema",
        titulo: "Casa com Piscina e Área Gourmet",
        cidade: "Guararema - Centro",
        tipo: "Casa",
        imagem: "/images/imoveis/teste/imovel1.jpg",
        preco: 750_000,
        destaque: true,
    },
    {
        slug: "chacara-santa-isabel",
        titulo: "Chácara com Pomar e Nascente",
        cidade: "Guararema - Freguesia da Escada",
        tipo: "Chácara",
        imagem: "/images/imoveis/teste/imovel2.jpg",
        preco: 980_000,
    },
    // ...
]

export default function SecaoImoveisAVenda() {
    return (
        <section className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-6 text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900">
                    Imóveis <span className="text-yellow-500">à Venda</span>
                </h2>
                <p className="mt-3 text-gray-600">
                    Espaços selecionados com potencial de valorização e pronta entrega.
                </p>
            </div>

            <div className="relative">
                <Swiper
                    modules={[Navigation]}
                    navigation={{
                        nextEl: ".btn-next-venda",
                        prevEl: ".btn-prev-venda",
                    }}
                    spaceBetween={24}
                    slidesPerView={1.2}
                    breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
                    className="px-4"
                >
                    {imoveisAVenda.map((item) => (
                        <SwiperSlide key={item.slug}>
                            <ImovelCard {...item} />
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="absolute top-0 right-0 flex space-x-2">
                    <button className="btn-prev-venda p-2 bg-white rounded-full shadow">
                        <ChevronLeft />
                    </button>
                    <button className="btn-next-venda p-2 bg-white rounded-full shadow">
                        <ChevronRight />
                    </button>
                </div>
            </div>
        </section>
    )
}
