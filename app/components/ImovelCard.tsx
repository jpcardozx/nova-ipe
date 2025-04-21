"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, ArrowUpRight, Star, Coins, Ruler } from "lucide-react"
import { formatarMoeda, formatarArea } from "@/src/lib/utils"

export interface ImovelCardProps {
  slug: string
  titulo: string
  cidade: string
  bairro?: string
  finalidade?: 'Venda' | 'Aluguel' | 'Temporada'
  preco?: number
  imagem?: string
  destaque?: boolean
  categoria?: {
    titulo: string
    slug: string
  }
  metros?: string
  aceitaFinanciamento?: boolean
}

export default function ImovelCard({
  slug,
  titulo,
  cidade,
  bairro,
  finalidade,
  preco,
  imagem,
  destaque = false,
  categoria,
  metros,
  aceitaFinanciamento,
}: ImovelCardProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const precoFormatado = preco
    ? formatarMoeda(preco, false, true).split(',')
    : null

  const finalidadeBadge = {
    'Venda': { text: "VENDA", class: "bg-emerald-500" },
    'Aluguel': { text: "ALUGUEL", class: "bg-amber-500" },
    'Temporada': { text: "TEMPORADA", class: "bg-indigo-500" }
  }

  return (
    <div
      className="group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link
        href={`/imovel/${slug}`}
        className="relative block rounded-xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-xl"
        aria-label={`Ver detalhes do imóvel ${titulo}`}
      >
        {/* Imagem com overlay animado */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {imagem ? (
            <>
              <Image
                src={imagem}
                alt={`Imóvel: ${titulo}`}
                fill
                className={`object-cover object-center transition-all duration-700 ease-out ${isHovering ? 'scale-110 blur-sm' : 'scale-100'
                  } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                priority
              />

              <div className={`absolute inset-0 bg-gradient-to-br from-black/70 via-black/30 to-transparent opacity-80 transition-opacity duration-300 ${isHovering ? 'opacity-70' : 'opacity-40'}`} />

              <div className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent skew-x-12 transform transition-all duration-1000 ease-out ${isHovering ? 'translate-x-full' : '-translate-x-full'}`} />
            </>
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <span className="text-gray-400 font-light italic">Imagem em breve</span>
            </div>
          )}

          {categoria && (
            <div className="absolute top-0 left-0 right-0 py-1 px-4 bg-black/80 backdrop-blur-sm text-white text-xs flex justify-between items-center">
              <span className="uppercase tracking-wider font-medium">{categoria.titulo}</span>
              {destaque && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
            </div>
          )}

          {finalidade && (
            <div className={`absolute left-4 bottom-0 transform translate-y-1/2 ${finalidadeBadge[finalidade].class} text-white text-xs font-semibold tracking-wider py-2 px-3 rounded-full shadow-md`}>
              {finalidadeBadge[finalidade].text}
            </div>
          )}

          <div className={`absolute bottom-4 right-4 bg-white text-black text-xs font-medium py-2 px-3 rounded-full flex items-center transform transition-all duration-300 ${isHovering ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
            VER DETALHES
            <ArrowUpRight className="w-3 h-3 ml-1" />
          </div>
        </div>

        <div className="p-6 pt-5 bg-white">
          <h3 className="text-xl font-bold text-gray-900 pr-8 group-hover:text-black transition-colors duration-300 relative">
            {titulo}
            <span className={`absolute -bottom-2 left-0 h-1 bg-amber-400 transition-all duration-500 ${isHovering ? 'w-1/2' : 'w-10'}`} />
          </h3>

          <div className="flex items-center mt-4 text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2 text-amber-500" />
            <span className="truncate">{bairro ? `${bairro}, ${cidade}` : cidade}</span>
          </div>

          <div className="flex items-center gap-6 mt-4">
            {metros && (
              <div className="flex items-center text-sm text-gray-700">
                <Ruler className="w-4 h-4 mr-1 text-amber-500" />
                <span className="font-medium">{formatarArea(Number(metros))}</span>
              </div>
            )}

            {aceitaFinanciamento && (
              <div className="flex items-center text-sm text-gray-700">
                <Coins className="w-4 h-4 mr-1 text-amber-500" />
                <span className="font-medium">Financia</span>
              </div>
            )}
          </div>

          <div className="mt-5 flex justify-between items-end">
            {precoFormatado ? (
              <div className="flex items-baseline">
                <span className="text-gray-500 mr-1 text-sm">R$</span>
                <span className="text-2xl font-bold text-black">{precoFormatado[0]}</span>
                <span className="text-gray-500 text-sm">,{precoFormatado[1]}</span>
              </div>
            ) : (
              <span className="text-lg italic text-gray-500 font-light">Sob consulta</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
