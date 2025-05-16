'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
// Import only what's needed from framer-motion
import { motion, AnimatePresence } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/src/components/ui/button';

// Import the proper autoplay plugin
import Autoplay, { AutoplayOptionsType } from 'embla-carousel-autoplay';
// Import needed types from embla-carousel main package
import type { CreatePluginType } from 'embla-carousel';

// Define a simple type that mimics LoosePluginType
type LoosePluginType = Record<string, unknown>;

// Define a generic type for carousel options to avoid 'any'
type CarouselOptions = OptimizedCarouselProps<unknown>['options'];

// Helper function to get plugins based on options
function getPlugins(options: CarouselOptions = {}): CreatePluginType<LoosePluginType, Record<string, unknown>>[] {
    if (!options.autoplay) {
        return [];
    }

    const autoplayOptions: AutoplayOptionsType = {
        delay: options.autoplayDelay || 5000,
        stopOnInteraction: true,
    };

    return [
        Autoplay(autoplayOptions)
    ];
}

export type OptimizedCarouselProps<T> = {
    items: T[];
    getKey: (item: T) => string;
    renderItem: (item: T, index: number) => React.ReactNode;
    options?: {
        align?: 'start' | 'center' | 'end';
        loop?: boolean;
        dragFree?: boolean;
        slidesToShow?: number;
        spacing?: number;
        autoplay?: boolean;
        autoplayDelay?: number;
        startIndex?: number;
        // Configurações responsivas
        breakpoints?: {
            [key: string]: { slidesToShow: number; spacing?: number }
        };
    };
    className?: string;
    title?: string;
    subtitle?: string;    // External navigation refs
    prevRef?: React.RefObject<HTMLElement | null> | React.RefObject<HTMLButtonElement | null>;
    nextRef?: React.RefObject<HTMLElement | null> | React.RefObject<HTMLButtonElement | null>;
    controls?: {
        showArrows?: boolean;
        showDots?: boolean;
        arrowPosition?: 'inside' | 'outside' | 'alongside';
        arrowSize?: 'sm' | 'md' | 'lg';
    };
    accentColor?: {
        primary: string;
        secondary: string;
        highlight: string;
        ring: string;
        accent: string;
    };
};

