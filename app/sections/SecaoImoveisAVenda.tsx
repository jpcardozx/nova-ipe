"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import ImovelCard from "../components/ImovelCard";

const imoveisMock = [
    {
        slug: "casa-com-piscina-guararema",
        titulo: "Casa com Piscina e Área Gourmet",
        cidade: "Guararema - Centro",
        tipo: "Casa",
        imagemPrincipal: "/images/imoveis/teste/imovel1.jpg",
        preco: "R$ 750.000",
    },
    {
        slug: "chacara-santa-isabel",
        titulo: "Chácara com Pomar e Nascente",
        cidade: "Guararema - Freguesia da Escada",
        tipo: "Chácara",
        imagemPrincipal: "/images/imoveis/teste/imovel2.jpg",
        preco: "R$ 980.000",
    },
    {
        slug: "apartamento-mogi",
        titulo: "Apartamento moderno no centro",
        cidade: "Santa Isabel",
        tipo: "Apartamento",
        imagemPrincipal: "/images/imoveis/teste/imovel3.jpg",
        preco: "R$ 420.000",
    },
];

export default function SecaoImoveisAVenda() {
    return (
        <section className="w-full bg-[#0D1F2D] py-24 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Cabeçalho elegante */}
                <div className="text-center mb-14">
                    <h2 className="text-4xl md:text-5xl font-light text-[#F7D7A3] tracking-tight leading-snug">
                        Nossos <span className="text-[#FFAD43] font-medium">Imóveis à Venda</span>
                    </h2>
                    <p className="mt-4 text-base md:text-lg text-[#F7D7A3]/70 max-w-2xl mx-auto font-light">
                        Explore imóveis cuidadosamente selecionados em Guararema e região, prontos para fazer parte da sua história.
                    </p>
                </div>

                {/* Carrossel estilizado */}
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
                        className="!px-2"
                    >
                        {imoveisMock.map((imovel, index) => (
                            <SwiperSlide key={index} className="pb-4">
                                <div className="hover:-translate-y-1.5 transition-transform duration-300">
                                    <ImovelCard {...imovel} />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Controles customizados opcionais */}
                    <div className="absolute -top-20 right-0 hidden md:flex gap-4">
                        <button className="swiper-button-prev text-[#F7D7A3] hover:text-[#FFAD43] transition">
                            ←
                        </button>
                        <button className="swiper-button-next text-[#F7D7A3] hover:text-[#FFAD43] transition">
                            →
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
