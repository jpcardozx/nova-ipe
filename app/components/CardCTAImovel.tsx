"use client";

import { Phone, Calendar, UserCheck } from "lucide-react";
import { formatarMoeda, cn } from "@/lib/utils";
import Link from "next/link";
import { FC, useMemo } from "react";

interface CardCTAImovelProps {
  preco?: number;
  titulo?: string;
  tipoCTA?: "whatsapp" | "agendar";
  destaque?: boolean;
  linkPersonalizado?: string;
}

const CardCTAImovel: FC<CardCTAImovelProps> = ({
  preco,
  titulo,
  tipoCTA = "whatsapp",
  destaque = true,
  linkPersonalizado,
}) => {
  // Texto e ícone dinâmico
  const labelCTA = tipoCTA === "agendar" ? "Agendar visita guiada" : "Falar com especialista local";
  const iconCTA = tipoCTA === "agendar" ? <Calendar className="w-5 h-5" /> : <Phone className="w-5 h-5" />;

  // Formata preço apenas uma vez
  const precoFormatado = useMemo(() => {
    if (preco == null) return null;
    // Usa opções padrão para moeda brasileira
    return formatarMoeda(preco);
  }, [preco]);

  // URL do CTA
  const safeTitle = encodeURIComponent(titulo ?? "");
  const defaultLink = useMemo(
    () =>
      `https://wa.me/5511981845016?text=Olá! Tenho interesse no imóvel: ${safeTitle} (via site)`,
    [safeTitle]
  );
  const ctaUrl = linkPersonalizado?.trim() || defaultLink;

  return (
    <aside className="relative bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl ring-1 ring-stone-200 p-8 border-t-4 border-amber-500 space-y-6 text-stone-900">
      {/* Badge Em Destaque */}
      {destaque && (
        <div className="absolute top-4 right-4 bg-amber-500/20 text-amber-600 px-3 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wide">
          Em destaque
        </div>
      )}

      {/* Preço */}
      <div className="space-y-1">
        <p className="text-sm text-stone-500">Valor de referência</p>
        {precoFormatado ? (
          <p className="text-4xl font-bold tracking-tight leading-none">
            {precoFormatado}
          </p>
        ) : (
          <p className="italic text-base text-stone-400">Sob consulta</p>
        )}
      </div>

      {/* CTA Button */}
      <Link
        href={ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "group flex items-center justify-center gap-2 w-full",
          "bg-amber-600 text-white px-6 py-3 rounded-full font-medium",
          "hover:scale-105 transition-transform shadow-md hover:shadow-lg",
          "focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        )}
        aria-label={labelCTA}
      >
        {iconCTA}
        <span>{labelCTA}</span>
      </Link>

      {/* Verificação */}
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <UserCheck className="w-4 h-4 text-amber-500" />
        <span>Imóvel verificado pela Ipê</span>
      </div>

      {/* Nota adicional */}
      <p className="text-xs italic text-stone-400 border-t border-stone-200 pt-3">
        Atendimento rápido. Indicamos também imóveis similares conforme seu perfil.
      </p>
    </aside>
  );
};

export default CardCTAImovel;
