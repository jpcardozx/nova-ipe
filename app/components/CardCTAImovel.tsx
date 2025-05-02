"use client"

import { Phone, Calendar, UserCheck } from "lucide-react"
import { formatarMoeda, cn } from "@/lib/utils"

interface CardCTAImovelProps {
  preco?: number
  titulo?: string
  tipoCTA?: "whatsapp" | "agendar"
  destaque?: boolean
  linkPersonalizado?: string
  finalidade?: "Venda" | "Aluguel" | "Temporada"
  full?: boolean
  onAgendar?: () => void
}

export default function CardCTAImovel({
  preco,
  titulo,
  tipoCTA = "whatsapp",
  destaque = true,
  linkPersonalizado
}: CardCTAImovelProps) {
  const labelCTA =
    tipoCTA === "agendar" ? "Agendar visita guiada" : "Falar com especialista local"

  const iconCTA =
    tipoCTA === "agendar" ? <Calendar className="w-4 h-4" /> : <Phone className="w-4 h-4" />

  const precoFormatado = preco !== undefined ? formatarMoeda(preco, true, true) : null

  const safeTitle = encodeURIComponent(titulo ?? "")
  const defaultLink = `https://wa.me/5511981845016?text=Olá! Tenho interesse no imóvel: ${safeTitle} (via site)`
  const ctaUrl = linkPersonalizado?.trim() || defaultLink

  return (
    <aside className="relative bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl ring-1 ring-[#0D1F2D]/5 p-8 border-t-4 border-[#FFAD43] space-y-6 text-[#0D1F2D]">
      {destaque && (
        <div className="absolute top-4 right-4 bg-[#FFAD43]/20 text-[#FFAD43] px-3 py-[6px] text-[10px] font-semibold rounded-full uppercase tracking-wider shadow-sm">
          Em destaque
        </div>
      )}

      <div className="space-y-1">
        <p className="text-sm text-[#0D1F2D]/60">Valor de referência</p>
        {precoFormatado ? (
          <p className="text-4xl font-bold tracking-tight leading-snug">
            {precoFormatado}
          </p>
        ) : (
          <p className="italic text-base text-[#0D1F2D]/50">Sob consulta</p>
        )}
      </div>

      <a
        href={ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center justify-center gap-2 w-full bg-gradient-to-br from-[#0D1F2D] to-[#1A2C3C] hover:scale-[1.03] transition-transform duration-200 text-white px-6 py-3 rounded-full text-sm font-medium shadow-md hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FFAD43]"
        aria-label={labelCTA}
      >
        {iconCTA}
        <span className="tracking-wide">{labelCTA}</span>
      </a>

      <div className="mt-4 flex items-center gap-2 text-xs text-[#0D1F2D]/60">
        <UserCheck className="w-4 h-4" />
        <span>Imóvel verificado pela Ipê</span>
      </div>

      <p className="text-xs leading-snug text-[#0D1F2D]/50 italic mt-4 border-t pt-3 border-dashed border-[#0D1F2D]/10">
        Atendimento rápido. <br />Indicamos também imóveis com perfil semelhante.
      </p>
    </aside>
  )
}
