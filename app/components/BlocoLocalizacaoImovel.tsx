"use client";

import { MapPin, LocateIcon, Flame } from "lucide-react";

interface BlocoLocalizacaoImovelProps {
    endereco?: string;
    cidade: string;
    mapaLink?: string;
    apiKey?: string;
    bairro?: string;
}

export default function BlocoLocalizacaoImovel({ endereco, cidade, mapaLink, apiKey }: BlocoLocalizacaoImovelProps) {
    const embedUrl = mapaLink
        ? mapaLink.includes("embed")
            ? mapaLink
            : mapaLink.replace("/maps", "/maps/embed")
        : endereco && apiKey
            ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(endereco)}`
            : null;

    return (
        <section className="w-full bg-[#F9F8F6] py-24 px-6 md:px-10 border-t border-[#FFAD43]/10 relative">
            <div className="absolute top-6 right-6 flex items-center gap-2 bg-[#FFAD43]/10 text-[#FFAD43] px-4 py-1 rounded-full text-xs uppercase tracking-wide font-medium shadow-sm">
                <Flame className="w-4 h-4" /> Localização de alta demanda
            </div>

            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
                {/* Texto institucional */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-[#FFAD43]">
                        <MapPin className="w-6 h-6" />
                        <span className="text-sm font-medium tracking-wide uppercase">Localização do imóvel</span>
                    </div>

                    <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] font-semibold leading-tight text-[#0D1F2D]">
                        Bairro valorizado, fácil acesso e excelente vizinhança
                    </h2>

                    <p className="text-base text-[#0D1F2D]/80 leading-relaxed max-w-xl">
                        Este imóvel está localizado em {cidade}, em uma área reconhecida por sua tranquilidade, boa infraestrutura e crescente valorização. Um ponto estratégico para quem busca equilíbrio entre natureza e praticidade.
                    </p>

                    {endereco && (
                        <p className="text-sm text-[#0D1F2D]/60 italic">
                            Endereço aproximado: {endereco}
                        </p>
                    )}

                    {mapaLink && (
                        <a
                            href={mapaLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-2 text-sm text-[#FFAD43] font-medium hover:underline"
                        >
                            <LocateIcon className="w-4 h-4" /> Ver no Google Maps
                        </a>
                    )}
                </div>

                {/* Mapa embed com fallback */}
                <div className="relative w-full h-[380px] rounded-3xl overflow-hidden shadow-xl border border-[#FFAD43]/10">
                    {embedUrl ? (
                        <iframe
                            src={embedUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    ) : (
                        <div className="flex items-center justify-center h-full text-sm text-[#0D1F2D]/50 italic">
                            Localização indisponível no momento
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}