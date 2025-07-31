"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, Loader2, AlertTriangle, Ghost, MapPin, Wallet } from "lucide-react";
import { formatarMoeda, formatarImovelInfo } from '@/lib/utils';
import type { ImovelClient as Imovel } from "../../src/types/imovel-client";

/**
 * Estado de carregamento
 */
export function LoadingState() {
  return (
    <div className="flex justify-center items-center py-16 text-stone-600">
      <Loader2 className="animate-spin w-6 h-6" />
      <span className="ml-3">Carregando imóveis em destaque...</span>
    </div>
  );
}

/**
 * Estado de erro
 */
export function ErrorState() {
  return (
    <div className="flex flex-col items-center text-center py-16 text-stone-500">
      <AlertTriangle className="w-6 h-6 mb-2" />
      <p>Houve um problema ao carregar os imóveis. Tente novamente mais tarde.</p>
    </div>
  );
}

/**
 * Estado vazio
 */
export function EmptyState() {
  return (
    <div className="flex flex-col items-center text-center py-16 text-stone-400">
      <Ghost className="w-8 h-8 mb-3" />
      <p>Nenhum imóvel disponível no momento.</p>
    </div>
  );
}

// Card de carousel
export function CarouselCard({
  imovel,
  isActive,
  onClick,
}: {
  imovel: Imovel;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      className={`rounded-xl border shadow hover:shadow-lg overflow-hidden transition-all duration-300 bg-white cursor-pointer ${isActive ? "ring-2 ring-amber-500" : ""
        }`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
    >
      <div className="relative aspect-[4/3] bg-stone-100">
        <img
          src={imovel.imagem?.imagemUrl || "/images/default-imovel.jpg"}
          alt={imovel.titulo || "Imóvel"}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-stone-800 font-bold text-lg line-clamp-1">{imovel.titulo}</h3>
        <p className="text-stone-500 text-sm flex items-center line-clamp-1">
          <MapPin size={14} className="mr-1" />
          {imovel.bairro}
        </p>
        <div className="flex justify-between items-end mt-2">
          <div>
            <p className="text-xs text-stone-400">Aluguel mensal</p>
            {typeof imovel.preco === "number" ? (
              <p className="text-amber-700 font-semibold text-base flex items-center">
                <Wallet size={14} className="mr-1" />
                R$ {imovel.preco.toLocaleString("pt-BR")}
              </p>
            ) : (
              <p className="text-stone-400 text-sm italic">Sob consulta</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Placeholder do imóvel principal em destaque
export function ImovelHero() {
  return (
    <motion.div
      className="rounded-xl overflow-hidden shadow-xl bg-white mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative aspect-[4/3]">
          <div className="absolute inset-0 bg-stone-200 animate-pulse" />
        </div>
        <div className="p-6">
          <p className="text-stone-400 uppercase text-sm mb-2 tracking-wide">Destaque</p>
          <h3 className="text-2xl font-bold text-stone-800 mb-2">Imóvel em destaque</h3>
          <p className="text-stone-600 mb-4">
            Este espaço será utilizado para destacar o imóvel principal da seção.
          </p>
          <div className="flex items-center text-amber-600 font-semibold">
            <Wallet size={16} className="mr-2" />
            R$ 3.200,00
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default CarouselCard;