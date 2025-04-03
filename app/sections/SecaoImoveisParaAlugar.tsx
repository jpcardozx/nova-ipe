"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

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
        <section className="w-full bg-[#111827] py-24 px-6 text-white">
            <div className="max-w-7xl mx-auto">
                {/* Título refinado */}
                <div className="text-center mb-14">
                    <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white leading-tight">
                        Imóveis <span className="text-[#FFAD43] font-semibold">para Alugar</span>
                    </h2>
                    <p className="mt-4 text-base md:text-lg text-white/60 font-light max-w-2xl mx-auto">
                        Conforto, praticidade e localização. Conheça nossos imóveis prontos para locação imediata.
                    </p>
                </div>

                {/* Carrossel com destaque visual */}
                <div className="relative">
                    <Swiper
                        modules={[Navigation]}
                        navigation
                        spaceBetween={32}
                        slidesPerView={1.1}
                        breakpoints={{
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="px-2"
                    >
                        {imoveisAluguelMock.map((imovel, index) => (
                            <SwiperSlide key={index}>
                                <div className="hover:-translate-y-2 transition-transform duration-300 ease-out">
                                    <ImovelCard {...imovel} />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Botões de navegação (opcional, discretos) */}
                    <div className="absolute -top-16 right-0 hidden md:flex gap-3">
                        <button className="swiper-button-prev text-white/70 hover:text-[#FFAD43] transition">←</button>
                        <button className="swiper-button-next text-white/70 hover:text-[#FFAD43] transition">→</button>
                    </div>
                </div>
            </div>
        </section>
    );
}
