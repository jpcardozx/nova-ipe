'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useImoveisDestaque } from '@components/ImoveisDestaqueContext'
import { formatarMoeda } from '@/lib/utils'

interface ImovelHeroProps {
    finalidade?: string;
}

export function ImovelHero({ finalidade = 'Venda' }: ImovelHeroProps) {
    const { state, setActiveImovel } = useImoveisDestaque()

    // Filtrar por finalidade se necessário
    const imoveisFiltrados = finalidade
        ? state.imoveis.filter(imovel => imovel.finalidade === finalidade)
        : state.imoveis

    // Pegar o imóvel ativo, ou o primeiro da lista
    const imovelAtivo = state.imoveis.find(i => i._id === state.activeImovelId) ||
        (imoveisFiltrados.length > 0 ? imoveisFiltrados[0] : null)

    // Se não há imóvel ativo, não renderiza
    if (!imovelAtivo) return null

    // Preparar dados para exibição
    const slug = typeof imovelAtivo.slug === 'string'
        ? imovelAtivo.slug
        : imovelAtivo.slug?.current

    const imagemUrl = imovelAtivo.imagem?.imagemUrl || '/placeholder.jpg'
    const titulo = imovelAtivo.titulo || `${imovelAtivo.categoria?.categoriaTitulo || 'Imóvel'} para ${finalidade}`
    const endereco = [imovelAtivo.bairro, imovelAtivo.cidade, imovelAtivo.estado].filter(Boolean).join(', ')
    const precoFormatado = imovelAtivo.preco ? formatarMoeda(imovelAtivo.preco) : 'Sob consulta'

    return (
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Imagem */}
                <div className="relative h-64 md:h-auto">
                    <Image
                        src={imagemUrl}
                        alt={imovelAtivo.imagem?.alt || titulo}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Badge */}
                    <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 rounded-full">
                            {finalidade}
                        </span>
                        {imovelAtivo.destaque && (
                            <span className="px-3 py-1.5 text-sm font-medium text-white bg-amber-500 rounded-full">
                                Destaque
                            </span>
                        )}
                    </div>
                </div>

                {/* Informações */}
                <div className="p-6 md:p-8 flex flex-col">
                    <div className="mb-4">
                        <div className="flex items-center text-gray-500 mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {endereco}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{titulo}</h3>
                        <div className="text-3xl font-bold text-gray-900">{precoFormatado}</div>
                    </div>

                    {/* Características */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {imovelAtivo.dormitorios > 0 && (
                            <div className="flex items-center">
                                <div className="p-3 bg-emerald-50 rounded-lg mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-7-10v10" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{imovelAtivo.dormitorios}</p>
                                    <p className="text-sm text-gray-500">
                                        {imovelAtivo.dormitorios === 1 ? 'Dormitório' : 'Dormitórios'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {imovelAtivo.banheiros > 0 && (
                            <div className="flex items-center">
                                <div className="p-3 bg-emerald-50 rounded-lg mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{imovelAtivo.banheiros}</p>
                                    <p className="text-sm text-gray-500">
                                        {imovelAtivo.banheiros === 1 ? 'Banheiro' : 'Banheiros'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {imovelAtivo.areaUtil > 0 && (
                            <div className="flex items-center">
                                <div className="p-3 bg-emerald-50 rounded-lg mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{imovelAtivo.areaUtil} m²</p>
                                    <p className="text-sm text-gray-500">Área</p>
                                </div>
                            </div>
                        )}

                        {imovelAtivo.vagas > 0 && (
                            <div className="flex items-center">
                                <div className="p-3 bg-emerald-50 rounded-lg mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 18h18M19 9l-7-7-7 7h14z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{imovelAtivo.vagas}</p>
                                    <p className="text-sm text-gray-500">
                                        {imovelAtivo.vagas === 1 ? 'Vaga' : 'Vagas'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Descrição (se houver) */}
                    {imovelAtivo.descricao && (
                        <div className="mb-5">
                            <p className="text-gray-600 line-clamp-3">{imovelAtivo.descricao}</p>
                        </div>
                    )}

                    {/* Botão de ação */}
                    <div className="mt-auto">
                        <Link
                            href={`/imovel/${slug}`}
                            className="block w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-center font-medium transition-colors"
                        >
                            Ver detalhes completos
                        </Link>
                    </div>
                </div>
            </div>

            {/* Navegação entre imóveis */}
            {imoveisFiltrados.length > 1 && (
                <div className="absolute bottom-4 right-4 flex gap-2">
                    {imoveisFiltrados.slice(0, 5).map((imovel) => (
                        <button
                            key={imovel._id}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${imovel._id === state.activeImovelId
                                ? 'bg-emerald-600'
                                : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                            onClick={() => setActiveImovel(imovel._id)}
                            aria-label={`Ver ${imovel.titulo || 'imóvel'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}