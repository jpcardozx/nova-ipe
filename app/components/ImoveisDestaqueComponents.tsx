'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BedDouble, Bath, Car, Ruler, MapPin } from 'lucide-react'
import { formatarMoeda, formatarImovelInfo } from '@/lib/utils'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import type { Imovel } from '@/types/sanity-schema';
import ImoveisDestaqueContext from './ImoveisDestaqueContext'

/**
 * Componente do imóvel em destaque (Hero)
 */
export function ImovelHero({
    finalidade = 'Venda',
    imovel
}: {
    finalidade?: string;
    imovel: Imovel;
}) {
    // Se não houver imóvel, não renderiza nada
    if (!imovel) return null

    // Formata dados do imóvel para exibição
    const imovelFormatado = formatarImovelInfo(imovel)

    // Cores para a finalidade (verde para venda)
    const cores = finalidade === 'Venda'
        ? {
            bg: 'bg-emerald-600',
            light: 'bg-emerald-50',
            text: 'text-emerald-700',
            hover: 'hover:bg-emerald-700',
            border: 'border-emerald-200'
        }
        : {
            bg: 'bg-blue-600',
            light: 'bg-blue-50',
            text: 'text-blue-700',
            hover: 'hover:bg-blue-700',
            border: 'border-blue-200'
        }

    return (
        <div className="overflow-hidden bg-white rounded-2xl shadow-md border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Imagem do imóvel */}
                <div className="relative h-64 md:h-80 lg:h-full overflow-hidden">
                    <Image
                        src={imovelFormatado.imagemUrl}
                        alt={imovelFormatado.imagemAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 500px"
                        priority
                        className="object-cover transition-all duration-500 hover:scale-105"
                    />

                    {/* Tag de finalidade */}
                    <div className={`absolute top-4 left-4 ${cores.bg} text-white px-3 py-1 rounded-md text-sm font-medium`}>
                        {imovelFormatado.finalidade}
                    </div>

                    {/* Tag de destaque se aplicável */}
                    {imovelFormatado.destaque && (
                        <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-md text-sm font-medium">
                            Destaque
                        </div>
                    )}
                </div>

                {/* Informações do imóvel */}
                <div className="p-6 md:p-8 flex flex-col">
                    <div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                            {imovelFormatado.titulo}
                        </h3>                        <div className="flex items-center text-gray-600 mb-4">
                            <MapPin className="mr-1 flex-shrink-0" />
                            <span className="truncate">{imovelFormatado.endereco}</span>
                        </div>

                        {/* Preço */}
                        <div className="mb-6">
                            <p className="text-sm text-gray-500 mb-1">Preço</p>
                            <p className={`text-2xl font-bold ${cores.text}`}>
                                {formatarMoeda(imovelFormatado.preco)}
                            </p>
                        </div>

                        {/* Características */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                            {imovelFormatado.caracteristicas.dormitorios !== undefined && (
                                <div className={`flex items-center ${cores.light} p-3 rounded-lg`}>
                                    <BedDouble className={`${cores.text} mr-2`} />
                                    <div>
                                        <p className="text-xs text-gray-500">Dormitórios</p>
                                        <p className="font-medium">{imovelFormatado.caracteristicas.dormitorios}</p>
                                    </div>
                                </div>
                            )}

                            {imovelFormatado.caracteristicas.banheiros !== undefined && (
                                <div className={`flex items-center ${cores.light} p-3 rounded-lg`}>
                                    <Bath className={`${cores.text} mr-2`} />
                                    <div>
                                        <p className="text-xs text-gray-500">Banheiros</p>
                                        <p className="font-medium">{imovelFormatado.caracteristicas.banheiros}</p>
                                    </div>
                                </div>
                            )}

                            {imovelFormatado.caracteristicas.vagas !== undefined && (
                                <div className={`flex items-center ${cores.light} p-3 rounded-lg`}>
                                    <Car className={`${cores.text} mr-2`} />
                                    <div>
                                        <p className="text-xs text-gray-500">Vagas</p>
                                        <p className="font-medium">{imovelFormatado.caracteristicas.vagas}</p>
                                    </div>
                                </div>
                            )}

                            {imovelFormatado.caracteristicas.areaUtil !== undefined && (
                                <div className={`flex items-center ${cores.light} p-3 rounded-lg`}>
                                    <Ruler className={`${cores.text} mr-2`} />
                                    <div>
                                        <p className="text-xs text-gray-500">Área</p>
                                        <p className="font-medium">{imovelFormatado.caracteristicas.areaUtil}m²</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Descrição breve */}
                        {imovelFormatado.descricao && (
                            <div className="mb-6">
                                <p className="text-gray-700 line-clamp-3">{imovelFormatado.descricao}</p>
                            </div>
                        )}
                    </div>

                    {/* Botão de ver detalhes */}
                    <div className="mt-auto">
                        <Link
                            href={`/imovel/${imovelFormatado.slug}`}
                            className={`block w-full text-center ${cores.bg} text-white ${cores.hover} font-medium py-3 rounded-lg transition-colors`}
                        >
                            Ver detalhes
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * Card para o carousel
 */
export function CarouselCard({
    imovel,
    isActive,
    onClick,
    finalidade = 'Venda'
}: {
    imovel: Imovel;
    isActive: boolean;
    onClick: () => void;
    finalidade?: string;
}) {
    // Formata dados do imóvel
    const imovelFormatado = formatarImovelInfo(imovel)

    // Cores baseadas na finalidade
    const cores = finalidade === 'Venda'
        ? {
            bg: 'bg-emerald-600',
            light: 'bg-emerald-50',
            text: 'text-emerald-700',
            border: 'border-emerald-200'
        }
        : {
            bg: 'bg-blue-600',
            light: 'bg-blue-50',
            text: 'text-blue-700',
            border: 'border-blue-200'
        }

    return (
        <div
            className={`
        relative overflow-hidden bg-white rounded-xl shadow-sm border transition cursor-pointer
        ${isActive ? `${cores.border} shadow-md scale-[1.02]` : 'border-gray-100'}
      `}
            onClick={onClick}
        >
            {/* Imagem */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                    src={imovelFormatado.imagemUrl}
                    alt={imovelFormatado.imagemAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                />

                {/* Tag de finalidade */}
                <div className={`absolute top-3 left-3 ${cores.bg} text-white px-2 py-1 rounded text-xs font-medium`}>
                    {imovelFormatado.finalidade}
                </div>
            </div>

            {/* Informações */}
            <div className="p-4">
                <h4 className="font-medium text-gray-900 mb-1 truncate">{imovelFormatado.titulo}</h4>
                <p className="text-sm text-gray-500 mb-2 truncate">{imovelFormatado.endereco}</p>

                {/* Preço */}
                <p className={`${cores.text} font-bold text-lg`}>
                    {formatarMoeda(imovelFormatado.preco)}
                </p>

                {/* Características resumidas */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-sm text-gray-600">
                    {imovelFormatado.caracteristicas.dormitorios !== undefined && (
                        <div className="flex items-center">
                            <BedDouble className="mr-1" />
                            <span>{imovelFormatado.caracteristicas.dormitorios} dorm</span>
                        </div>
                    )}

                    {imovelFormatado.caracteristicas.banheiros !== undefined && (
                        <div className="flex items-center">
                            <Bath className="mr-1" />
                            <span>{imovelFormatado.caracteristicas.banheiros} banh</span>
                        </div>
                    )}

                    {imovelFormatado.caracteristicas.vagas !== undefined && (
                        <div className="flex items-center">
                            <Car className="mr-1" />
                            <span>{imovelFormatado.caracteristicas.vagas} vaga{imovelFormatado.caracteristicas.vagas !== 1 ? 's' : ''}</span>
                        </div>
                    )}

                    {imovelFormatado.caracteristicas.areaUtil !== undefined && (
                        <div className="flex items-center">
                            <Ruler className="mr-1" />
                            <span>{imovelFormatado.caracteristicas.areaUtil}m²</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

/**
 * Estado de carregamento
 */
export function LoadingState() {
    return (
        <div className="py-16 text-center">
            <div className="inline-block animate-spin text-emerald-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">Carregando imóveis</h2>
            <p className="text-gray-600">Buscando as melhores opções para você...</p>
        </div>
    )
}

/**
 * Estado de erro
 */
export function ErrorState({ onClick }: { onClick?: () => void }) {
    return (
        <div className="py-16 text-center">
            <div className="inline-block text-red-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">Não foi possível carregar os imóveis</h2>
            <p className="text-gray-600 mb-6">Ocorreu um erro ao buscar os dados. Por favor, tente novamente.</p>
            <button
                onClick={onClick}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
                Tentar novamente
            </button>
        </div>
    )
}

/**
 * Estado vazio (sem imóveis)
 */
export function EmptyState() {
    return (
        <div className="py-16 text-center">
            <div className="inline-block text-emerald-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">Nenhum imóvel disponível</h2>
            <p className="text-gray-600 mb-6">No momento não temos imóveis cadastrados para esta categoria.</p>
            <Link
                href="/contato"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
                Fale conosco
            </Link>
        </div>
    )
}

export { ImoveisDestaqueContext }; // Exporting the context
