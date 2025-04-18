"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin } from "lucide-react"

interface ImovelCardProps {
  titulo: string
  cidade: string
  categoria: string
  imagemPrincipal?: string
  slug: string
  preco?: string
}

export default function ImovelCard({
  titulo,
  cidade,
  categoria,
  imagemPrincipal,
  slug,
  preco
}: ImovelCardProps) {
  return (
    <Link
      href={`/imovel/${slug}`}
      className="group relative flex flex-col rounded-3xl overflow-hidden bg-[#fafafa] shadow-lg border border-[#FFAD43]/10 hover:shadow-2xl transition-all duration-300"
      aria-label={`Acessar página do imóvel: ${titulo}`}
    >
      <div className="relative h-64 w-full overflow-hidden">
        {imagemPrincipal ? (
          <Image
            src={imagemPrincipal}
            alt={`Imagem principal do imóvel: ${titulo}`}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">Sem imagem</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        <span className="absolute top-4 left-4 bg-[#FFAD43] text-[#0D1F2D] text-[10px] px-3 py-[6px] rounded-full font-semibold tracking-wide uppercase shadow-sm">
          {categoria}
        </span>
        <div className="absolute bottom-3 right-3 text-[10px] uppercase tracking-wide bg-[#0D1F2D]/90 text-white px-3 py-[6px] rounded-full shadow-md">
          Exclusivo Ipê
        </div>
      </div>

      <div className="p-5 space-y-3 text-[#0D1F2D]">
        <h3 className="text-[clamp(1.05rem,1.8vw,1.25rem)] font-medium leading-tight max-w-[90%] group-hover:text-[#FFAD43] transition-colors">
          {titulo}
        </h3>
        <div className="flex items-center gap-2 text-sm text-[#0D1F2D]/60">
          <MapPin className="w-4 h-4 text-[#FFAD43]" />
          <span>{cidade}</span>
        </div>
        {preco && (
          <div className="pt-2">
            <p className="inline-block px-4 py-1 rounded-full bg-[#FFAD43]/10 text-[#0D1F2D] font-semibold text-sm">
              {preco}
            </p>
          </div>
        )}
      </div>
    </Link>
  )
}
