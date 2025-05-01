"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, ArrowRight, Sparkles, Home, Scale } from "lucide-react"
import { formatarMoeda, formatarArea } from "@/src/lib/utils"
import type { ImovelExtended } from "@/src/types/imovel-extended"
import { cn } from "@/src/lib/utils"

interface Props {
  imovel: ImovelExtended
  finalidade: "Venda" | "Aluguel" | "Temporada"
  priority?: boolean
}

export default function ImovelCard({
  imovel,
  finalidade,
  priority = false
}: Props): React.ReactElement {
  const [hover, setHover] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Preparar dados relevantes
  const {
    slug,
    titulo,
    imgUrl,
    altText,
    displayPrice,
    location,
    metragem,
    tipoImovel
  } = useMemo(() => {
    const slug = imovel.slug?.current ?? ""
    const titulo = imovel.titulo ?? "Imóvel"
    const imgUrl = imovel.imagem?.asset?.url ?? "/images/placeholder.png"
    const altText = titulo

    // Formatar preço de forma otimizada
    let displayPrice = { full: "", integer: "", decimal: "" }
    if (imovel.preco) {
      const formatted = formatarMoeda(imovel.preco, false, true)
      const [integer, decimal = "00"] = formatted.split(",")
      displayPrice = {
        full: formatted,
        integer,
        decimal
      }
    }

    // Localização formatada
    const location = imovel.bairro
      ? `${imovel.bairro}, ${imovel.cidade}`
      : imovel.cidade

    // Metragem formatada
    const metragem = imovel.areaUtil != null
      ? formatarArea(Number(imovel.areaUtil))
      : null

    // Tipo do imóvel
    const tipoImovel = imovel.categoria?.titulo || ""

    return {
      slug,
      titulo,
      imgUrl,
      altText,
      displayPrice,
      location,
      metragem,
      tipoImovel
    }
  }, [imovel])

  // Determinando cores baseadas na finalidade
  const statusColors = {
    Venda: "from-emerald-500/90 to-emerald-700/90 text-emerald-50 border-emerald-400",
    Aluguel: "from-blue-500/90 to-blue-700/90 text-blue-50 border-blue-400",
    Temporada: "from-violet-500/90 to-violet-700/90 text-violet-50 border-violet-400"
  }[finalidade]

  // Detectar visibilidade para lazy loading
  useEffect(() => {
    if (!cardRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Adicionar classe para animar entrada
            entry.target.classList.add('appear')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(cardRef.current)

    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current)
    }
  }, [])

  return (
    <div
      ref={cardRef}
      className={cn(
        // Base
        "group opacity-0 translate-y-4",
        "transition-all duration-700 ease-out",
        "appear:opacity-100 appear:translate-y-0",
        // Layout
        "h-full flex flex-col rounded-xl overflow-hidden",
        // Sombra e elevação
        "bg-white shadow-sm hover:shadow-xl",
        "hover:-translate-y-1 transition-all duration-500"
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Container de imagem com proporção moderna */}
      <div className="relative w-full aspect-[7/5] overflow-hidden">
        {/* Skeleton loader premium com gradiente */}
        {!loaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent)] animate-[pulse_3s_ease-in-out_infinite]" />
          </div>
        )}

        {/* Imagem principal */}
        <Image
          src={imgUrl}
          alt={altText}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          quality={92}
          className={cn(
            "object-cover object-center",
            "transition-all duration-1000 ease-out",
            hover ? "scale-110 brightness-105" : "scale-100",
            loaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setLoaded(true)}
        />

        {/* Gradiente refinado */}
        <div
          className={cn(
            "absolute inset-0 opacity-40",
            "bg-gradient-to-t from-black via-transparent to-transparent",
            "transition-opacity duration-300",
            hover ? "opacity-30" : "opacity-40"
          )}
        />

        {/* Status tag (Venda/Aluguel/Temporada) */}
        <div className="absolute top-4 left-4 z-10">
          <div className={cn(
            "px-3 py-1.5 flex items-center gap-1.5",
            "bg-gradient-to-r",
            statusColors,
            "text-xs font-medium tracking-wide",
            "backdrop-blur-md rounded-md",
            "border-l-2",
            "shadow-lg",
            "transition-transform duration-300",
            hover ? "translate-y-0" : "translate-y-0"
          )}>
            {finalidade === "Venda" && <Home className="w-3.5 h-3.5" />}
            {finalidade === "Aluguel" && <Scale className="w-3.5 h-3.5" />}
            {finalidade === "Temporada" && <Sparkles className="w-3.5 h-3.5" />}
            <span className="uppercase">{finalidade}</span>
          </div>
        </div>

        {/* Destaque premium */}
        {imovel.destaque && (
          <div className="absolute top-4 right-4 z-10">
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1.5",
              "bg-gradient-to-r from-amber-500/90 to-amber-600/90",
              "backdrop-blur-md rounded-md",
              "text-xs font-medium text-amber-50",
              "border-r-2 border-amber-400",
              "shadow-lg"
            )}>
              <Sparkles className="w-3.5 h-3.5" />
              <span className="uppercase tracking-wide">Destaque</span>
            </div>
          </div>
        )}

        {/* Tipo de imóvel */}
        {tipoImovel && (
          <div className="absolute bottom-4 left-4 z-10">
            <div className={cn(
              "px-3 py-1.5",
              "bg-black/40 backdrop-blur-sm",
              "text-xs text-white font-medium",
              "rounded-md"
            )}>
              {tipoImovel}
            </div>
          </div>
        )}
      </div>

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-grow p-5 space-y-4">
        {/* Título */}
        <h3 className={cn(
          "text-lg font-medium leading-tight text-gray-900",
          "line-clamp-2 min-h-[3rem]"
        )}>
          {titulo}
        </h3>

        {/* Localização */}
        <div className="flex items-center space-x-1.5 text-sm text-gray-600">
          <MapPin className="flex-shrink-0 w-4 h-4 text-gray-400" />
          <span className="truncate">{location}</span>
        </div>

        {/* Características */}
        <div className="flex items-center gap-3">
          {metragem && (
            <div className="flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
              <span>{metragem}</span>
            </div>
          )}

          {imovel.aceitaFinanciamento && (
            <div className="flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
              <span>Financia</span>
            </div>
          )}
        </div>

        {/* Divisor */}
        <div className="flex-grow" />

        {/* Preço e CTA */}
        <div className="flex items-center justify-between pt-2">
          {/* Preço */}
          <div>
            {displayPrice.full ? (
              <div className="flex items-baseline">
                <span className="text-sm font-light text-gray-500 mr-1">R$</span>
                <span className="text-2xl font-semibold text-gray-900">{displayPrice.integer}</span>
                <span className="text-sm text-gray-500">,{displayPrice.decimal}</span>
              </div>
            ) : (
              <span className="text-lg text-gray-500 italic">Sob consulta</span>
            )}
          </div>

          {/* Botão de detalhes */}
          <Link
            href={`/imovel/${slug}`}
            className={cn(
              "flex items-center space-x-1",
              "px-4 py-2.5 rounded-full",
              "bg-gray-900 text-white",
              "text-sm font-medium",
              "transition-all duration-300",
              "overflow-hidden",
              "shadow-sm hover:shadow-md",
              "outline-none focus:ring-2 focus:ring-gray-900/30",
              hover ? "w-[120px] bg-gray-800" : "w-[44px]"
            )}
            aria-label={`Ver detalhes de ${titulo}`}
          >
            <span className={cn(
              "whitespace-nowrap",
              "transition-opacity duration-300",
              hover ? "opacity-100" : "opacity-0"
            )}>
              Detalhes
            </span>
            <ArrowRight className={cn(
              "flex-shrink-0 w-5 h-5",
              "transition-transform duration-500",
              hover ? "translate-x-0" : "-translate-x-0.5"
            )} />
          </Link>
        </div>
      </div>
    </div>
  )
}