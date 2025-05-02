'use client'

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
    MapPin,
    ArrowUpRight,
    Loader2,
    HomeIcon,
    BedDouble,
    Bath,
    AreaChart,
    Car,
    AlertTriangle
} from 'lucide-react'

import { cn, formatarMoeda, formatarArea, formatarQuantidade } from '@/lib/utils'
import type { ImovelClient } from '@/types/imovel-client'
import SanityImage from '@components/SanityImage'
import { useImoveisDestaque } from './ImoveisDestaqueContext'

// Tipos e interfaces
export type ImovelFeature = {
    label: string
    value: string
    icon: React.ReactNode
}

interface ImovelCardProps {
    imovel: ImovelClient
    isActive?: boolean
    onClick?: () => void
}

// Componente de Característica do Imóvel
export const ImovelFeatureItem = memo(({ feature }: { feature: ImovelFeature }) => (
    <div className="flex items-start gap-2">
        <div className="p-2 rounded-md bg-amber-50 text-amber-700">{feature.icon}</div>
        <div>
            <p className="text-xs text-stone-500">{feature.label}</p>
            <p className="font-medium">{feature.value}</p>
        </div>
    </div>
))
ImovelFeatureItem.displayName = 'ImovelFeatureItem'

// Badge de Destaque
export const DestaqueBadge = memo(() => (
    <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-medium px-3 py-1.5 rounded-full">
        Destaque
    </div>
))
DestaqueBadge.displayName = 'DestaqueBadge'

// Componente de Localização
export const ImovelLocation = memo(
    ({ bairro, cidade, className }: { bairro?: string; cidade?: string; className?: string }) => (
        <div className={cn('flex items-center text-stone-500 text-sm', className)}>
            <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
            <span className="truncate">
                {bairro ? `${bairro}, ` : ''}
                {cidade || 'Localização não informada'}
            </span>
        </div>
    )
)
ImovelLocation.displayName = 'ImovelLocation'

// Componente de Preço
export const ImovelPrice = memo(
    ({ preco, tamanho = 'normal', className }: { preco?: number; tamanho?: 'pequeno' | 'normal' | 'grande'; className?: string }) => {
        const formatarPreco = (valor?: number) => {
            if (valor === undefined) return 'Consulte'
            return formatarMoeda(valor)
        }

        const textSize = {
            pequeno: 'text-base',
            normal: 'text-2xl',
            grande: 'text-3xl'
        }

        return (
            <div className={cn('font-bold text-amber-700', textSize[tamanho], className)}>
                {formatarPreco(preco)}
            </div>
        )
    }
)
ImovelPrice.displayName = 'ImovelPrice'

// Botão de Detalhes
export const ImovelDetailsButton = memo(
    ({ slug, finalidade, tamanho = 'normal', className }: { slug?: string; finalidade?: string; tamanho?: 'pequeno' | 'normal'; className?: string }) => {
        const paddings = {
            pequeno: 'px-4 py-2 text-sm',
            normal: 'px-5 py-3'
        }

        return (
            <Link
                href={`/imoveis/${finalidade?.toLowerCase() || 'comprar'}/${slug}`}
                className={cn(
                    'w-full sm:w-auto inline-flex justify-center items-center',
                    'bg-amber-700 text-white rounded-lg font-medium',
                    'hover:bg-amber-800 transition-colors gap-2',
                    paddings[tamanho],
                    className
                )}
            >
                Ver detalhes
                <ArrowUpRight className="w-4 h-4" />
            </Link>
        )
    }
)
ImovelDetailsButton.displayName = 'ImovelDetailsButton'

// Card para Carousel
export const CarouselCard = memo<ImovelCardProps>(({ imovel, isActive, onClick }) => {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                'h-full bg-white rounded-xl overflow-hidden border shadow-sm cursor-pointer transition-all duration-300',
                isActive ? 'border-amber-500 ring-2 ring-amber-200' : 'border-stone-100 hover:border-amber-200'
            )}
            onClick={onClick}
            role="button"
            aria-pressed={isActive}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onClick?.()
                }
            }}
        >
            <div className="aspect-[3/2] relative">
                <SanityImage image={imovel.imagem} alt={imovel.titulo || 'Imóvel'} fill={true} />
                {imovel.destaque && <DestaqueBadge />}
            </div>
            <div className="p-4">
                <ImovelPrice preco={imovel.preco} tamanho="pequeno" className="mb-1" />
                <h4 className="font-medium text-stone-800 mb-1 line-clamp-1">{imovel.titulo}</h4>
                <ImovelLocation bairro={imovel.bairro} cidade={imovel.cidade} />
            </div>
        </motion.div>
    )
})
CarouselCard.displayName = 'CarouselCard'

