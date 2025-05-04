'use client'

import React, { useState, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import {
    motion,
    AnimatePresence,
    useMotionValue,
    useTransform,
    useSpring,
} from 'framer-motion';
import Link from 'next/link';
import {
    MapPin,
    ArrowRight,
    BedDouble,
    Bath,
    Car,
    Ruler,
    ChevronLeft,
    ChevronRight,
    Heart,
    Share2,
} from 'lucide-react';
import { cn, formatarMoeda } from '@/lib/utils';
import SanityImage from '@components/SanityImage';
import type { ImovelClient } from '@/types/imovel-client';

// Caso seu utils não exporte formatarArea, definimos aqui
const formatarArea = (m2: number): string => `${m2.toLocaleString()} m²`;

type BadgeVariant = 'primary' | 'secondary' | 'outline';
interface BadgeProps {
    variant?: BadgeVariant;
    className?: string;
    children: React.ReactNode;
}
const Badge: FC<BadgeProps> = ({ variant = 'primary', className, children }) => {
    const variantStyles: Record<BadgeVariant, string> = {
        primary: 'bg-amber-600 text-white',
        secondary: 'bg-rose-600 text-white',
        outline: 'bg-white/90 text-amber-700 border border-amber-200',
    };
    return (
        <div
            className={cn(
                'px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1',
                'shadow-sm backdrop-blur-sm transition-all duration-300',
                variantStyles[variant],
                className
            )}
        >
            {children}
        </div>
    );
};

interface FeatureProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}
const Feature: FC<FeatureProps> = ({ icon, label, value }) => (
    <div className="flex items-center gap-2.5 group">
        <div className="p-2 bg-amber-50 rounded-lg text-amber-700 transition-all group-hover:bg-amber-100">
            {icon}
        </div>
        <div>
            <span className="block text-xs text-stone-500">{label}</span>
            <span className="font-medium text-stone-800">{value}</span>
        </div>
    </div>
);

interface NavButtonProps {
    direction?: 'next' | 'prev';
    onClick: () => void;
    disabled?: boolean;
}
const NavButton: FC<NavButtonProps> = ({ direction = 'next', onClick, disabled = false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
            'p-3 rounded-full bg-white shadow-md',
            'transition-all duration-300 ease-out',
            'border border-stone-100',
            disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-amber-50 hover:border-amber-200 hover:shadow-lg',
            'focus:outline-none focus:ring-2 focus:ring-amber-500/50'
        )}
        aria-label={direction === 'next' ? 'Próximo imóvel' : 'Imóvel anterior'}
    >
        {direction === 'next' ? (
            <ChevronRight className="w-5 h-5 text-stone-700" />
        ) : (
            <ChevronLeft className="w-5 h-5 text-stone-700" />
        )}
    </button>
);

