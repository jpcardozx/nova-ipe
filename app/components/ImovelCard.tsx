"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, ArrowUpRight, Star, Coins, Ruler } from "lucide-react"
import { formatarMoeda, formatarArea } from "@/src/lib/utils"
import type { ImovelExtended } from "@/src/types/imovel-extended"
import { cn } from "@/src/lib/utils"

interface Props {
  imovel: ImovelExtended
  finalidade: "Venda" | "Aluguel" | "Temporada"
}

export default function ImovelCard({ imovel, finalidade }: Props): React.ReactElement {
  const [hover, setHover] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // Garante slug e alt não undefined
  const slug = imovel.slug?.current ?? ""
  const titulo = imovel.titulo ?? "Imóvel"
  const imgUrl = imovel.imagem?.asset?.url ?? "/images/placeholder.png"
  const altText = titulo

  const precoParts = imovel.preco
    ? formatarMoeda(imovel.preco, false, true).split(",")
    : null

  const badges = {
    Venda: { text: "VENDA", color: "bg-emerald-500" },
    Aluguel: { text: "ALUGUEL", color: "bg-amber-500" },
    Temporada: { text: "TEMPORADA", color: "bg-indigo-500" },
  } as const

  return (
    <Link
      href={`/imovel/${slug}`}
      className="block rounded-xl overflow-hidden shadow-lg transition-shadow hover:shadow-xl"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={`Ver detalhes de ${titulo}`}
    >
      {/* Imagem */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={imgUrl}
          alt={altText}
          loading="lazy"
          fill
          className={cn(
            "object-cover transition-transform duration-700 ease-out",
            hover ? "scale-110 blur-sm" : "scale-100",
            loaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setLoaded(true)}
        />
        {/* Gradientes e efeito */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-black/60 via-black/20 to-transparent",
            hover ? "opacity-70" : "opacity-50",
            "transition-opacity duration-300"
          )}
        />
        {/* Categoria + destaque */}
        {imovel.categoria?.titulo && (
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between bg-black/75 px-4 py-1 text-xs text-white">
            <span className="uppercase">{imovel.categoria.titulo}</span>
            {imovel.destaque && <Star className="w-4 h-4 text-yellow-400" />}
          </div>
        )}
        {/* Badge de finalidade */}
        <div
          className={cn(
            "absolute bottom-4 left-4 px-3 py-1 text-xs font-semibold text-white rounded-full shadow-md",
            badges[finalidade].color
          )}
        >
          {badges[finalidade].text}
        </div>
        {/* CTA */}
        <div
          className={cn(
            "absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-white px-3 py-2 text-xs font-medium text-black transition-all",
            hover ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}
        >
          VER DETALHES
          <ArrowUpRight className="w-3 h-3" />
        </div>
      </div>
      {/* Conteúdo */}
      <div className="bg-white p-5">
        <h3 className="text-lg font-bold mb-2">{titulo}</h3>
        <div className="flex items-center text-sm text-neutral-600 mb-3">
          <MapPin className="mr-1 text-amber-500" />
          {imovel.bairro
            ? `${imovel.bairro}, ${imovel.cidade}`
            : imovel.cidade}
        </div>
        <div className="flex items-center gap-6 text-sm text-neutral-700 mb-3">
          {imovel.metros != null && (
            <div className="flex items-center gap-1">
              <Ruler className="text-amber-500" />
              {formatarArea(Number(imovel.metros))}
            </div>
          )}
          {imovel.aceitaFinanciamento && (
            <div className="flex items-center gap-1">
              <Coins className="text-amber-500" />
              Financia
            </div>
          )}
        </div>
        <div className="text-2xl font-bold text-neutral-900">
          {precoParts ? (
            <>
              <span className="align-top text-sm mr-1">R$</span>
              {precoParts[0]}
              <span className="text-sm">,{precoParts[1]}</span>
            </>
          ) : (
            <span className="italic text-neutral-400">Sob consulta</span>
          )}
        </div>
      </div>
    </Link>
  )
}
