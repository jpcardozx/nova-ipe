"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"

import { ChevronLeft, ChevronRight } from "lucide-react"
import ImovelCard, { ImovelCardProps } from "../components/ImovelCard"

const imoveisParaAlugar: ImovelCardProps[] = [
    {
        slug: "casa-aluguel-guararema",
        titulo: "Casa térrea mobiliada no centro",
        cidade: "Guararema - Itaoca",
        tipo: "Casa",
        imagem: "/images/imoveis/teste/imovel4.jpg",
        preco: "3.200/mês",
    },
    {
        slug: "apto-aluguel-mogi",
        titulo: "Apto 2 dorms com varanda",
        cidade: "Guararema - Centro",
        tipo: "Apartamento",
        imagem: "/images/imoveis/teste/imovel5.jpg",
        preco: "2.100/mês",
    },
    // ...
]

export default function SecaoImoveisParaAlugar() {
    return (
        <section className="bg-gray-800 py-20 text-white">
            <div className="max-w-7xl mx-auto px-6 text-center mb-12">
                <h2 className="text-4xl font-bold">
                    Imóveis <span className="text-yellow-500">para Alugar</span>
                </h2>
                <p className="mt-3 text-gray-300">
                    Locação ágil e segura, com opções prontas para você entrar e morar.
                </p>
            </div>

            <div className="relative">
                <Swiper
                    modules={[Navigation]}
                    navigation={{
                        nextEl: ".btn-next-aluguel",
                        prevEl: ".btn-prev-aluguel",
                    }}
                    spaceBetween={24}
                    slidesPerView={1.2}
                    breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
                    className="px-4"
                >
                    {imoveisParaAlugar.map((item) => (
                        <SwiperSlide key={item.slug}>
                            <ImovelCard {...item} />
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="absolute top-0 right-0 flex space-x-2">
                    <button className="btn-prev-aluguel p-2 bg-gray-700 rounded-full">
                        <ChevronLeft />
                    </button>
                    <button className="btn-next-aluguel p-2 bg-gray-700 rounded-full">
                        <ChevronRight />
                    </button>
                </div>
            </div>
        </section>
    )
}