// Hook de favoritos tipado
function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const saved = localStorage.getItem('imoveis-favoritos');
        if (saved) setFavorites(JSON.parse(saved));
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        localStorage.setItem('imoveis-favoritos', JSON.stringify(favorites));
    }, [favorites]);

    const isFavorite = (id: string) => favorites.includes(id);
    const toggleFavorite = (id: string) => {
        setFavorites((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    return { isFavorite, toggleFavorite };
}

interface ImovelMiniCardProps {
    imovel: ImovelClient;
    isActive: boolean;
    onClick: () => void;
    onFavoriteToggle: () => void;
    isFavorite: boolean;
}
const ImovelMiniCard: FC<ImovelMiniCardProps> = ({ imovel, isActive, onClick, isFavorite, onFavoriteToggle }) => (
    <motion.div
        className={cn(
            'overflow-hidden rounded-xl cursor-pointer transition-all duration-300 ease-out border-2 shadow-md bg-white group',
            isActive ? 'border-amber-500 scale-[1.03]' : 'border-stone-100 hover:border-amber-200'
        )}
        onClick={onClick}
        whileHover={{ y: -5 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
    >
        <div className="relative aspect-[5/4]">
            <SanityImage
                image={imovel.imagem}
                alt={imovel.titulo || 'Imóvel'}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-all duration-500 group-hover:scale-105"
                aspectRatio="5/4"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-3 left-3">
                <Badge variant="primary">Destaque</Badge>
            </div>
            <button
                className="absolute top-3 right-3 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all"
                onClick={(e) => {
                    e.stopPropagation();
                    onFavoriteToggle();
                }}
                aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
                <Heart className={cn('w-4 h-4 transition-colors', isFavorite ? 'fill-red-500 text-red-500' : 'text-stone-700')} />
            </button>
            <div className="absolute bottom-3 left-3 right-3">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2.5 shadow-md">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold text-amber-700 truncate">{formatarMoeda(imovel.preco)}</p>
                        <div className="flex items-center space-x-2.5 text-xs text-stone-600">
                            {imovel.dormitorios && (<span className="flex items-center"><BedDouble className="w-3 h-3 mr-1" />{imovel.dormitorios}</span>)}
                            {imovel.banheiros && (<span className="flex items-center"><Bath className="w-3 h-3 mr-1" />{imovel.banheiros}</span>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
);

interface ImovelHeroProps {
    imovel: ImovelClient;
    isFavorite: boolean;
    onFavoriteToggle: () => void;
    onShare: () => void;
}
const ImovelHero: FC<ImovelHeroProps> = ({ imovel, isFavorite, onFavoriteToggle, onShare }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [2, -2]);
    const rotateY = useTransform(x, [-100, 100], [-2, 2]);
    const springConfig = { damping: 30, stiffness: 200 };
    const springRotateX = useSpring(rotateX, springConfig);
    const springRotateY = useSpring(rotateY, springConfig);

    return (
        <motion.div
            className="bg-white rounded-2xl overflow-hidden shadow-xl border border-stone-100"
            style={{ perspective: 1200 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                x.set(e.clientX - (rect.left + rect.width / 2));
                y.set(e.clientY - (rect.top + rect.height / 2));
            }}
            onMouseLeave={() => { x.set(0); y.set(0); }}
        >
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2"
                style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: 'preserve-3d' }}
            >
                <div className="relative h-80 md:h-auto">
                    <SanityImage
                        image={imovel.imagem}
                        alt={imovel.titulo || 'Imóvel em destaque'}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                        className="object-cover transition-all duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute top-5 left-5 flex flex-col space-y-2">
                        <Badge variant="primary">Destaque da semana</Badge>
                        {imovel.status === undefined && <Badge variant="secondary">Lançamento</Badge>}
                    </div>
                    <div className="absolute top-5 right-5 flex space-x-2">
                        <button onClick={onFavoriteToggle} className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all" aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}>
                            <Heart className={cn('w-5 h-5 transition', isFavorite ? 'fill-red-500 text-red-500' : 'text-stone-700')} />
                        </button>
                        <button onClick={onShare} className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all" aria-label="Compartilhar">
                            <Share2 className="w-5 h-5 text-stone-700" />
                        </button>
                    </div>
                </div>
                <div className="p-7 md:p-8 flex flex-col relative">
                    <div className="mb-5">
                        <div className="flex items-center text-amber-600 text-sm font-medium mb-2">
                            <Badge variant="outline" className="mr-2">{imovel.finalidade}</Badge>
                            {imovel.categoria?.titulo}
                        </div>
                        <h2 className="text-2xl font-serif font-medium text-stone-900 mb-3 leading-tight">
                            {imovel.titulo}
                        </h2>
                        <div className="flex items-center text-stone-600 mb-4">
                            <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0 text-amber-600" />
                            <span className="text-sm">
                                {[imovel.endereco, imovel.bairro, imovel.cidade].filter(Boolean).join(', ')}
                            </span>
                        </div>
                    </div>
                    <div className="mb-6">
                        <div className="text-sm text-stone-500 mb-1">Valor</div>
                        <div className="text-3xl font-bold text-amber-700">{formatarMoeda(imovel.preco)}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {imovel.areaUtil && <Feature icon={<Ruler className="w-4 h-4" />} label="Área total" value={formatarArea(imovel.areaUtil)} />}
                        {imovel.dormitorios && <Feature icon={<BedDouble className="w-4 h-4" />} label="Dormitórios" value={imovel.dormitorios} />}
                        {imovel.banheiros && <Feature icon={<Bath className="w-4 h-4" />} label="Banheiros" value={imovel.banheiros} />}
                        {imovel.vagas && <Feature icon={<Car className="w-4 h-4" />} label="Vagas" value={imovel.vagas} />}
                    </div>
                    {imovel.descricao && <div className="mb-6"><p className="text-stone-700 line-clamp-3">{imovel.descricao}</p></div>}
                    <div className="mt-auto">
                        <Link href={`/imovel/${imovel.slug}`} className="group flex justify-between items-center w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white p-4 rounded-xl transition-all duration-300 ease-out shadow-md hover:shadow-lg">
                            <span className="font-medium">Ver todos os detalhes</span>
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30">
                                <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const DestaquesVendaSection: FC = () => {
    const [imoveis, setImoveis] = useState<ImovelClient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const { isFavorite, toggleFavorite } = useFavorites();
    const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '200px' });

    useEffect(() => {
        if (inView && isLoading) fetchImoveis();
    }, [inView]);

    const fetchImoveis = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/destaques');
            if (!res.ok) throw new Error(`Status: ${res.status}`);
            const data: ImovelClient[] = await res.json();
            const vendas = data.filter(i => i.finalidade === 'Venda' && (!i.status || i.status === 'disponivel'));
            setImoveis(vendas);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setIsLoading(false);
        }
    };

    const next = () => setActiveIndex(i => (i + 1) % imoveis.length);
    const prev = () => setActiveIndex(i => (i - 1 + imoveis.length) % imoveis.length);

    if (isLoading) {
        return (
            <div ref={ref} className="py-20 flex items-center justify-center">
                <div className="text-center space-y-4 animate-pulse">
                    <div className="inline-block w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-stone-600">Buscando imóveis exclusivos para você...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div ref={ref} className="py-16">
                <div className="max-w-md mx-auto text-center p-8 bg-white rounded-xl shadow-lg border border-red-100">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-stone-900 mb-2">Não foi possível carregar os imóveis</h3>
                    <p className="text-stone-600 mb-5">{error}</p>
                    <button onClick={fetchImoveis} className="px-5 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition shadow-md">Tentar novamente</button>
                </div>
            </div>
        );
    }

    if (imoveis.length === 0) {
        return (
            <div ref={ref} className="py-16">
                <div className="max-w-md mx-auto text-center p-8 bg-white rounded-xl shadow-lg border border-amber-100">
                    <div className="w-16 h-16 mx-auto mb-4 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-stone-900 mb-2">Nenhum imóvel em destaque</h3>
                    <p className="text-stone-600 mb-5">Por favor, volte mais tarde.</p>
                    <Link href="/imoveis" className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-lg hover:from-amber-700 hover:to-amber-600 transition shadow-md">
                        Ver todos os imóveis
                    </Link>
                </div>
            </div>
        );
    }

    const destaque = imoveis[activeIndex];
    const share = (i: ImovelClient) => {
        const url = `${window.location.origin}/imovel/${i.slug}`;
        navigator.share?.({ title: i.titulo, text: `Confira: ${i.titulo}`, url })
            .catch(() => navigator.clipboard.writeText(url));
    };

    return (
        <section ref={ref} className="py-24 relative bg-gradient-to-b from-stone-50 to-white">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/texture-elegant.png')]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-3 relative">
                        <span className="absolute -top-6 -left-4 text-4xl text-amber-400 opacity-50">"</span>
                        Imóveis Premium em Destaque
                        <span className="absolute -bottom-6 -right-4 text-4xl text-amber-400 opacity-50">"</span>
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-300 mx-auto my-6 rounded-full" />
                    <p className="text-stone-600 max-w-2xl mx-auto">
                        Selecionamos cuidadosamente as propriedades mais impressionantes para você.
                    </p>
                </div>

                <div className="mb-16">
                    <AnimatePresence mode="wait">
                        <ImovelHero
                            key={destaque._id}
                            imovel={destaque}
                            isFavorite={isFavorite(destaque._id)}
                            onFavoriteToggle={() => toggleFavorite(destaque._id)}
                            onShare={() => share(destaque)}
                        />
                    </AnimatePresence>
                </div>

                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-serif text-stone-800 relative pl-3 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-full before:w-1 before:bg-amber-500 before:rounded-full">
                        Mais opções exclusivas para você
                    </h3>
                    {imoveis.length > 1 && (
                        <div className="flex space-x-3">
                            <NavButton direction="prev" onClick={prev} disabled={imoveis.length <= 1} />
                            <NavButton direction="next" onClick={next} disabled={imoveis.length <= 1} />
                        </div>
                    )}
                </div>

                {imoveis.length > 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
                        {imoveis.map((i, idx) => (
                            <ImovelMiniCard
                                key={i._id}
                                imovel={i}
                                isActive={idx === activeIndex}
                                onClick={() => setActiveIndex(idx)}
                                isFavorite={isFavorite(i._id)}
                                onFavoriteToggle={() => toggleFavorite(i._id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default DestaquesVendaSection;
