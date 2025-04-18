"use client";

import Image from "next/image";

interface HeroImovelProps {
    imagem: string;
    titulo: string;
    cidade: string;
    tipo: string;
    metros: string;
}

export default function HeroImovel({ imagem, titulo, cidade, tipo, metros }: HeroImovelProps) {
    return (
        <section className="relative w-full h-[75vh] overflow-hidden">
            {/* Background image with angular mask */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={imagem}
                    alt={titulo}
                    fill
                    priority
                    className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                {/* Angular cut at bottom */}
                <div className="absolute bottom-0 w-full h-24 bg-[#fafaf9] clip-path-hero-mask" />
            </div>

            {/* Institutional watermark */}
            <div className="absolute bottom-6 right-6 z-10 opacity-10">
                <span className="text-6xl font-extrabold text-white select-none">Ipê</span>
            </div>

            {/* Content */}
            <div className="relative z-20 h-full w-full flex flex-col justify-end pb-24 px-6 md:px-14 max-w-7xl mx-auto">
                <h1 className="text-[clamp(2.2rem,6vw,3.6rem)] font-semibold text-white leading-tight max-w-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                    {titulo}
                </h1>
                <p className="mt-3 text-white/80 text-[clamp(1rem,2vw,1.3rem)]">
                    {cidade} · {tipo} · {metros}
                </p>

                <div className="mt-6 inline-block bg-[#FFAD43]/90 text-[#0D1F2D] text-xs px-4 py-[6px] rounded-full uppercase tracking-wide font-semibold shadow-sm">
                    Imóvel exclusivo Ipê
                </div>
            </div>

            <style jsx>{`
        .clip-path-hero-mask {
          clip-path: polygon(0% 100%, 0% 0%, 100% 0%, 100% 65%, 0% 100%);
        }
      `}</style>
        </section>
    );
}