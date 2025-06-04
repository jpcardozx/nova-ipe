'use client';

import {
    ReactNode,
    useRef,
    useState,
    useEffect,
    forwardRef,
    Ref,
    useCallback,
} from 'react';
import { useKeenSlider } from 'keen-slider/react';
import type { KeenSliderInstance, KeenSliderOptions } from 'keen-slider';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import 'keen-slider/keen-slider.min.css';

export interface OptimizedCarouselProps<T> {
    items: T[];
    getKey: (item: T) => string;
    renderItem: (item: T, index: number) => ReactNode;
    options?: {
        slidesPerView?: number;
        spacing?: number;
        loop?: boolean;
        initial?: number;
        autoplay?: boolean;
        autoplayInterval?: number;
        // Simplificado: key → perView/spacing
        breakpoints?: Record<string, { slidesPerView: number; spacing?: number }>;
    };
    className?: string;
    prevRef?: Ref<HTMLButtonElement>;
    nextRef?: Ref<HTMLButtonElement>;
    title?: string;
    subtitle?: string;
    accentColor?: {
        primary: string;
        secondary: string;
        highlight: string;
        ring: string;
        accent: string;
    };
}

export function OptimizedCarousel<T>({
    items,
    getKey,
    renderItem,
    options = {},
    className,
    prevRef,
    nextRef,
    title,
    subtitle,
    accentColor,
}: OptimizedCarouselProps<T>) {
    const [current, setCurrent] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [hovering, setHovering] = useState(false);
    const [touchMode, setTouchMode] = useState(false);
    const liveRegion = useRef<HTMLDivElement>(null);
    const carouselRef = useRef<HTMLDivElement>(null);
    const autoplayRef = useRef<NodeJS.Timeout | null>(null);

    // Color schemes for styling com valores padrão completos
    const colors = accentColor || {
        primary: 'bg-indigo-600 text-white',
        secondary: 'bg-indigo-100 text-indigo-800',
        highlight: 'bg-indigo-500/10',
        ring: 'focus:ring-indigo-400',
        accent: 'text-indigo-600',
    };

    // Handle autoplay functionality
    const startAutoplay = useCallback(() => {
        if (!options.autoplay || touchMode || hovering) return;

        if (autoplayRef.current) {
            clearInterval(autoplayRef.current);
        }

        autoplayRef.current = setInterval(() => {
            if (slider.current) {
                slider.current.next();
            }
        }, options.autoplayInterval || 5000);
    }, [options.autoplay, options.autoplayInterval, touchMode, hovering]);

    const stopAutoplay = useCallback(() => {
        if (autoplayRef.current) {
            clearInterval(autoplayRef.current);
            autoplayRef.current = null;
        }
    }, []);

    // Transforma os breakpoints simplificados em KeenSliderOptions.breakpoints
    const keenBreakpoints: KeenSliderOptions['breakpoints'] | undefined = options.breakpoints
        ? Object.fromEntries(
            Object.entries(options.breakpoints).map(([query, cfg]) => [
                query,
                {
                    slides: {
                        perView: cfg.slidesPerView,
                        spacing: cfg.spacing ?? options.spacing ?? 16,
                    },
                },
            ])
        )
        : undefined;

    // Se não houver breakpoints definidos, usar padrões responsivos
    const defaultBreakpoints = !options.breakpoints ? {
        "(min-width: 1536px)": {
            slides: { perView: 4, spacing: 24 },
        },
        "(min-width: 1280px)": {
            slides: { perView: 3, spacing: 20 },
        },
        "(min-width: 768px)": {
            slides: { perView: 2.5, spacing: 16 },
        },
        "(min-width: 640px)": {
            slides: { perView: 2, spacing: 12 },
        },
        "(min-width: 0px)": {
            slides: { perView: 1.2, spacing: 12 },
        },
    } : undefined;

    const keenOptions: KeenSliderOptions = {
        initial: options.initial ?? 0,
        loop: options.loop ?? items.length > 3,
        slides: {
            perView: options.slidesPerView ?? 1.2,
            spacing: options.spacing ?? 16,
        },
        breakpoints: keenBreakpoints || defaultBreakpoints,
        slideChanged(s: KeenSliderInstance) {
            setCurrent(s.track.details.rel);
        },
        created() {
            setLoaded(true);
        },
        dragStarted() {
            setTouchMode(true);
            stopAutoplay();
        },
        dragEnded() {
            setTimeout(() => setTouchMode(false), 100);
            startAutoplay();
        },
    };

    const [sliderRef, slider] = useKeenSlider<HTMLDivElement, KeenSliderOptions>(
        keenOptions
    );

    // A11y: announce slide change
    useEffect(() => {
        if (liveRegion.current) {
            liveRegion.current.textContent = `Slide ${current + 1} de ${items.length}`;
        }
    }, [current, items.length]);

    // Handle autoplay
    useEffect(() => {
        if (loaded && options.autoplay) {
            startAutoplay();
        }

        return () => stopAutoplay();
    }, [loaded, options.autoplay, startAutoplay, stopAutoplay]);

    // Watch for screen resize to detect touch devices
    useEffect(() => {
        const checkTouchMode = () => {
            setTouchMode(window.matchMedia('(max-width: 768px)').matches);
        };

        checkTouchMode();
        window.addEventListener('resize', checkTouchMode);

        return () => window.removeEventListener('resize', checkTouchMode);
    }, []);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!carouselRef.current?.contains(document.activeElement)) return;

            if (e.key === 'ArrowLeft') {
                slider.current?.prev();
            } else if (e.key === 'ArrowRight') {
                slider.current?.next();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [slider]);

    // Render empty state if no items
    if (items.length === 0) {
        return null;
    }

    return (
        <div
            className={cn('relative w-full', className)}
            ref={carouselRef}
            onMouseEnter={() => { setHovering(true); stopAutoplay(); }}
            onMouseLeave={() => { setHovering(false); startAutoplay(); }}
        >
            {/* Header section with title and subtitle */}
            {(title || subtitle) && (
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5">
                    <div>
                        {title && (
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
                        )}
                        {subtitle && (
                            <p className="text-gray-600">{subtitle}</p>
                        )}
                    </div>

                    <div className="flex items-center mt-3 sm:mt-0">
                        <div className="text-sm text-gray-500 mr-4">
                            {current + 1} de {items.length}
                        </div>

                        {/* Navigation Buttons for non-touch */}
                        <div className="hidden sm:flex items-center space-x-2">
                            <button
                                ref={prevRef}
                                onClick={() => slider.current?.prev()}
                                className={cn(
                                    'p-2 rounded-full border border-gray-200',
                                    'text-gray-700 hover:text-gray-900 transition-colors',
                                    'focus:outline-none focus:ring-2',
                                    colors.ring
                                )}
                                aria-label="Itens anteriores"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                ref={nextRef}
                                onClick={() => slider.current?.next()}
                                className={cn(
                                    'p-2 rounded-full border border-gray-200',
                                    'text-gray-700 hover:text-gray-900 transition-colors',
                                    'focus:outline-none focus:ring-2',
                                    colors.ring
                                )}
                                aria-label="Próximos itens"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div
                ref={sliderRef}
                className="keen-slider"
                role="region"
                aria-label="Carrossel interativo"
                tabIndex={0}
            >
                {items.map((item, index) => (
                    <div
                        key={getKey(item)}
                        className="keen-slider__slide pb-4"
                    >
                        {/* Only animate slides near the current slide for performance */}
                        {Math.abs(index - current) < 3 ? (
                            <motion.div
                                className="h-full rounded-xl overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: index === current ? 1 : 0.85,
                                    y: 0,
                                    scale: index === current ? 1 : 0.98,
                                }}
                                transition={{
                                    duration: 0.5,
                                    ease: 'easeOut',
                                    scale: { duration: 0.4 }
                                }}
                            >
                                {renderItem(item, index)}
                            </motion.div>
                        ) : (
                            // For far slides, just render without animation
                            <div className="h-full rounded-xl overflow-hidden opacity-85 scale-98">
                                {renderItem(item, index)}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div
                ref={liveRegion}
                className="sr-only"
                aria-live="polite"
                aria-atomic="true"
            />

            {/* Touch device navigation arrows - only visible when actively hovering */}
            <AnimatePresence>
                {(hovering && !touchMode) && (
                    <>
                        <motion.button
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => slider.current?.prev()}
                            className={cn(
                                'absolute top-1/2 -translate-y-1/2 left-3 md:left-6 z-10',
                                'p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg',
                                'hover:bg-white transition-all',
                                'focus:outline-none focus:ring-2',
                                colors.ring
                            )}
                            aria-label="Itens anteriores"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-800" />
                        </motion.button>

                        <motion.button
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => slider.current?.next()}
                            className={cn(
                                'absolute top-1/2 -translate-y-1/2 right-3 md:right-6 z-10',
                                'p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg',
                                'hover:bg-white transition-all',
                                'focus:outline-none focus:ring-2',
                                colors.ring
                            )}
                            aria-label="Próximos itens"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-800" />
                        </motion.button>
                    </>
                )}
            </AnimatePresence>

            {/* Pagination dots - adaptive based on number of items */}
            {items.length <= 10 && (
                <div className="flex justify-center mt-4 gap-1.5">
                    {items.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => slider.current?.moveToIdx(i)}
                            aria-label={`Ir para item ${i + 1}`}
                            aria-current={i === current ? 'true' : 'false'}
                            className={cn(
                                'w-2 h-2 rounded-full transition-all duration-300',
                                i === current
                                    ? cn('w-6', colors.primary)
                                    : 'bg-gray-300 hover:bg-gray-400',
                                'focus:outline-none focus:ring-2 ring-offset-2',
                                colors.ring
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default OptimizedCarousel;
