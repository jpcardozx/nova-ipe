"use client";

import { useState, useMemo } from "react";
import { MapPin, ExternalLink, Flame } from "lucide-react";

interface BlocoLocalizacaoImovelProps {
    endereco?: string;
    cidade: string;
    bairro?: string;
    mapaLink?: string;
    apiKey?: string;
    destaques?: string[];
    altaDemanda?: boolean;
}

export default function BlocoLocalizacaoImovel({
    endereco,
    cidade,
    bairro,
    mapaLink,
    apiKey,
    destaques = [],
    altaDemanda
}: BlocoLocalizacaoImovelProps) {
    const [mapError, setMapError] = useState(false);

    // Construct the embed URL from the provided information
    const embedUrl = useMemo(() => {
        if (mapError) return null;

        if (mapaLink) {
            // Handle map links correctly
            return mapaLink.includes("embed")
                ? mapaLink
                : mapaLink.replace("/maps", "/maps/embed");
        } else if (endereco && apiKey) {
            // Build query with available location data
            const query = bairro
                ? `${endereco}, ${bairro}, ${cidade}`
                : `${endereco}, ${cidade}`;
            return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(query)}`;
        }
        return null;
    }, [mapaLink, endereco, bairro, cidade, apiKey, mapError]);

    // Format the display address
    const displayAddress = endereco
        ? `${endereco}${bairro ? `, ${bairro}` : ''}, ${cidade}`
        : `${bairro ? `${bairro}, ` : ''}${cidade}`;

    // Create heading text based on available data
    const headingText = bairro
        ? `${bairro} - Localização estratégica`
        : 'Localização privilegiada';

    return (
        <section className="w-full bg-[#F9F8F6] py-16 px-4 md:px-10 border-t border-[#FFAD43]/10 relative">
            {/* High demand badge - only show if explicitly set to true */}
            {altaDemanda === true && (
                <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 bg-[#FFAD43]/10 text-[#FFAD43] px-3 py-1 rounded-full text-xs uppercase tracking-wide font-semibold">
                    <Flame className="w-3 h-3" /> Alta demanda
                </div>
            )}

            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-start">
                {/* Location information - Mobile first layout */}
                <div className="space-y-5">
                    <div className="flex items-center gap-2 text-[#FFAD43]">
                        <MapPin className="w-5 h-5" />
                        <span className="text-sm font-medium tracking-wide uppercase">Localização</span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-semibold text-[#0D1F2D]">
                        {headingText}
                    </h2>

                    <p className="text-base text-[#0D1F2D]/80 leading-relaxed">
                        Imóvel localizado em {displayAddress}, região conhecida por sua infraestrutura completa,
                        fácil acesso e crescente valorização imobiliária.
                    </p>

                    {/* Location highlights - simple list with bullets */}
                    {destaques.length > 0 && (
                        <ul className="space-y-2 pt-1">
                            {destaques.map((destaque, index) => (
                                <li key={index} className="flex gap-2 text-sm text-[#0D1F2D]/80">
                                    <span className="text-[#FFAD43] font-bold">•</span>
                                    {destaque}
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Map link - simplified with better mobile support */}
                    {mapaLink && (
                        <a
                            href={mapaLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-[#FFAD43] font-medium hover:text-[#E69622] transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" /> Ver no Google Maps
                        </a>
                    )}
                </div>

                {/* Map embed with error handling */}
                <div className="w-full h-80 rounded-xl overflow-hidden shadow-lg border border-[#FFAD43]/10">
                    {embedUrl ? (
                        <iframe
                            src={embedUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={`Localização: ${displayAddress}`}
                            onError={() => setMapError(true)}
                        ></iframe>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-4 text-center">
                            <MapPin className="w-8 h-8 text-[#FFAD43]/40 mb-2" />
                            <p className="text-sm text-[#0D1F2D]/50">
                                {mapError
                                    ? "Não foi possível carregar o mapa."
                                    : "Localização indisponível"}
                            </p>
                            {mapError && mapaLink && (
                                <a
                                    href={mapaLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 text-xs text-[#FFAD43] hover:underline"
                                >
                                    Abrir no Google Maps
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}