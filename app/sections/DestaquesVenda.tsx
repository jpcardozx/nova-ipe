'use client'

import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { OptimizedCarousel } from '../components/OptimizedCarousel'

import { ImoveisDestaqueProvider, useImoveisDestaque } from '@components/ImoveisDestaqueContext'
import {
    CarouselCard,
    ImovelHero,
    LoadingState,
    ErrorState,
    EmptyState
} from '@components/ImoveisDestaqueComponents'

/**
 * Componente principal que exibe uma seção de imóveis em destaque
 */
function ImoveisDestaqueContent() {
    const { state, fetchImoveis, setActiveImovel, isActiveImovel } = useImoveisDestaque()
    const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '200px' })

    // Carregar dados quando o componente estiver visível
    useEffect(() => {
        if (inView && state.status === 'idle') {
            fetchImoveis()
        }
    }, [inView, fetchImoveis, state.status])

    // Renderizar item do carousel
    const renderCarouselItem = (imovel: any) => (
        <CarouselCard
            imovel={imovel}
            isActive={isActiveImovel(imovel._id)}
            onClick={() => setActiveImovel(imovel._id)}
        />
    )

    // Configurações do carousel
    const carouselOptions = {
        slidesPerView: 1.2,
        spacing: 16,
        loop: state.imoveis.length > 3,
        breakpoints: {
            "(min-width: 640px)": { slidesPerView: 2, spacing: 16 },
            "(min-width: 768px)": { slidesPerView: 2.5, spacing: 20 },
            "(min-width: 1024px)": { slidesPerView: 3, spacing: 24 },
            "(min-width: 1280px)": { slidesPerView: 4, spacing: 24 }
        },
        autoplay: true,
        autoplayInterval: 6000
    }

    // Cores do carousel
    const accentColor = {
        primary: 'bg-amber-600 text-white',
        secondary: 'bg-amber-100 text-amber-800',
        highlight: 'bg-amber-500/10',
        ring: 'focus:ring-amber-400',
        accent: 'text-amber-600'
    }

    return (
        <section
            ref={ref}
            className="relative py-16 bg-gradient-to-b from-stone-100 via-white to-stone-50"
            aria-labelledby="secao-imoveis-destaque-titulo"
        >
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

            <div className="container mx-auto px-4">
                {/* Estados de loading, erro e vazio */}
                {state.status === 'loading' && <LoadingState />}
                {state.status === 'error' && <ErrorState />}

                {/* Estado de sucesso com imóveis */}
                {state.status === 'success' && state.imoveis.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="mb-8">
                            <h2
                                id="secao-imoveis-destaque-titulo"
                                className="text-3xl font-bold text-stone-800 mb-2"
                            >
                                Imóveis em Destaque
                            </h2>
                            <p className="text-stone-600">
                                Selecionamos as melhores oportunidades disponíveis no mercado.
                            </p>
                        </div>

                        {/* Componente do imóvel em destaque */}
                        <ImovelHero />

                        {/* Carousel de outros imóveis */}
                        {state.imoveis.length > 1 && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-medium text-stone-800">
                                        Mais imóveis em destaque
                                    </h3>
                                </div>

                                <OptimizedCarousel
                                    items={state.imoveis}
                                    getKey={(imovel) => imovel._id}
                                    renderItem={renderCarouselItem}
                                    options={carouselOptions}
                                    accentColor={accentColor}
                                    title="Imóveis em destaque"
                                    subtitle={`${state.imoveis.length} opções para você explorar`}
                                />
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Estado vazio - sem imóveis */}
                {state.status === 'success' && state.imoveis.length === 0 && <EmptyState />}
            </div>
        </section>
    )
}

/**
 * Componente wrapper que fornece o contexto
 */
export default function DestaquesVenda() {
    return (
        <ImoveisDestaqueProvider>
            <ImoveisDestaqueContent />
        </ImoveisDestaqueProvider>
    )
}