// Componente de Destaque Principal (Hero)
export const ImovelHero = memo(() => {
    const { getActiveImovel } = useImoveisDestaque()
    const imovel = getActiveImovel()

    if (!imovel) return null

    // Gerar características do imóvel
    const getFeatures = (imovel: ImovelClient): ImovelFeature[] => [
        {
            label: 'Dormitórios',
            value: imovel.dormitorios ? formatarQuantidade(imovel.dormitorios, 'quarto') : '—',
            icon: <BedDouble className="w-4 h-4" />
        },
        {
            label: 'Banheiros',
            value: imovel.banheiros ? formatarQuantidade(imovel.banheiros, 'banheiro') : '—',
            icon: <Bath className="w-4 h-4" />
        },
        {
            label: 'Área',
            value: imovel.areaUtil ? formatarArea(imovel.areaUtil) : '—',
            icon: <AreaChart className="w-4 h-4" />
        },
        {
            label: 'Garagem',
            value: imovel.vagas ? formatarQuantidade(imovel.vagas, 'vaga') : '—',
            icon: <Car className="w-4 h-4" />
        }
    ]

    return (
        <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            key={imovel._id}
            layout
        >
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-stone-100">
                <div className="flex flex-col lg:flex-row">
                    {/* Imagem do imóvel */}
                    <div className="lg:w-1/2">
                        <div className="aspect-[4/3] relative">
                            <SanityImage
                                image={imovel.imagem}
                                alt={imovel.titulo || 'Imóvel em destaque'}
                                fill={true}
                                priority={true}
                            />
                            {imovel.destaque && <DestaqueBadge />}
                        </div>
                    </div>

                    {/* Informações do imóvel */}
                    <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col">
                        <h3 className="text-2xl font-bold text-stone-800 mb-2">{imovel.titulo}</h3>
                        <ImovelLocation
                            bairro={imovel.bairro}
                            cidade={imovel.cidade}
                            className="mb-3"
                        />
                        <ImovelPrice preco={imovel.preco} tamanho="grande" className="mb-4" />

                        {imovel.descricao && (
                            <p className="text-stone-600 mb-6 line-clamp-3">{imovel.descricao}</p>
                        )}

                        {/* Características */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {getFeatures(imovel).map((feature, idx) => (
                                <ImovelFeatureItem key={idx} feature={feature} />
                            ))}
                        </div>

                        <div className="mt-auto">
                            <ImovelDetailsButton slug={imovel.slug} finalidade={imovel.finalidade} />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
})
ImovelHero.displayName = 'ImovelHero'

// Estado de Carregamento
export const LoadingState = memo(() => (
    <div className="flex flex-col items-center justify-center min-h-[40vh] py-12">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4"
        >
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </motion.div>
        <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-medium text-stone-800"
        >
            Carregando imóveis em destaque...
        </motion.h3>
    </div>
))
LoadingState.displayName = 'LoadingState'

// Estado de Erro
export const ErrorState = memo(() => (
    <div className="flex flex-col items-center justify-center min-h-[40vh] py-12">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-stone-800 mb-3">
            Não foi possível carregar os imóveis em destaque
        </h3>
        <p className="text-stone-600 text-center max-w-md mb-6">
            Ocorreu um erro ao buscar os dados. Por favor, tente novamente mais tarde ou entre em contato com nosso suporte.
        </p>
        <Link
            href="/imoveis"
            className="inline-flex items-center px-4 py-2 bg-amber-700 text-white rounded-lg font-medium hover:bg-amber-800 transition-colors"
        >
            Ver catálogo completo
            <ArrowUpRight className="w-4 h-4 ml-1" />
        </Link>
    </div>
))
ErrorState.displayName = 'ErrorState'

// Estado Vazio (sem imóveis)
export const EmptyState = memo(() => (
    <div className="flex flex-col items-center justify-center min-h-[40vh] py-12">
        <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4">
            <HomeIcon className="w-8 h-8 text-amber-300" />
        </div>
        <h3 className="text-xl font-medium text-stone-800 mb-2">Novos imóveis em breve</h3>
        <p className="text-stone-500 max-w-md text-center mb-6">
            Estamos selecionando novas oportunidades para nosso catálogo. Volte em breve para conferir.
        </p>
        <Link
            href="/imoveis"
            className="inline-flex items-center px-5 py-3 bg-amber-700 text-white rounded-lg font-medium hover:bg-amber-800 transition-colors"
        >
            Ver todo o catálogo
            <ArrowUpRight className="w-4 h-4 ml-2" />
        </Link>
    </div>
))
EmptyState.displayName = 'EmptyState'