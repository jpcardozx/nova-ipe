"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin } from "lucide-react"

interface ImovelCardProps {
  titulo: string
  slug: string
  cidade?: string
  categoria?: string
  preco?: number
  imagem?: string
}

export default function ImovelCard({
  titulo,
  slug,
  cidade,
  categoria,
  preco,
  imagem
}: ImovelCardProps) {
  return (
    <Link
      href={`/imovel/${slug}`}
      className="group relative flex flex-col rounded-3xl overflow-hidden bg-[#fafafa] shadow-md hover:shadow-2xl border border-[#FFAD43]/10 transition-all duration-300"
      aria-label={`Acessar o imóvel ${titulo}`}
    >
      <div className="relative h-64 w-full overflow-hidden">
        {imagem ? (
          <Image
            src={imagem}
            alt={`Imagem principal do imóvel: ${titulo}`}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">
            Sem imagem
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

        {categoria && (
          <span className="absolute top-3 left-3 text-[10px] bg-[#FFAD43] text-[#0D1F2D] px-3 py-1 rounded-full font-semibold uppercase shadow-sm">
            {categoria}
          </span>
        )}

        <span className="absolute bottom-3 right-3 text-[10px] bg-[#0D1F2D]/90 text-white px-3 py-1 rounded-full uppercase tracking-wide shadow-md">
          Curadoria Ipê
        </span>
      </div>

      <div className="p-5 space-y-2 text-[#0D1F2D]">
        <h3 className="text-[clamp(1.05rem,1.8vw,1.25rem)] font-medium leading-snug group-hover:text-[#FFAD43] transition-colors">
          {titulo}
        </h3>

        {cidade && (
          <div className="flex items-center gap-2 text-sm text-[#0D1F2D]/60">
            <MapPin className="w-4 h-4 text-[#FFAD43]" />
            <span>{cidade}</span>
          </div>
        )}

        <div className="pt-2">
          {typeof preco == 'number' ? (
            <p
              className="inline-block bg-[#FFAD43]/10 text-[#0D1F2D] font-semibold text-sm px-4 py-1 rounded-full"
              aria-label={`Preço do imóvel: R$ ${preco.toLocaleString("pt-BR")}`}
            >
              R$ {preco.toLocaleString("pt-BR")}
            </p>
          ) : (
            <p className="inline-block bg-[#FFAD43]/10 text-[#0D1F2D]/70 italic text-sm px-4 py-1 rounded-full">
              Sob consulta
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
