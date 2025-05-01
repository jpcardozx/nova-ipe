'use client';

import React, {
    useRef,
    useState,
    useEffect,
    useCallback,
    KeyboardEvent,
} from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import {
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Loader2,
    AlertTriangle,
} from 'lucide-react';
import { getImovelEmDestaque } from '@/lib/sanity/fetchImoveis';
import ImovelCard from '@/app/components/ImovelCard';
import type { ImovelExtended } from '@/src/types/imovel-extended';
import type { OptimizedCarouselProps } from '@/app/components/OptimizedCarousel';
import { cn } from '@/src/lib/utils';

// Dynamic import tipado para ImovelExtended
const OptimizedCarousel = dynamic<OptimizedCarouselProps<ImovelExtended>>(
    () =>
        import('@/app/components/OptimizedCarousel').then(
            (mod) => mod.OptimizedCarousel
        ),
    { ssr: false, loading: () => <CarouselSkeleton /> }
);

const CACHE_KEY = 'destaques-venda';
const OBSERVER_OPTIONS = {
    triggerOnce: true,
    rootMargin: '200px 0px',
    threshold: 0.15,
};

export default function SecaoImoveisAVenda() {
    // refs e inView
    const sectionRef = useRef<HTMLElement>(null);
    const { ref: inViewRef, inView } = useInView(OBSERVER_OPTIONS);
    const setRefs = (el: HTMLElement) => {
        sectionRef.current = el;
        inViewRef(el);
    };

    // estado de dados
    const [imoveis, setImoveis] = useState<ImovelExtended[]>([]);
    const [status, setStatus] = useState<'loading' | 'success' | 'empty' | 'error'>('loading');
    const [retryCount, setRetryCount] = useState(0);

    // refs dos botões
    const navPrevRef = useRef<HTMLButtonElement>(null);
    const navNextRef = useRef<HTMLButtonElement>(null);

    // fetch + cache
    const fetchDestaques = useCallback(async () => {
        setStatus('loading');
        try {
            const cache = sessionStorage.getItem(CACHE_KEY);
            if (cache) {
                const { data, timestamp } = JSON.parse(cache);
                if (Date.now() - timestamp < 300_000) {
                    setImoveis(data);
                    return setStatus(data.length ? 'success' : 'empty');
                }
            }
            performance.mark('destaques-fetch-start');
            const data = await getImovelEmDestaque();
            performance.mark('destaques-fetch-end');
            performance.measure(
                'destaques-fetch-duration',
                'destaques-fetch-start',
                'destaques-fetch-end'
            );

            setImoveis(data);
            setStatus(data.length ? 'success' : 'empty');
            sessionStorage.setItem(
                CACHE_KEY,
                JSON.stringify({ data, timestamp: Date.now() })
            );
        } catch (err) {
            console.error(err);
            setStatus('error');
            if (typeof window !== 'undefined' && window.dataLayer) {
                window.dataLayer.push({
                    event: 'destaques-fetch-error',
                    message: (err as Error).message,
                });
            }
        }
    }, [retryCount]);

    // dispara fetch quando entra em view
    useEffect(() => {
        if (inView) fetchDestaques();
    }, [inView, fetchDestaques]);

    // retry handler
    const handleRetry = () => setRetryCount((c) => c + 1);

    // navegação por teclado
    const handleKeyNav = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'ArrowLeft') navPrevRef.current?.click();
        if (e.key === 'ArrowRight') navNextRef.current?.click();
    };

    return (
        <section
            ref={setRefs}
            tabIndex={0}
            onKeyDown={handleKeyNav}
            aria-labelledby="destaques-venda-heading"
            className="relative py-16 md:py-24 bg-gradient-luxury text-stone-900 overflow-hidden focus:outline-none"
        >
            {/* padrões de fundo */}
            <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
                <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-pattern-dots" />
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-pattern-lines" />
            </div>

            <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* cabeçalho */}
                <header
                    id="destaques-venda-heading"
                    className="text-center mb-12 md:mb-16 max-w-3xl mx-auto"
                >
                    <div className="inline-flex items-center mb-3 px-4 py-1.5 border border-amber-200 bg-amber-50 text-amber-800 rounded-full text-sm font-medium">
                        <span className="block h-2 w-2 rounded-full bg-amber-500 mr-2" />
                        Seleção Premium
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium tracking-tight mb-4">
                        Imóveis em <span className="text-amber-700 font-bold">destaque</span> à venda
                    </h2>
                    <p className="text-stone-600 text-lg max-w-2xl mx-auto">
                        Selecionados pela equipe Ipê por seu{' '}
                        <strong className="text-stone-800">potencial de valorização</strong>, localização e
                        simbologia única.
                    </p>
                </header>

                {/* estados */}
                {status === 'loading' && <CarouselSkeleton />}
                {status === 'error' && <ErrorState onRetry={handleRetry} />}
                {status === 'empty' && <EmptyState />}

                {/* carrossel */}
                {status === 'success' && imoveis.length > 0 && (
                    <div className="relative">
                        <OptimizedCarousel
                            items={imoveis}
                            getKey={(i) => i._id}
                            renderItem={(i) => <ImovelCard imovel={i} finalidade="Venda" />}
                            prevRef={navPrevRef}
                            nextRef={navNextRef}
                            options={{
                                slidesPerView: 1.1,
                                spacing: 24,
                                loop: true,
                                breakpoints: {
                                    '(min-width: 768px)': { slidesPerView: 2.2, spacing: 24 },
                                    '(min-width: 1024px)': { slidesPerView: 3, spacing: 24 },
                                },
                            }}
                        />

                        {/* botões */}
                        <button
                            ref={navPrevRef}
                            aria-label="Slide anterior"
                            className={cn(
                                'absolute top-1/2 -translate-y-1/2 left-3 md:left-6 z-10',
                                'p-2 rounded-full bg-white shadow hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-amber-600'
                            )}
                        >
                            <ChevronLeft className="w-5 h-5 text-stone-700" />
                        </button>
                        <button
                            ref={navNextRef}
                            aria-label="Próximo slide"
                            className={cn(
                                'absolute top-1/2 -translate-y-1/2 right-3 md:right-6 z-10',
                                'p-2 rounded-full bg-white shadow hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-amber-600'
                            )}
                        >
                            <ChevronRight className="w-5 h-5 text-stone-700" />
                        </button>

                        {/* CTA */}
                        <div className="mt-12 text-center">
                            <Link
                                href="/imoveis/comprar"
                                className="inline-flex items-center gap-2 px-6 py-3 font-medium text-white bg-amber-700 rounded-full shadow hover:bg-amber-800 transition"
                            >
                                Ver todos os imóveis à venda
                                <ExternalLink className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

// --------------- Skeleton ---------------
function CarouselSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-pulse">
            {Array(3)
                .fill(0)
                .map((_, idx) => (
                    <div key={idx} className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="aspect-[4/3] bg-stone-200" />
                        <div className="p-4 space-y-3">
                            <div className="h-5 w-3/4 bg-stone-300 rounded" />
                            <div className="h-4 w-1/2 bg-stone-200 rounded" />
                            <div className="h-8 w-1/3 bg-stone-300 rounded mt-2" />
                        </div>
                    </div>
                ))}
        </div>
    );
}

// --------------- Error ---------------
function ErrorState({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="max-w-md mx-auto bg-white border border-stone-200 rounded-lg p-8 text-center shadow">
            <AlertTriangle className="w-12 h-12 text-amber-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Ops! Falha ao carregar</h3>
            <p className="text-stone-600 mb-4">Tente novamente em instantes.</p>
            <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-5 py-2 rounded bg-amber-700 text-white font-medium hover:bg-amber-800 transition"
            >
                <Loader2 className="w-4 h-4 animate-spin" />
                Recarregar
            </button>
        </div>
    );
}

// --------------- Empty ---------------
function EmptyState() {
    return (
        <div className="max-w-md mx-auto bg-stone-50 border border-stone-200 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Sem imóveis em destaque</h3>
            <p className="text-stone-600 mb-4">Nosso portfólio está sendo atualizado.</p>
            <Link href="/imoveis/comprar" className="text-amber-700 hover:underline font-medium">
                Ver todos os imóveis disponíveis
            </Link>
        </div>
    );
}
