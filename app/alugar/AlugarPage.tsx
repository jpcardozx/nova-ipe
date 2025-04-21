"use client"

import { useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, A11y, Pagination, Autoplay } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/a11y"

import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import ImovelCard from "@/app/components/ImovelCard"
import Valor from "@/app/sections/Valor"
import Navbar from "@/app/sections/NavBar"
import Footer from "@/app/sections/Footer"

interface ImovelAlugar {
    _id: string
    slug: { current: string }
    titulo: string
    cidade: string
    bairro: string
    preco: number
    destaque?: boolean
    imagem?: { asset: { url: string } }
    quartos?: number
    area?: number
    categoria?: { titulo: string; slug: string }
    aceitaPets?: boolean
    mobiliado?: boolean
}

interface AlugarPageProps {
    imoveis?: ImovelAlugar[]
}

export default function AlugarPage({ imoveis = [] }: AlugarPageProps) {
    const prevButtonRef = useRef<HTMLButtonElement>(null)
    const nextButtonRef = useRef<HTMLButtonElement>(null)

    return (
        <section className="bg-[#F2F2EF] text-[#0D1F2D] pb-20">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight font-playfair">
                        Imóveis para alugar em Guararema
                    </h2>
                    <p className="text-base md:text-lg mt-4 text-[#0D1F2D]/70 max-w-2xl mx-auto">
                        Ofertas seguras e acessíveis para quem busca praticidade, conforto e boa localização. Selecione, agende e visite com tranquilidade.
                    </p>
                </div>

                {imoveis.length > 0 ? (
                    <Swiper
                        modules={[Navigation, A11y, Pagination, Autoplay]}
                        navigation={{
                            prevEl: prevButtonRef.current,
                            nextEl: nextButtonRef.current,
                        }}
                        pagination={{ clickable: true, dynamicBullets: true }}
                        autoplay={{ delay: 6000, disableOnInteraction: true }}
                        spaceBetween={32}
                        slidesPerView={1.1}
                        breakpoints={{
                            768: { slidesPerView: 2, spaceBetween: 40 },
                            1024: { slidesPerView: 3, spaceBetween: 48 },
                        }}
                        className="pb-20"
                    >
                        {imoveis.map((imovel) => (
                            <SwiperSlide key={imovel._id}>
                                <ImovelCard
                                    slug={imovel.slug.current}
                                    titulo={imovel.titulo}
                                    cidade={imovel.cidade}
                                    bairro={imovel.bairro}
                                    preco={imovel.preco}
                                    imagem={imovel.imagem?.asset?.url}
                                    destaque={imovel.destaque}
                                    categoria={imovel.categoria}
                                    metros={imovel.area?.toString()}
                                    finalidade="Aluguel"
                                    aceitaFinanciamento={false}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-lg text-[#0D1F2D]/70">
                            No momento não há imóveis disponíveis para locação. Tente novamente em breve.
                        </p>
                    </div>
                )}

                <div className="flex justify-between items-center mt-6">
                    <div className="pagination-bullets" />
                    <div className="flex gap-3">
                        <button
                            ref={prevButtonRef}
                            className="p-2 bg-white hover:bg-yellow-400 text-[#0D1F2D] rounded-full border border-gray-200 shadow-sm transition"
                            aria-label="Anterior"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            ref={nextButtonRef}
                            className="p-2 bg-white hover:bg-yellow-400 text-[#0D1F2D] rounded-full border border-gray-200 shadow-sm transition"
                            aria-label="Próximo"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="text-center mt-20">
                    <p className="text-base text-[#0D1F2D]/70 mb-3 max-w-xl mx-auto">
                        Preferência por imóvel mobiliado ou com pet? Entre em contato e receba sugestões com base no seu perfil.
                    </p>
                    <Link
                        href="/contato"
                        className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-[#0D1F2D] px-6 py-3 rounded-full font-medium transition border-amber-100 shadow-md hover:shadow-lg mb-12"
                    >
                        Falar com um especialista <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
            <Valor />
            <Footer />
        </section>
    )
}