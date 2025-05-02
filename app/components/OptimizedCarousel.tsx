'use client';

import {
    ReactNode,
    useRef,
    useState,
    useEffect,
    forwardRef,
    Ref,
} from 'react';
import { useKeenSlider } from 'keen-slider/react';
import type { KeenSliderInstance, KeenSliderOptions } from 'keen-slider';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@core/utils';
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
        // Simplificado: key → perView/spacing
        breakpoints?: Record<string, { slidesPerView: number; spacing?: number }>;
    };
    className?: string;
    prevRef?: Ref<HTMLButtonElement>;
    nextRef?: Ref<HTMLButtonElement>;
}

export function OptimizedCarousel<T>({
    items,
    getKey,
    renderItem,
    options = {},
    className,
    prevRef,
    nextRef,
}: OptimizedCarouselProps<T>) {
    const [current, setCurrent] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const liveRegion = useRef<HTMLDivElement>(null);

    // Transforma os breakpoints simplificados em KeenSliderOptions.breakpoints
    const keenBreakpoints: KeenSliderOptions['breakpoints'] | undefined = options.breakpoints
        ? Object.fromEntries(
            Object.entries(options.breakpoints).map(([query, cfg]) => [
                query,
                {
                    slides: {
                        perView: cfg.slidesPerView,
                        spacing: cfg.spacing ?? 0,
                    },
                },
            ])
        )
        : undefined;

    const keenOptions: KeenSliderOptions = {
        initial: options.initial ?? 0,
        loop: options.loop ?? items.length > 3,
        slides: {
            perView: options.slidesPerView ?? 1.2,
            spacing: options.spacing ?? 16,
        },
        breakpoints: keenBreakpoints,
        slideChanged(s: KeenSliderInstance) {
            // Antes: s.details(); agora:
            setCurrent(s.track.details.rel);
        },
        created() {
            setLoaded(true);
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

    return (
        <div className={cn('relative w-full', className)}>
            <div
                ref={sliderRef}
                className="keen-slider"
                role="region"
                aria-label="Carrossel interativo"
                tabIndex={0}
            >
                {items.map((item, index) => (
                    <motion.div
                        key={getKey(item)}
                        className="keen-slider__slide rounded-xl overflow-hidden bg-white shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                            loaded
                                ? { opacity: index === current ? 1 : 0.8, y: 0 }
                                : { opacity: 0 }
                        }
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        style={{ padding: 8 }}
                    >
                        {renderItem(item, index)}
                    </motion.div>
                ))}
            </div>

            <div
                ref={liveRegion}
                className="sr-only"
                aria-live="polite"
                aria-atomic="true"
            />

            <button
                ref={prevRef}
                aria-label="Slide anterior"
                onClick={() => slider.current?.prev()}
                className={cn(
                    'absolute top-1/2 -translate-y-1/2 left-3 md:left-6 z-10',
                    'p-2 rounded-full bg-white shadow hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-indigo-300'
                )}
            >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>

            <button
                ref={nextRef}
                aria-label="Próximo slide"
                onClick={() => slider.current?.next()}
                className={cn(
                    'absolute top-1/2 -translate-y-1/2 right-3 md:right-6 z-10',
                    'p-2 rounded-full bg-white shadow hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-indigo-300'
                )}
            >
                <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>

            <div className="flex justify-center mt-4 gap-2">
                {items.map((_, i) => (
                    <button
                        key={i}
                        aria-label={`Ir para slide ${i + 1}`}
                        onClick={() => slider.current?.moveToIdx(i)}
                        className={cn(
                            'w-2.5 h-2.5 rounded-full transition-colors duration-300',
                            i === current
                                ? 'bg-indigo-600'
                                : 'bg-gray-300 hover:bg-gray-400',
                            'focus:outline-none focus:ring-2 focus:ring-indigo-300'
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
