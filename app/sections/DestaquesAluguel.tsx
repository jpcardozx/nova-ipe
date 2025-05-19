'use client'

import React, { useState, useEffect, FC, useCallback } from 'react';
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
    Home as HomeIcon,
} from 'lucide-react';
import { cn, formatarMoeda } from '@/lib/utils';
import SanityImage from '@components/SanityImage';
import type { ImovelClient } from '@/types/imovel-client';

// ---- Helpers ----
const formatarArea = (m2?: number): string => m2 != null ? `${m2.toLocaleString()} m²` : '';

// ---- Badge ----
interface BadgeProps {
    variant?: 'primary' | 'secondary';
    className?: string;
    children: React.ReactNode;
}
const Badge: FC<BadgeProps> = ({ variant = 'primary', children, className }) => {
    const base = 'px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 transition';
    const styles = {
        primary: 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md hover:shadow-lg',
        secondary: 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white shadow-md hover:shadow-lg',
    };
    return <span className={cn(base, styles[variant], className)}>{children}</span>;
};

// ---- Feature ----
interface FeatureProps {
    icon: React.ReactNode;
    label: string;
    value?: string | number;
}
const Feature: FC<FeatureProps> = ({ icon, label, value }) => {
    if (value == null) return null;
    return (
        <motion.div whileHover={{ scale: 1.03 }} className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 rounded-md text-amber-700 transition-colors">
                {icon}
            </div>
            <div>
                <div className="text-xs uppercase text-stone-400">{label}</div>
                <div className="text-sm font-medium text-stone-900">{value}</div>
            </div>
        </motion.div>
    );
};

// ---- Navigation Buttons ----
interface NavButtonProps {
    direction: 'prev' | 'next';
    onClick: () => void;
    disabled?: boolean;
}
const NavButton: FC<NavButtonProps> = ({ direction, onClick, disabled }) => (
    <motion.button
        onClick={onClick}
        disabled={disabled}
        whileHover={{ scale: disabled ? 1 : 1.1 }}
        className={cn(
            'p-3 rounded-full bg-white border shadow-sm transition-colors',
            disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-amber-50 hover:border-amber-200'
        )}
        aria-label={direction === 'prev' ? 'Imóvel anterior' : 'Próximo imóvel'}
    >
        {direction === 'prev' ? <ChevronLeft /> : <ChevronRight />}
    </motion.button>
);

// ---- Favorites Hook ----
function useFavorites() {
    const [favIds, setFavIds] = useState<string[]>([]);
    useEffect(() => {
        try {
            const stored = localStorage.getItem('imoveis-fav');
            if (stored) setFavIds(JSON.parse(stored));
        } catch { }
    }, []);
    useEffect(() => {
        try {
            localStorage.setItem('imoveis-fav', JSON.stringify(favIds));
        } catch { }
    }, [favIds]);
    const isFav = useCallback((id: string) => favIds.includes(id), [favIds]);
    const toggleFav = useCallback((id: string) => {
        setFavIds(ids => ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]);
    }, []);
    return { isFav, toggleFav };
}

// ---- Mini Card ----
interface MiniCardProps {
    imovel: ImovelClient;
    isActive: boolean;
    onClick: () => void;
    isFav: boolean;
    toggleFav: () => void;
}
const ImovelMiniCard: FC<MiniCardProps> = ({ imovel, isActive, onClick, isFav, toggleFav }) => (
    <motion.div
        onClick={onClick}
        whileHover={{ scale: isActive ? 1 : 1.03 }}
        className={cn(
            'rounded-xl overflow-hidden cursor-pointer transition-transform border bg-white',
            isActive ? 'scale-105 border-4 border-gradient-to-br from-amber-400 to-rose-500 shadow-lg' : 'border-stone-200'
        )}
    >
        <div className="relative h-36">
            <SanityImage image={imovel.imagem} alt={imovel.titulo} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/30" />
            <Badge variant="primary" className="absolute top-2 left-2">Aluguel</Badge>
            <button onClick={e => { e.stopPropagation(); toggleFav(); }} className="absolute top-2 right-2 p-1 bg-white rounded-full shadow">
                <Heart className={cn('w-5 h-5 transition-colors', isFav ? 'fill-red-500 text-red-500' : 'text-gray-800')} />
            </button>
        </div>        <div className="p-3 bg-white">
            <h3 className="text-sm font-semibold text-stone-900 truncate mb-1">{imovel.titulo}</h3>
            <div className="text-sm text-amber-600 font-bold">{imovel.preco ? formatarMoeda(imovel.preco) : 'Sob consulta'}/mês</div>
        </div>
    </motion.div>
);

