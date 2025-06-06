'use client'

import React, { memo } from 'react'

import { motion } from 'framer-motion'

/**
 * Componente de carregamento esqueleto (skeleton) para a seção de imóveis em destaque
 * Exibe uma versão esqueleto da UI enquanto os dados estão sendo carregados
 */
interface SkeletonLoaderProps {
    height?: string;
    width?: string;
    className?: string;
    variant?: 'simple' | 'property' | 'carousel';
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    height = '200px',
    width = '100%',
    className = '',
    variant = 'simple'
}) => {
    if (variant === 'simple') {
        return (
            <div
                className={`animate-pulse bg-neutral-200 rounded-md ${className}`}
                style={{ height, width }}
            />
        );
    }

    return (
        <div className="space-y-10 animate-pulse" style={{ height, width }}>
            {/* Esqueleto do imóvel principal */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-stone-100">
                <div className="flex flex-col lg:flex-row">
                    {/* Esqueleto da imagem */}
                    <div className="lg:w-1/2">
                        <div className="aspect-[4/3] bg-gradient-to-r from-stone-200 to-stone-100"></div>
                    </div>

                    {/* Esqueleto das informações */}
                    <div className="lg:w-1/2 p-6 lg:p-8">
                        {/* Título */}
                        <div className="h-8 bg-stone-200 rounded-md w-3/4 mb-3"></div>

                        {/* Localização */}
                        <div className="h-5 bg-stone-100 rounded w-1/2 mb-4"></div>

                        {/* Preço */}
                        <div className="h-10 bg-amber-100 rounded-md w-2/5 mb-6"></div>

                        {/* Descrição */}
                        <div className="space-y-2 mb-6">
                            <div className="h-4 bg-stone-100 rounded w-full"></div>
                            <div className="h-4 bg-stone-100 rounded w-5/6"></div>
                            <div className="h-4 bg-stone-100 rounded w-4/5"></div>
                        </div>

                        {/* Características */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <div className="p-2 rounded-md bg-amber-50 w-10 h-10"></div>
                                    <div className="space-y-1">
                                        <div className="h-3 bg-stone-100 rounded w-16"></div>
                                        <div className="h-5 bg-stone-200 rounded w-14"></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Botão */}
                        <div className="h-12 bg-amber-200 rounded-lg w-40"></div>
                    </div>
                </div>
            </div>

            {/* Esqueleto do carousel */}
            {variant === 'carousel' && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <div className="h-7 bg-stone-200 rounded-md w-1/3"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-xl overflow-hidden border border-stone-100 shadow-sm h-64">
                                <div className="aspect-[3/2] bg-gradient-to-r from-stone-200 to-stone-100"></div>
                                <div className="p-4 space-y-2">
                                    <div className="h-5 bg-amber-100 rounded w-1/2"></div>
                                    <div className="h-4 bg-stone-200 rounded w-5/6"></div>
                                    <div className="h-4 bg-stone-100 rounded w-2/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default memo(SkeletonLoader)