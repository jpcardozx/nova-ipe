"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { ChevronLeft, ChevronRight } from "lucide-react";
import ImovelCard from "../components/ImovelCard";

const imoveisAluguelMock = [
    {
        slug: "casa-aluguel-guararema",
        titulo: "Casa térrea mobiliada no centro",
        cidade: "Guararema - Itaoca",
        tipo: "Casa",
        imagemPrincipal: "/images/imoveis/teste/imovel4.jpg",
        preco: "R$ 3.200/mês",
    },
    {
        slug: "apto-aluguel-mogi",
        titulo: "Apartamento 2 dorms com varanda",
        cidade: "Guararema - Centro",
        tipo: "Apartamento",
        imagemPrincipal: "/images/imoveis/teste/imovel5.jpg",
        preco: "R$ 2.100/mês",
    },
    {
        slug: "sala-comercial-centro",
        titulo: "Sala comercial 40m² no centro",
        cidade: "Guararema - Freguesia da Escada",
        tipo: "Comercial",
        imagemPrincipal: "/images/imoveis/teste/imovel6.jpg",
        preco: "R$ 1.850/mês",
    },
];

export default function SecaoImoveisParaAlugar() {
    return (
        <section className="w-full bg-[#111827] py-28 px-6 text-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Cabeçalho institucional refinado */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight text-white">
                        Imóveis <span className="text-[#FFAD43] font-bold">para Alugar</span>
                    </h2>
                    <p className="mt-4 text-base md:text-lg text-white/70 max-w-2xl mx-auto font-light">
                        Locação prática, segura e com curadoria local. Moradias, apartamentos e salas comerciais prontos para uso imediato.
                    </p>
                </div>

                {/* Carrossel elegante */}
                <div className="relative group">
                    <Swiper
                        modules={[Navigation]}
                        navigation={{
                            nextEl: ".swiper-next-custom",
                            prevEl: ".swiper-prev-custom",
                        }}
                        spaceBetween={32}
                        slidesPerView={1.1}
                        breakpoints={{
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="!px-2"
                    >
                        {imoveisAluguelMock.map((imovel, index) => (
                            <SwiperSlide key={index}>
                                <div className="transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg">
                                    <ImovelCard {...imovel} />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Botões customizados */}
                    <div className="absolute -top-20 right-0 hidden md:flex gap-4 z-10">
                        <button className="swiper-prev-custom flex items-center justify-center w-10 h-10 rounded-full border border-white/30 text-white hover:text-[#FFAD43] hover:border-[#FFAD43] transition">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button className="swiper-next-custom flex items-center justify-center w-10 h-10 rounded-full border border-white/30 text-white hover:text-[#FFAD43] hover:border-[#FFAD43] transition">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
