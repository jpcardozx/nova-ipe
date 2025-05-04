"use client";

import React, { FC, useMemo } from 'react';
import { Phone, Calendar, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { formatarMoeda, cn } from '@/lib/utils';

interface CardCTAImovelProps {
    titulo?: string;
    finalidade?: 'Venda' | 'Aluguel' | 'Temporada';
    destaque?: boolean;
    full?: boolean;
    tipoCTA?: 'whatsapp' | 'agendar';
    linkPersonalizado?: string;
    onAgendar?: () => void;
    imovel: any; // Adicione o tipo correto do imóvel aqui, se necessário
    relacionados?: any[]; // Adicione o tipo correto para os imóveis relacionados, se necessário
    preco?: number; // Adicione o tipo correto para o preço, se necessário
}

const CardCTAImovel: FC<CardCTAImovelProps> = ({
    preco,
    titulo,
    finalidade = 'Venda',
    destaque = false,
    full = false,
    tipoCTA = 'whatsapp',
    linkPersonalizado,
    onAgendar,
}) => {
    // Texto e ícone do CTA
    const labelCTA = useMemo(
        () => (tipoCTA === 'agendar' ? 'Agendar visita' : 'Falar com especialista'),
        [tipoCTA]
    );
    const iconCTA = tipoCTA === 'agendar' ? (
        <Calendar className="w-5 h-5" />
    ) : (
        <Phone className="w-5 h-5" />
    );

    // Preço formatado
    const precoFormatado = preco != null ? formatarMoeda(preco) : 'Sob consulta';

    // URL para whatsapp
    const safeTitle = encodeURIComponent(titulo ?? '');
    const defaultLink = `https://wa.me/5511981845016?text=Olá! Tenho interesse no imóvel (${finalidade}): ${safeTitle}`;
    const ctaUrl = linkPersonalizado?.trim() || defaultLink;

    return (
        <aside
            className={cn(
                'relative bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl ring-1 ring-stone-200 p-8 space-y-6',
                destaque && 'border-t-4 border-amber-500',
                full && 'w-full'
            )}
        >
            {/* Badge de destaque */}
            {destaque && (
                <div className="absolute top-4 right-4 bg-amber-500/20 text-amber-600 px-3 py-0.5 text-xs font-semibold rounded-full">
                    Em destaque
                </div>
            )}

            {/* Valor */}
            <div className="space-y-1">
                <p className="text-sm text-stone-500">Valor de referência</p>
                <p className="text-3xl font-bold text-amber-600 tracking-tight">
                    {precoFormatado}
                </p>
            </div>

            {/* CTA Button */}
            <Link
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                    'flex items-center justify-center gap-2 w-full py-3 px-6 rounded-full text-white font-medium transition shadow-md',
                    tipoCTA === 'agendar'
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-[#0D1F2D] hover:bg-[#162B42]'
                )}
                aria-label={labelCTA}
                onClick={(e) => tipoCTA === 'agendar' && onAgendar && (e.preventDefault(), onAgendar())}
            >
                {iconCTA}
                <span>{labelCTA}</span>
            </Link>

            {/* Verificação */}
            <div className="flex items-center gap-2 text-xs text-stone-500">
                <UserCheck className="w-4 h-4 text-emerald-500" />
                <span>Imóvel verificado pela Ipê</span>
            </div>

            {/* Nota adicional */}
            <p className="text-xs italic text-stone-400 border-t border-stone-200 pt-3">
                Atendimento rápido. Indicamos imóveis similares conforme seu perfil.
            </p>
        </aside>
    );
};

export default CardCTAImovel;
