"use client"

import { Phone, Calendar } from "lucide-react"

interface CardCTAImovelProps {
  preco?: string
  titulo?: string
  tipoCTA?: "whatsapp" | "agendar"
  destaque?: boolean
  linkPersonalizado?: string
}

export default function CardCTAImovel({
  preco,
  titulo,
  tipoCTA = "whatsapp",
  destaque = true,
  linkPersonalizado
}: CardCTAImovelProps) {
  const labelCTA = tipoCTA === "agendar" ? "Agendar visita" : "Falar com um especialista"
  const iconCTA = tipoCTA === "agendar" ? <Calendar className="w-4 h-4" /> : <Phone className="w-4 h-4" />
  const ctaUrl = linkPersonalizado || `https://wa.me/5511981845016?text=Olá! Tenho interesse no imóvel: ${encodeURIComponent(titulo ?? "")} (via site)`

  return (
    <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-[0_6px_30px_-10px_rgba(0,0,0,0.12)] p-8 border-t-4 border-[#FFAD43] space-y-6 h-fit ring-1 ring-black/5">
      {destaque && (
        <div className="absolute top-4 right-4 text-xs bg-[#FFAD43]/10 text-[#FFAD43] px-3 py-1 rounded-full uppercase tracking-wide font-semibold">
          Destaque
        </div>
      )}

      <div className="space-y-1">
        <p className="text-sm text-[#0D1F2D]/60">Investimento estimado</p>
        <p className="text-3xl font-bold text-[#0D1F2D]">{preco ?? "Valor sob consulta"}</p>
      </div>

      <a
        href={ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 text-white bg-[#20b858] hover:brightness-110 hover:shadow-lg px-6 py-3 rounded-full text-sm font-medium transition"
        aria-label="Contato via WhatsApp"
      >
        {iconCTA} {labelCTA}
      </a>

      <p className="text-xs text-[#0D1F2D]/50 italic mt-2 border-t pt-2 border-dashed border-[#0D1F2D]/10">
        ⏰ Atendimento em horário comercial. Sem compromisso.
      </p>
    </div>
  )
}
