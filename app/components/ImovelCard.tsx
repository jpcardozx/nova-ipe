"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin } from "lucide-react"

export interface ImovelCardProps {
  slug: string
  titulo: string
  cidade: string
  tipo: string
  preco?: number | string
  imagem: string
  destaque?: boolean
}

export default function ImovelCard({
  slug,
  titulo,
  cidade,
  tipo,
  preco,
  imagem,
  destaque = false,
}: ImovelCardProps) {
  // Se preco for number, formata; se for string, exibe direto
  const precoFormatado =
    typeof preco === "number"
      ? preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
      : preco

  return (
    <Link
      href={`/imovel/${slug}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-white shadow hover:shadow-lg transition"
      aria-label={`Ver detalhes do imóvel ${titulo}`}
    >
      <div className="relative h-56 w-full">
        <Image
          src={imagem}
          alt={`Foto do imóvel ${titulo}`}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {destaque && (
          <span className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-semibold uppercase px-2 py-1 rounded">
            Em destaque
          </span>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-yellow-500 transition">
            {titulo}
          </h3>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <MapPin className="w-4 h-4 mr-1 text-yellow-500" />
            <span>{cidade}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1 italic">{tipo}</p>
        </div>
        <div className="mt-4">
          {precoFormatado ? (
            <span className="inline-block bg-yellow-100 text-yellow-800 font-semibold px-3 py-1 rounded">
              {precoFormatado}
            </span>
          ) : (
            <span className="inline-block bg-gray-100 text-gray-500 italic px-3 py-1 rounded">
              Sob consulta
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
