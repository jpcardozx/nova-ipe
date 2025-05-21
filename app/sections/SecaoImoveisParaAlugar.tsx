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
import { ChevronLeft, ChevronRight, ExternalLink, Loader2, AlertTriangle } from 'lucide-react';
import { getImoveisParaAlugar } from '@lib/sanity/fetchImoveis';
import ImovelCard from '@components/ImovelCard';
import type { ImovelClient as Imovel } from '@/types/imovel-client';
import type { OptimizedCarouselProps } from '@/app/components/ui/OptimizedCarousel';
import { cn } from '@/lib/utils';

const OptimizedCarousel = dynamic(
    () => import('@/app/components/ui/OptimizedCarousel').then((mod) => mod.OptimizedCarousel as React.ComponentType<OptimizedCarouselProps<Imovel>>),
    { ssr: false, loading: () => <CarouselSkeleton /> }
);

function useDestaquesAluguel(staleTime = 300_000) {
    const [data, setData] = useState<Imovel[]>([]);
    const [status, setStatus] = useState<'loading' | 'success' | 'empty' | 'error'>('loading');
    const [retry, setRetry] = useState(0);

    const fetchData = useCallback(async () => {
        setStatus('loading');
        try {
            const cacheKey = 'destaques-aluguel';
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
                const { data: d, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < staleTime) {
                    setData(d);
                    return setStatus(d.length ? 'success' : 'empty');
                }
            }
            const d = await getImoveisParaAlugar();
            setData(d);
            setStatus(d.length ? 'success' : 'empty');
            sessionStorage.setItem(cacheKey, JSON.stringify({ data: d, timestamp: Date.now() }));
        } catch {
            setStatus('error');
        }
    }, [staleTime, retry]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, status, refetch: () => setRetry((c) => c + 1) };
}

function SectionWrapper({
    title,
    subtitle,
    description,
    children,
}: {
    title: string;
    subtitle: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <section className="relative py-16 bg-gradient-aluguel overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-pattern-dots bg-pattern-lines" />
            <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-12 text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center mb-3 px-4 py-1.5 border border-blue-200 bg-blue-50 text-blue-800 rounded-full text-sm font-medium">
                        {subtitle}
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium tracking-tight mb-4">
                        {title}
                    </h2>
                    <p className="text-stone-600 text-lg">{description}</p>
                </header>
                {children}
            </div>
        </section>
    );
}

function SectionState({
    status,
    onRetry,
    emptyLink,
}: {
    status: 'loading' | 'empty' | 'error';
    onRetry: () => void;
    emptyLink: string;
}) {
    if (status === 'loading') return <CarouselSkeleton />;
    if (status === 'error') {
        return (
            <div className="max-w-md mx-auto bg-white border border-stone-200 rounded-lg p-8 text-center shadow-md">
                <AlertTriangle className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Erro ao carregar</h3>
                <p className="text-stone-600 mb-4">Tente novamente.</p>
                <button
                    onClick={onRetry}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition"
                >
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Recarregar
                </button>
            </div>
        );
    }
    // empty
    return (
        <div className="max-w-md mx-auto bg-stone-50 border border-stone-200 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Nenhum imóvel</h3>
            <p className="text-stone-600 mb-4">Em breve teremos novidades.</p>
            <Link href={emptyLink} className="text-blue-700 hover:underline font-medium">
                Ver todos
            </Link>
        </div>
    );
}

function CarouselSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-stone-200 rounded-lg overflow-hidden">
                    <div className="aspect-[4/3] bg-gradient-to-br from-stone-200 to-stone-300" />
                    <div className="p-4 space-y-2">
                        <div className="h-6 bg-stone-300 rounded" />
                        <div className="h-4 bg-stone-300 rounded w-3/4" />
                        <div className="flex gap-2">
                            <div className="h-8 bg-stone-300 rounded w-1/2" />
                            <div className="h-8 bg-stone-300 rounded w-1/2" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function SecaoImoveisParaAlugar() {
    const { data, status, refetch } = useDestaquesAluguel();
    const { ref: sectionRef } = useInView({ triggerOnce: true, rootMargin: '200px', threshold: 0.1 });
    const navPrevRef = useRef<HTMLButtonElement>(null);
    const navNextRef = useRef<HTMLButtonElement>(null);

    const handleKeyNav = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'ArrowLeft') navPrevRef.current?.click();
        if (e.key === 'ArrowRight') navNextRef.current?.click();
    };

    return (
        <SectionWrapper
            title="Imóveis para aluguel"
            subtitle="Aluguel Curado"
            description="Espaços selecionados por custo-benefício, localização e simbologia urbana."
        >
            <div ref={sectionRef} tabIndex={0} onKeyDown={handleKeyNav}>
                {status !== 'success' && (
                    <SectionState status={status} onRetry={refetch} emptyLink="/imoveis/alugar" />
                )}

                {status === 'success' && data.length > 0 && (
                    <>                        <OptimizedCarousel
                        items={data}
                        getKey={(i: Imovel) => i._id}
                        renderItem={(i: Imovel) => <ImovelCard imovel={i} finalidade="Aluguel" />}
                        prevRef={navPrevRef}
                        nextRef={navNextRef} options={{
                            slidesToShow: 1.1,
                            spacing: 24,
                            loop: true,
                            breakpoints: {
                                '(min-width: 768px)': { slidesToShow: 2.2, spacing: 24 },
                                '(min-width: 1024px)': { slidesToShow: 3, spacing: 24 },
                            },
                        }}
                        className="overflow-visible"
                    />

                        <button
                            ref={navPrevRef}
                            aria-label="Slide anterior"
                            className={cn(
                                'absolute top-1/2 left-4 -translate-y-1/2 p-2 rounded-full bg-white shadow-lg',
                                'hover:scale-110 transition focus:outline-none focus:ring-2 focus:ring-blue-300'
                            )}
                        >
                            <ChevronLeft className="w-6 h-6 text-blue-700" />
                        </button>
                        <button
                            ref={navNextRef}
                            aria-label="Próximo slide"
                            className={cn(
                                'absolute top-1/2 right-4 -translate-y-1/2 p-2 rounded-full bg-white shadow-lg',
                                'hover:scale-110 transition focus:outline-none focus:ring-2 focus:ring-blue-300'
                            )}
                        >
                            <ChevronRight className="w-6 h-6 text-blue-700" />
                        </button>

                        <div className="mt-12 text-center">
                            <Link
                                href="/imoveis/alugar"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-full shadow hover:bg-blue-800 transition"
                            >
                                Ver todos os imóveis para alugar
                                <ExternalLink className="w-4 h-4" />
                            </Link>
                        </div>
                    </>
                )}
            </div>

            <style>{`
        .bg-gradient-aluguel {
          background: linear-gradient(180deg, #F8FAFC 0%, #EFF4F9 100%);
        }
      `}</style>
        </SectionWrapper>
    );
}