// ---- Hero Card ----
interface HeroProps {
    imovel: ImovelClient;
    isFav: boolean;
    toggleFav: () => void;
    share: () => void;
}
const ImovelHero: FC<HeroProps> = ({ imovel, isFav, toggleFav, share }) => {
    const x = useMotionValue(0), y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [5, -5]);
    const rotateY = useTransform(x, [-100, 100], [-5, 5]);
    const sX = useSpring(rotateX, { damping: 20, stiffness: 150 });
    const sY = useSpring(rotateY, { damping: 20, stiffness: 150 });

    return (
        <motion.div
            style={{ perspective: 1000 }}
            onMouseMove={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                x.set(e.clientX - (rect.left + rect.width / 2));
                y.set(e.clientY - (rect.top + rect.height / 2));
            }}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl p-1 bg-gradient-to-br from-amber-400 to-rose-500 shadow-2xl max-w-4xl mx-auto"
        >
            <motion.div style={{ rotateX: sX, rotateY: sY }} className="bg-white rounded-3xl overflow-hidden">
                <div className="relative h-64">
                    <SanityImage image={imovel.imagem} alt={imovel.titulo} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 left-4">
                        <Badge variant="secondary">Destaque</Badge>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                        <button onClick={toggleFav} className="p-2 bg-white rounded-full shadow hover:bg-white/90">
                            <Heart className={cn('w-5 h-5', isFav ? 'fill-red-500 text-red-500' : 'text-gray-800')} />
                        </button>
                        <button onClick={share} className="p-2 bg-white rounded-full shadow hover:bg-white/90">
                            <Share2 className="w-5 h-5 text-gray-800" />
                        </button>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <h2 className="text-3xl font-serif text-amber-600">{imovel.titulo}</h2>
                    <div className="flex items-center gap-3 text-stone-600">
                        <MapPin /><span>{[imovel.bairro, imovel.cidade].filter(Boolean).join(', ')}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <Feature icon={<Ruler />} label="Área" value={formatarArea(imovel.areaUtil)} />
                        <Feature icon={<BedDouble />} label="Dorms" value={imovel.dormitorios} />
                        <Feature icon={<Bath />} label="Banheiros" value={imovel.banheiros} />
                        <Feature icon={<Car />} label="Vagas" value={imovel.vagas} />
                    </div>
                    <Link
                        href={`/imovel/${imovel.slug}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-shadow shadow-md"
                    >
                        Ver detalhes <ArrowRight />
                    </Link>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ---- Main Section ----
const DestaquesAluguelSection: FC = () => {
    const { isFav, toggleFav } = useFavorites();
    const [imoveis, setImoveis] = useState<ImovelClient[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '200px' });

    useEffect(() => {
        if (inView && loading) {
            fetch('/api/destaques?finalidade=Aluguel')
                .then(res => res.json())
                .then(data => setImoveis(data))
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [inView]);

    const next = useCallback(() => setActiveIndex(i => (i + 1) % imoveis.length), [imoveis]);
    const prev = useCallback(() => setActiveIndex(i => (i - 1 + imoveis.length) % imoveis.length), [imoveis]);
    const share = useCallback((imovel: ImovelClient) => {
        if ('clipboard' in navigator) {
            (navigator as any).clipboard.writeText(window.location.href);
        }
    }, []);

    if (loading) return <div ref={ref} className="py-20 text-center">Loading...</div>;
    if (error) return <div ref={ref} className="py-20 text-center text-red-500">Error: {error}</div>;
    if (!imoveis.length) return <div ref={ref} className="py-20 text-center">Nenhum imóvel encontrado.</div>;

    const destaque = imoveis[activeIndex];

    return (
        <section ref={ref} className="py-24 bg-stone-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                <ImovelHero imovel={destaque} isFav={isFav(destaque._id)} toggleFav={() => toggleFav(destaque._id)} share={() => share(destaque)} />

                <div className="flex justify-between items-center">
                    <NavButton direction="prev" onClick={prev} disabled={imoveis.length < 2} />
                    <NavButton direction="next" onClick={next} disabled={imoveis.length < 2} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {imoveis.map((m, idx) => (
                        <ImovelMiniCard
                            key={m._id}
                            imovel={m}
                            isActive={idx === activeIndex}
                            onClick={() => setActiveIndex(idx)}
                            isFav={isFav(m._id)}
                            toggleFav={() => toggleFav(m._id)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DestaquesAluguelSection;