export function OptimizedCarousel<T>({
    items,
    getKey,
    renderItem,
    options = {},
    className,
    title,
    subtitle,
    prevRef,
    nextRef,
    controls = {
        showArrows: true,
        showDots: true,
        arrowPosition: 'inside',
        arrowSize: 'md',
    },
    accentColor,
}: OptimizedCarouselProps<T>) {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            align: options.align || 'start',
            loop: options.loop ?? items.length > 2,
            dragFree: options.dragFree,
            slidesToScroll: 1,
            containScroll: 'trimSnaps',
            startIndex: options.startIndex || 0,
        },        // Create plugins array based on options
        getPlugins(options)
    );

    // Estados
    const [currentSlide, setCurrentSlide] = useState(0);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const liveRegion = useRef<HTMLDivElement>(null);

    // Tamanho responsivo dos slides
    const slidesInView = options.slidesToShow || 1;

    // Cores
    const colors = accentColor || {
        primary: 'bg-brand-primary text-white',
        secondary: 'bg-neutral-100 text-neutral-800',
        highlight: 'bg-brand-primary/10',
        ring: 'focus:ring-brand-primary/40',
        accent: 'text-brand-primary',
    };

    // Atualizações de estado quando o carrossel muda
    const onSelect = useCallback(() => {
        if (!emblaApi) return;

        setCurrentSlide(emblaApi.selectedScrollSnap());
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());

        // Atualizar live region para acessibilidade
        if (liveRegion.current) {
            liveRegion.current.textContent = `Slide ${emblaApi.selectedScrollSnap() + 1} de ${items.length}`;
        }
    }, [emblaApi, items.length]);

    // Set up event listeners
    useEffect(() => {
        if (!emblaApi) return;

        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);

        return () => {
            emblaApi.off("select", onSelect);
            emblaApi.off("reInit", onSelect);
        };
    }, [emblaApi, onSelect]);    // Scroll próximo/anterior
    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    // Connect external refs if provided
    useEffect(() => {
        if (!prevRef || !nextRef) return;

        const handlePrevClick = () => scrollPrev();
        const handleNextClick = () => scrollNext();

        const prevEl = prevRef.current;
        const nextEl = nextRef.current;

        if (prevEl) prevEl.addEventListener('click', handlePrevClick);
        if (nextEl) nextEl.addEventListener('click', handleNextClick);

        return () => {
            if (prevEl) prevEl.removeEventListener('click', handlePrevClick);
            if (nextEl) nextEl.removeEventListener('click', handleNextClick);
        };
    }, [prevRef, nextRef, scrollPrev, scrollNext]);

    // Navegação para um slide específico
    const scrollTo = useCallback((index: number) => {
        if (emblaApi) emblaApi.scrollTo(index);
    }, [emblaApi]);

    // Criar estilo inline para os slides com base nas opções
    const slideStyle = {
        flex: `0 0 ${100 / (options.slidesToShow || 1)}%`,
        paddingLeft: `${options.spacing || 16}px`,
        paddingRight: `${options.spacing || 16}px`,
    };    // Renderização do componente
    if (items.length === 0) return null;

    return (
        <div
            className={cn("relative w-full min-h-[450px]", className)}
            style={{
                // Layout Shift - Reservando o espaço necessário para evitar CLS
                minHeight: "450px"
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Cabeçalho com título e subtítulo */}
            {(title || subtitle) && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                    <div>
                        {title && <h2 className="text-2xl font-bold mb-1">{title}</h2>}
                        {subtitle && <p className="text-neutral-600">{subtitle}</p>}
                    </div>

                    {/* Contador de slides (visible on larger screens) */}
                    <div className="hidden sm:flex items-center gap-2 mt-4 sm:mt-0">
                        <span className="text-sm text-neutral-500">
                            {currentSlide + 1} / {items.length}
                        </span>

                        {/* Botões de navegação alinhados a direita */}
                        {controls.showArrows && controls.arrowPosition === 'alongside' && (
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled={!canScrollPrev}
                                    onClick={scrollPrev}
                                    className="rounded-full"
                                    aria-label="Slide anterior"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled={!canScrollNext}
                                    onClick={scrollNext}
                                    className="rounded-full"
                                    aria-label="Próximo slide"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Container principal do carrossel */}
            <div className="relative overflow-hidden" ref={emblaRef}>
                {/* Wrapper dos slides */}
                <div className="flex">
                    {/* Renderização dos slides */}
                    {items.map((item, index) => (
                        <div
                            key={getKey(item)}
                            className="min-w-0 relative"
                            style={slideStyle}
                        >
                            {/* Wrapper de animação */}
                            <motion.div
                                initial={{ opacity: 0.8, y: 10 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: currentSlide === index ? 1 : 0.98,
                                }}
                                transition={{
                                    duration: 0.4,
                                    ease: "easeOut"
                                }}
                                className="h-full"
                            >
                                {renderItem(item, index)}
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navegação - Dots */}
            {controls.showDots && items.length > 1 && (
                <div className="flex justify-center mt-4 gap-1.5">
                    {Array.from({ length: items.length }).map((_, i) => (
                        <button
                            key={`dot-${i}`}
                            onClick={() => scrollTo(i)}
                            aria-label={`Ir para slide ${i + 1}`}
                            aria-current={i === currentSlide}
                            className={cn(
                                "transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2",
                                colors.ring,
                                i === currentSlide
                                    ? cn("w-8 h-2", colors.primary)
                                    : "w-2 h-2 bg-neutral-300 hover:bg-neutral-400"
                            )}
                        />
                    ))}
                </div>
            )}

            {/* Navegação - Setas (interno) */}            {controls.showArrows && controls.arrowPosition === 'inside' ? (
                <AnimatePresence>
                    {(isHovering || !options.autoplay) ? (
                        <>
                            {/* Botão anterior */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className={cn(
                                    "absolute top-1/2 -translate-y-1/2 left-2 md:left-4",
                                    "z-10"
                                )}
                            >
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="rounded-full shadow-md bg-white/90 backdrop-blur-sm hover:bg-white"
                                    onClick={scrollPrev}
                                    disabled={!canScrollPrev && !options.loop}
                                    aria-label="Slide anterior"
                                >
                                    <ChevronLeft className={cn(
                                        controls.arrowSize === 'sm' ? "h-4 w-4" :
                                            controls.arrowSize === 'lg' ? "h-6 w-6" : "h-5 w-5"
                                    )} />
                                </Button>
                            </motion.div>

                            {/* Botão próximo */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className={cn(
                                    "absolute top-1/2 -translate-y-1/2 right-2 md:right-4",
                                    "z-10"
                                )}
                            >
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="rounded-full shadow-md bg-white/90 backdrop-blur-sm hover:bg-white"
                                    onClick={scrollNext}
                                    disabled={!canScrollNext && !options.loop}
                                    aria-label="Próximo slide"
                                >
                                    <ChevronRight className={cn(
                                        controls.arrowSize === 'sm' ? "h-4 w-4" :
                                            controls.arrowSize === 'lg' ? "h-6 w-6" : "h-5 w-5"
                                    )} />                                </Button>
                            </motion.div>
                        </>
                    ) : null}
                </AnimatePresence>
            ) : null}

            {/* Navegação - Setas (externo) */}
            {controls.showArrows && controls.arrowPosition === 'outside' ? (
                <div className="flex justify-center mt-4 gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={scrollPrev}
                        disabled={!canScrollPrev ? !options.loop : false}
                        aria-label="Slide anterior"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={scrollNext}
                        disabled={!canScrollNext ? !options.loop : false}
                        aria-label="Próximo slide"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            ) : null}

            {/* Live region para acessibilidade */}
            <div
                ref={liveRegion}
                className="sr-only"
                aria-live="polite"
                aria-atomic="true"
            />
        </div>
    );
}

export default OptimizedCarousel;
