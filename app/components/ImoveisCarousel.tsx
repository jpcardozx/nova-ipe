'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import 'keen-slider/keen-slider.min.css';
import type { KeenSliderOptions } from 'keen-slider';

// Removidas dependências desnecessárias do framer-motion

/**
 * Props para o componente ImoveisCarousel
 * Específico para o domínio de imóveis - não é um carrossel genérico
 */
export interface ImoveisCarouselProps<T> {
    /**
     * Lista de imóveis para mostrar no carrossel
     */
    imoveis: T[];

    /**
     * Função para extrair o identificador único de cada imóvel
     */
    getKey?: (imovel: T & { _id?: string; id?: string }) => string;

    /**
     * Componente para renderizar cada item do carrossel
     */
    renderItem: (imovel: T, index: number) => React.ReactNode;

    /**
     * Configurações do carrossel
     */
    options?: {
        // Número de slides visíveis por vez (padrão: 1)
        slidesPerView?: number;
        // Espaçamento entre slides em pixels (padrão: 16)
        spacing?: number;
        // Se o carrossel deve navegar em loop (padrão: false)
        loop?: boolean;
        // Índice do slide inicial (padrão: 0)
        initial?: number;
        // Breakpoints para responsividade
        breakpoints?: Record<number, { slidesPerView: number; spacing?: number }>;
    };

    /**
     * Classe CSS para o container do carrossel
     */
    className?: string;

    /**
     * Título da seção (opcional)
     */
    titulo?: string;

    /**
     * Subtítulo da seção (opcional)
     */
    subtitulo?: string;

    /**
     * Texto do botão "Ver todos" (opcional)
     */
    textoVerTodos?: string;

    /**
     * URL para o botão "Ver todos" (opcional)
     */
    urlVerTodos?: string;

    /**
     * Cores de destaque (opcional)
     */
    coresTema?: {
        principal: string;
        secundaria: string;
        texto: string;
    };
}

/**
 * Componente de carrossel otimizado especificamente para imóveis
 * Versão melhorada e específica para o caso de uso da Ipê Imóveis
 */
export function ImoveisCarousel<T extends { _id?: string; id?: string }>({ imoveis,
    getKey = (item: T) => item._id || item.id || Math.random().toString(),
    renderItem,
    options = {},
    className,
    titulo,
    subtitulo,
    textoVerTodos = "Ver todos",
    urlVerTodos,
    coresTema = {
        principal: 'bg-brand-green',
        secundaria: 'bg-brand-light',
        texto: 'text-neutral-800'
    }
}: ImoveisCarouselProps<T>) {

    // Simplify breakpoints to focus on required properties
    const formattedBreakpoints = Object.fromEntries(
        Object.entries(options.breakpoints || {}).map(([key, value]) => [
            `(min-width: ${key}px)`,
            {
                slidesPerView: value.slidesPerView,
                spacing: value.spacing || 0,
            }
        ])
    );

    options.breakpoints = formattedBreakpoints;

    // Refs para controles e estado
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loaded, setLoaded] = useState(false);

    // Configuração otimizada do slider
    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
        {
            initial: options.initial || 0,
            loop: options.loop || false,
            slides: {
                perView: options.slidesPerView || 1,
                spacing: options.spacing || 16,
            },
            breakpoints: options.breakpoints
                ? Object.fromEntries(
                    Object.entries(options.breakpoints).map(([key, value]) => [
                        key.toString(),
                        {
                            slides: {
                                perView: value.slidesPerView,
                                spacing: value.spacing || 0,
                            },
                        },
                    ])
                )
                : {} as { [key: string]: Omit<KeenSliderOptions, "breakpoints"> }, slideChanged(slider: import('keen-slider').KeenSliderInstance) {
                    setCurrentSlide(slider.track.details.rel);
                },
            created() {
                setLoaded(true);
            },
        }
    );

    // Navegação otimizada
    const handlePrev = useCallback(() => {
        instanceRef.current?.prev();
    }, [instanceRef]);

    const handleNext = useCallback(() => {
        instanceRef.current?.next();
    }, [instanceRef]);

    // Total de slides para indicadores
    const totalSlides = imoveis.length;
    const hasMultipleSlides = totalSlides > 1;

    return (
        <section className={cn("w-full py-8", className)}>
            {/* Cabeçalho com título, subtítulo e link "ver todos" */}
            {(titulo || subtitulo || urlVerTodos) && (
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        {titulo && (
                            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-neutral-900 font-playfair">{titulo}</h2>
                        )}
                        {subtitulo && (
                            <p className="text-neutral-600 text-base md:text-lg max-w-2xl">{subtitulo}</p>
                        )}
                    </div>

                    {urlVerTodos && (
                        <Link
                            href={urlVerTodos}
                            className={cn(
                                "inline-flex items-center gap-2 font-medium mt-4 md:mt-0 transition-all",
                                "hover:gap-3 hover:text-brand-green",
                                coresTema.texto
                            )}
                        >
                            {textoVerTodos}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    )}
                </div>
            )}

            {/* Container principal do carrossel */}
            <div className="relative">
                {/* Container do keen-slider */}
                <div ref={sliderRef} className="keen-slider overflow-hidden rounded-lg">
                    {imoveis.map((imovel, idx) => (
                        <div
                            className="keen-slider__slide"
                            key={getKey(imovel)}
                            data-item-index={idx}
                        >
                            {renderItem(imovel, idx)}
                        </div>
                    ))}
                </div>

                {/* Controles de navegação - renderizados apenas se houver múltiplos slides */}
                {loaded && hasMultipleSlides && (
                    <>
                        <button
                            onClick={handlePrev}
                            className={cn(
                                "absolute top-1/2 -left-3 md:left-4 transform -translate-y-1/2 rounded-full p-2 z-10 transition-all",
                                "bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg hover:scale-110 active:scale-95",
                                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green",
                                "hover:bg-brand-green hover:text-white"
                            )}
                            aria-label="Visualizar imóvel anterior"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        <button
                            onClick={handleNext}
                            className={cn(
                                "absolute top-1/2 -right-3 md:right-4 transform -translate-y-1/2 rounded-full p-2 z-10 transition-all",
                                "bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg hover:scale-110 active:scale-95",
                                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green",
                                "hover:bg-brand-green hover:text-white"
                            )}
                            aria-label="Visualizar próximo imóvel"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </>
                )}
            </div>

            {/* Indicadores de slide - apenas se houver múltiplos slides */}
            {loaded && hasMultipleSlides && (
                <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: totalSlides }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => instanceRef.current?.moveToIdx(idx)}
                            className={cn(
                                "h-2.5 transition-all rounded-full focus:outline-none",
                                currentSlide === idx
                                    ? `w-10 ${coresTema.principal} scale-100`
                                    : `w-2.5 ${coresTema.secundaria} hover:bg-neutral-300 hover:scale-110`
                            )}
                            aria-label={`Ir para imóvel ${idx + 1} de ${totalSlides}`}
                            aria-current={currentSlide === idx ? "true" : "false"}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default ImoveisCarousel;
