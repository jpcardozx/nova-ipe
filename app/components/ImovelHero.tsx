"use client";

import React, { FC, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn, formatarMoeda, formatarArea, formatarImovelInfo } from '@/lib/utils';
import { MapPin, BedDouble, Bath, Car } from 'lucide-react';

// Badge component from PropertyCardUnified
const Badge = ({
    variant = 'primary',
    size = 'md',
    children,
    className,
}: {
    variant?: 'primary' | 'secondary' | 'highlight' | 'new' | 'premium';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    className?: string;
}) => {
    const variantStyles = {
        primary: 'bg-blue-500 text-white',
        secondary: 'bg-emerald-500 text-white',
        highlight: 'bg-amber-500 text-white',
        new: 'bg-teal-500 text-white',
        premium: 'bg-purple-500 text-white',
    };

    const sizeStyles = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
    };

    return (
        <span
            className={cn(
                'rounded-md font-medium flex items-center gap-1.5 shadow-sm',
                variantStyles[variant],
                sizeStyles[size],
                className
            )}
        >
            {children}
        </span>
    );
};

// Feature component from PropertyCardUnified
const Feature = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number | undefined;
}) => {
    if (!value) return null;

    return (
        <div className="flex items-center gap-2 group">
            <div className="p-1.5 bg-stone-100 rounded-md text-stone-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                {icon}
            </div>
            <div>
                <p className="text-xs text-stone-500 group-hover:text-stone-700 transition-colors">{label}</p>
                <p className="text-sm font-medium text-stone-700">{value}</p>
            </div>
        </div>
    );
};

// Simple context hook implementation
const useImoveisDestaque = () => {
    return {
        state: {
            imoveis: [],
            activeImovel: null
        },
        setActiveImovel: (id: any) => { }
    };
};

// Tipo normalizado a partir do utilitário
type NormalizedImovel = ReturnType<typeof formatarImovelInfo>;

interface ImovelHeroProps {
    finalidade?: string;
}

export const ImovelHero: FC<ImovelHeroProps> = ({ finalidade = 'Venda' }) => {
    const { state, setActiveImovel } = useImoveisDestaque();

    // Normaliza e filtra imóveis
    const imoveis = useMemo<NormalizedImovel[]>(
        () => state.imoveis
            .map(formatarImovelInfo)
            .filter(im => !finalidade || im.finalidade === finalidade),
        [state.imoveis, finalidade]
    );

    // Índice ativo
    const activeIndex = useMemo(
        () => {
            const idx = imoveis.findIndex(im => im.id === state.activeImovel);
            return idx >= 0 ? idx : 0;
        },
        [imoveis, state.activeImovel]
    );

    const imovel = imoveis[activeIndex];
    if (!imovel) return null;

    const {
        slug,
        imagemUrl,
        imagemAlt,
        endereco,
        titulo,
        preco,
        destaque,
        caracteristicas,
        descricao,
    } = imovel;

    const precoFormatado = preco != null ? formatarMoeda(preco) : 'Sob consulta';

    return (
        <div className="relative bg-white rounded-xl overflow-hidden border border-stone-200 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Imagem */}
                <div className="relative h-64 md:h-auto w-full">
                    {imagemUrl ? (
                        <Image
                            src={imagemUrl}
                            alt={imagemAlt || titulo || 'Imóvel'}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="h-full w-full bg-gray-100" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex space-x-2">
                        <Badge variant="secondary" size="md">{finalidade}</Badge>
                        {destaque && <Badge variant="primary" size="md">Destaque</Badge>}
                    </div>
                </div>

                {/* Informações */}
                <div className="p-6 md:p-8 flex flex-col">
                    <div className="mb-4">
                        <div className="flex items-center text-stone-500 mb-1">
                            <MapPin className="w-5 h-5 mr-2" />
                            <span>{endereco || 'Endereço não informado'}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-stone-900 mb-2 truncate">
                            {titulo}
                        </h3>
                        <div className="text-3xl font-bold text-amber-600">
                            {precoFormatado}
                        </div>
                    </div>

                    {/* Características */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {caracteristicas.dormitorios != null && (
                            <Feature icon={<BedDouble />} label="Dorms" value={caracteristicas.dormitorios} />
                        )}
                        {caracteristicas.banheiros != null && (
                            <Feature icon={<Bath />} label="Banhos" value={caracteristicas.banheiros} />
                        )}
                        {caracteristicas.areaUtil != null && (
                            <Feature icon={<Car />} label="Área (m²)" value={formatarArea(caracteristicas.areaUtil)} />
                        )}
                        {caracteristicas.vagas != null && (
                            <Feature icon={<Car />} label="Vagas" value={caracteristicas.vagas} />
                        )}
                    </div>

                    {/* Descrição */}
                    {descricao && (
                        <p className="text-stone-700 line-clamp-3 mb-6">{descricao}</p>
                    )}

                    {/* Botão Detalhes */}
                    <Link
                        href={`/imovel/${slug}`}
                        className="mt-auto block w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-center font-medium transition"
                    >
                        Ver detalhes completos
                    </Link>
                </div>
            </div>

            {/* Paginação */}
            {imoveis.length > 1 && (
                <div className="absolute bottom-4 right-4 flex space-x-2">
                    {imoveis.map((_, idx) => (
                        <button
                            key={idx}
                            className={cn(
                                'w-3 h-3 rounded-full transition',
                                idx === activeIndex
                                    ? 'bg-emerald-600'
                                    : 'bg-stone-300 hover:bg-stone-400'
                            )}
                            onClick={() => setActiveImovel(imoveis[idx].id)}
                            aria-label={`Mostrar ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
