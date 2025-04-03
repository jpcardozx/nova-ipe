"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

interface ImovelCardProps {
    titulo: string;
    cidade: string;
    tipo: string;
    imagemPrincipal: string;
    slug: string;
    preco?: string;
    //    destaque?: boolean; // para variações visuais futuras
}

export default function ImovelCard({
    titulo,
    cidade,
    tipo,
    imagemPrincipal,
    slug,
    preco,
    //   destaque = false,
}: ImovelCardProps) {
    return (
        <Link
            href={`/imovel/${slug}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
        >
            {/* Imagem do imóvel */}
            <div className="relative h-56 w-full overflow-hidden">
                <Image
                    src={imagemPrincipal}
                    alt={titulo}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                {/* Tag tipo de imóvel */}
                <span className="absolute top-4 left-4 bg-[#FFAD43] text-[#0D1F2D] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    {tipo}
                </span>
            </div>

            {/* Conteúdo textual */}
            <div className="flex-1 p-5 bg-[#0D1F2D] text-[#F7D7A3]">
                <h3 className="text-lg font-medium leading-snug group-hover:text-white transition-colors">
                    {titulo}
                </h3>

                <div className="flex items-center gap-2 text-sm text-[#F7D7A3]/80 mt-1">
                    <MapPin className="w-4 h-4 text-[#FFAD43]" />
                    <span>{cidade}</span>
                </div>

                {preco && (
                    <p className="mt-3 text-base font-semibold text-[#FFAD43]">{preco}</p>
                )}
            </div>

            {/* CTA animado no hover */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <div className="flex items-center gap-1 text-[#FFAD43] hover:text-white transition-colors text-sm font-medium">
                    <span>Ver detalhes</span>
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>
        </Link>
    );
}
