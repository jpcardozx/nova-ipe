"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { ChevronLeft, ChevronRight } from "lucide-react";
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
    {
        slug: "casa-aluguel-guararema",
        titulo: "Casa",
        cidade: "Guararema - Itaoca",
        tipo: "Casa",
        imagemPrincipal: "/images/imoveis/teste/imovel4.jpg",
        preco: "R$ 320.000",
    },
    {
        slug: "apto-aluguel-mogi",
        titulo: "Apartamento",
        cidade: "Guararema - Centro",
        tipo: "Apartamento",
        imagemPrincipal: "/images/imoveis/teste/imovel5.jpg",
        preco: "R$ 210.000/mês",
    },
    {
        slug: "sala-comercial-centro",
        titulo: "Sala comercial 40m² no centro",
        cidade: "Guararema - Freguesia da Escada",
        tipo: "Comercial",
        imagemPrincipal: "/images/imoveis/teste/imovel6.jpg",
        preco: "R$ 185.000",
    },
];

export default function SecaoImoveisAVenda() {
    return (
        <section className="w-full bg-[#0D1F2D] py-28 px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Cabeçalho com presença */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-semibold text-[#F7D7A3] leading-tight tracking-tight">
                        Imóveis <span className="text-[#FFAD43] font-bold">à Venda</span>
                    </h2>
                    <p className="mt-4 text-base md:text-lg text-[#F7D7A3]/70 max-w-2xl mx-auto font-light">
                        Selecionamos imóveis com potencial real de valorização, localização privilegiada e estrutura pronta para morar ou investir.
                    </p>
                </div>

                {/* Carrossel com refinamento visual */}
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
                        {imoveisMock.map((imovel, index) => (
                            <SwiperSlide key={index} className="pb-4">
                                <div className="transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
                                    <ImovelCard {...imovel} />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Botões customizados */}
                    <div className="absolute -top-20 right-0 hidden md:flex gap-4 z-10">
                        <button className="swiper-prev-custom flex items-center justify-center w-10 h-10 rounded-full border border-[#F7D7A3]/40 text-[#F7D7A3] hover:text-[#FFAD43] hover:border-[#FFAD43] transition">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button className="swiper-next-custom flex items-center justify-center w-10 h-10 rounded-full border border-[#F7D7A3]/40 text-[#F7D7A3] hover:text-[#FFAD43] hover:border-[#FFAD43] transition">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
