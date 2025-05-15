'use client';

import React, { useState, useCallback } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'keen-slider/keen-slider.min.css';

// Tipos
export interface CarouselProps {
    /**
     * Elementos a serem exibidos no carrossel
     */
    children: React.ReactNode;

    /**
     * Opções de configuração do carrossel
     */
    options?: {
        /**
         * Número de slides visíveis por vez
         * @default 1
         */
        slidesPerView?: number;

        /**
         * Espaçamento entre slides em pixels
         * @default 16
         */
        spacing?: number;

        /**
         * Se o carrossel deve navegar em loop
         * @default false
         */
        loop?: boolean;

        /**
         * Índice do slide inicial
         * @default 0
         */
        initial?: number;

        /**
         * Reproduzir automaticamente
         * @default false
         */
        autoplay?: boolean;

        /**
         * Intervalo de tempo para navegação automática (em ms)
         * @default 3000
         */
        autoplayInterval?: number;

        /**
         * Configurações responsivas para diferentes breakpoints
         * Deve usar strings como chaves (ex: "768")
         */
        breakpoints?: {
            [width: string]: {
                slides?: {
                    perView?: number;
                    spacing?: number;
                }
            };
        };

        /**
         * Se deve mostrar os controles de navegação
         * @default true
         */
        showControls?: boolean;

        /**
         * Se deve mostrar os indicadores de slides
         * @default true
         */
        showIndicators?: boolean;
    };

    /**
     * Classe CSS personalizada para o wrapper do carrossel
     */
    className?: string;

    /**
     * Título do carrossel (opcional)
     */
    title?: string;

    /**
     * Subtítulo do carrossel (opcional)
     */
    subtitle?: string;
}

/**
 * Componente Carousel otimizado
 * 
 * Um carrossel de conteúdo performático e responsivo
 */
export function Carousel({
    children,
    options = {},
    className,
    title,
    subtitle,
}: CarouselProps) {
    // Refs e state
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loaded, setLoaded] = useState(false);

    // Transforme os breakpoints no formato que o keen-slider espera
    let formattedBreakpoints: any = undefined;

    if (options.breakpoints) {
        formattedBreakpoints = {};
        Object.entries(options.breakpoints).forEach(([key, value]) => {
            formattedBreakpoints[key] = {
                slides: value.slides
            };
        });
    }

    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
        initial: options.initial || 0,
        loop: options.loop || false,
        mode: 'snap',
        slides: {
            perView: options.slidesPerView || 1,
            spacing: options.spacing || 16,
        },
        breakpoints: formattedBreakpoints, slideChanged(slider: import('keen-slider').KeenSliderInstance) {
            setCurrentSlide(slider.track.details.rel);
        },
        created() {
            setLoaded(true);
        },
    }, [autoplayPlugin(options)]);

    // Helper para navegação
    const goToSlide = useCallback((idx: number) => {
        if (!instanceRef.current) return;
        instanceRef.current.moveToIdx(idx);
    }, [instanceRef]);

    // Handlers para navegação
    const handlePrevious = useCallback(() => {
        if (!instanceRef.current) return;
        instanceRef.current.prev();
    }, [instanceRef]);

    const handleNext = useCallback(() => {
        if (!instanceRef.current) return;
        instanceRef.current.next();
    }, [instanceRef]);

    // Calcular o número total de slides para os indicadores
    const totalSlides = React.Children.count(children);

    return (
        <div className={cn('', className)}>
            {/* Título e Subtítulo */}
            {(title || subtitle) && (
                <div className="mb-6">
                    {title && <h3 className="text-2xl font-semibold mb-1">{title}</h3>}
                    {subtitle && <p className="text-neutral-500">{subtitle}</p>}
                </div>
            )}

            {/* Wrapper do Carrossel */}
            <div className="relative">
                {/* Container principal */}
                <div ref={sliderRef} className="keen-slider overflow-hidden">
                    {React.Children.map(children, (child, idx) => (
                        <div className="keen-slider__slide" key={idx}>
                            {child}
                        </div>
                    ))}
                </div>

                {/* Controles de Navegação */}
                {loaded && options.showControls !== false && totalSlides > 1 && (
                    <>
                        <button
                            onClick={handlePrevious}
                            className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white rounded-full shadow-md p-2 opacity-80 hover:opacity-100 transition-opacity z-10"
                            aria-label="Anterior"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        <button
                            onClick={handleNext}
                            className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white rounded-full shadow-md p-2 opacity-80 hover:opacity-100 transition-opacity z-10"
                            aria-label="Próximo"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </>
                )}
            </div>

            {/* Indicadores */}
            {loaded && options.showIndicators !== false && totalSlides > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    {Array.from({ length: totalSlides }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => goToSlide(idx)}
                            className={cn(
                                'h-2 rounded-full transition-all',
                                currentSlide === idx
                                    ? 'w-4 bg-amber-500'
                                    : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                            )}
                            aria-label={`Ir para slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// Plugin para autoplay
function autoplayPlugin(options: CarouselProps['options'] = {}) {
    return (slider: import('keen-slider').KeenSliderInstance) => {
        let timeout: ReturnType<typeof setTimeout>;
        let mouseOver = false;

        function clearNextTimeout() {
            clearTimeout(timeout);
        }

        function nextTimeout() {
            clearTimeout(timeout);
            if (mouseOver) return;
            if (options.autoplay !== true) return;

            timeout = setTimeout(() => {
                slider.next();
            }, options.autoplayInterval || 3000);
        }

        slider.on("created", () => {
            if (options.autoplay) {
                nextTimeout();
            }
        });

        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);

        // Adiciona eventos de mouse para pausar quando o usuário interagir
        const sliderContainer = slider.container;
        sliderContainer.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
        });

        sliderContainer.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
        });

        return () => {
            clearNextTimeout();
            sliderContainer.removeEventListener("mouseover", () => {
                mouseOver = true;
            });
            sliderContainer.removeEventListener("mouseout", () => {
                mouseOver = false;
            });
        };
    };
}

export default Carousel;
