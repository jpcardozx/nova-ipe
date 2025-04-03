"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Home, ArrowRight } from "lucide-react";
import AdvancedDropdown from "../components/AdvancedDropdown";

const LOCATIONS = ["Guararema", "Mogi das Cruzes", "Santa Isabel", "Jacareí"];
const PROPERTY_TYPES = ["Todos", "Casa", "Apartamento", "Terreno", "Chácara", "Comercial"];

export default function Hero() {
    const router = useRouter();
    const [selectedLocation, setSelectedLocation] = useState("Guararema");
    const [selectedType, setSelectedType] = useState("Todos");

    const handleSearch = () => {
        router.push(`/busca?local=${selectedLocation}&tipo=${selectedType}`);
    };

    return (
        <section className="relative w-full h-[100vh] flex items-center justify-center bg-[#0D1F2D] overflow-hidden">
            {/* Background com overlay sutil */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/hero-bg.jpg"
                    alt="Vista aérea de Guararema"
                    fill
                    className="object-cover object-center brightness-[0.6] saturate-50"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0D1F2D]/90 via-[#0D1F2D]/60 to-[#0D1F2D]" />
            </div>

            {/* Conteúdo principal */}
            <div className="relative z-10 w-full max-w-4xl px-6 text-center text-white">
                <h1 className="text-3xl md:text-5xl font-light tracking-tight mb-4 leading-tight">
                    Viva o melhor de <span className="text-[#FFAD43] font-semibold">Guararema</span> com o imóvel ideal
                </h1>

                <p className="text-base md:text-lg text-[#F7D7A3] max-w-xl mx-auto mb-10 font-light">
                    Atendimento exclusivo, imóveis selecionados com curadoria de quem conhece a região.
                </p>

                {/* Formulário de busca com destaque refinado */}
                <div className="flex flex-col md:flex-row items-center gap-3 bg-white/10 border border-white/10 p-4 rounded-xl backdrop-blur-md shadow-md">
                    <div className="w-full md:w-1/2">
                        <AdvancedDropdown
                            icon={<MapPin className="w-5 h-5 text-[#FFAD43]" />}
                            options={LOCATIONS}
                            selected={selectedLocation}
                            onSelect={setSelectedLocation}
                        />
                    </div>
                    <div className="w-full md:w-1/2">
                        <AdvancedDropdown
                            icon={<Home className="w-5 h-5 text-[#FFAD43]" />}
                            options={PROPERTY_TYPES}
                            selected={selectedType}
                            onSelect={setSelectedType}
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-[#FFAD43] hover:bg-[#f9a52f] text-[#0D1F2D] font-medium rounded-lg transition-all text-sm"
                    >
                        Buscar imóveis
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* CTA secundária refinada */}
                <div className="mt-6">
                    <a
                        href="https://wa.me/5511999999999"
                        className="inline-flex items-center gap-2 text-[#F7D7A3] hover:text-[#FFAD43] text-sm transition-colors"
                    >
                        Atendimento direto via WhatsApp
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </section>
    );
}
