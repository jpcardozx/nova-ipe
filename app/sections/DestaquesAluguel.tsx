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
import type { ImovelClient } from '../../src/types/imovel-client';
import PropertyCardUnified from '@/app/components/ui/property/PropertyCardUnified';

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
        primary: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg',
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
    if (!value) return null;
    return (
        <motion.div
            className="flex items-center gap-3 border-white/20 p-2 rounded-lg text-white"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            <div className="bg-white/20 p-2.5 rounded-lg">
                {icon}
            </div>
            <div>
                <div className="text-xs uppercase text-white/80">{label}</div>
                <div className="text-sm font-medium text-white">{value}</div>
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
            disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-blue-50 hover:border-blue-200'
        )}
        aria-label={direction === 'prev' ? 'Imóvel anterior' : 'Próximo imóvel'}
    >
        {direction === 'prev' ? <ChevronLeft /> : <ChevronRight />}
    </motion.button>
);

// ---- Favorites Hook ----
function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        try {
            const savedFavorites = localStorage.getItem('property-favorites') || '[]';
            setFavorites(JSON.parse(savedFavorites));
        } catch (error) {
            console.error('Erro ao carregar favoritos:', error);
            setFavorites([]);
        }
    }, []);

    const isFav = useCallback((id: string) => favorites.includes(id), [favorites]);

    const toggleFav = useCallback((id: string) => {
        const newFavorites = [...favorites];
        const index = newFavorites.indexOf(id);

        if (index > -1) {
            newFavorites.splice(index, 1);
        } else {
            newFavorites.push(id);
        }

        setFavorites(newFavorites);
        localStorage.setItem('property-favorites', JSON.stringify(newFavorites));
    }, [favorites]);

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
            className="rounded-3xl overflow-hidden shadow-xl"
        >
            <motion.div
                style={{ rotateX: sX, rotateY: sY }}
                className="grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-blue-600 to-blue-800"
            >
                <div className="relative h-64 lg:h-full">
                    <SanityImage image={imovel.imagem} alt={imovel.titulo} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 left-4">
                        <Badge variant="primary">Destaque</Badge>
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
                <div className="p-6 space-y-4 text-white">
                    <h2 className="text-3xl font-bold">{imovel.titulo}</h2>
                    <div className="flex items-center gap-3">
                        <MapPin className="opacity-80" />
                        <span>{[imovel.bairro, imovel.cidade].filter(Boolean).join(', ')}</span>
                    </div>

                    <div className="text-2xl font-semibold text-white">
                        {imovel.preco ? formatarMoeda(imovel.preco) : 'Sob consulta'}/mês
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                        {imovel.areaUtil && <Feature icon={<Ruler className="h-5 w-5" />} label="Área" value={formatarArea(imovel.areaUtil)} />}
                        {imovel.dormitorios && <Feature icon={<BedDouble className="h-5 w-5" />} label="Dormitórios" value={imovel.dormitorios} />}
                        {imovel.banheiros && <Feature icon={<Bath className="h-5 w-5" />} label="Banheiros" value={imovel.banheiros} />}
                        {imovel.vagas && <Feature icon={<Car className="h-5 w-5" />} label="Vagas" value={imovel.vagas} />}
                    </div>

                    <Link
                        href={`/imovel/${imovel.slug}`}
                        className="inline-flex items-center gap-2 px-6 py-3 mt-6 bg-white text-blue-700 rounded-lg font-semibold hover:bg-blue-50 transition shadow-lg"
                    >
                        Quero conhecer este imóvel <ArrowRight />
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
                .then((data: ImovelClient[]) => setImoveis(data))
                .catch((err: Error) => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [inView, loading]);

    const next = useCallback(() => setActiveIndex(i => (i + 1) % imoveis.length), [imoveis]);
    const prev = useCallback(() => setActiveIndex(i => (i - 1 + imoveis.length) % imoveis.length), [imoveis]);
    const share = useCallback((imovel: ImovelClient) => {
        if (navigator.share) {
            navigator.share({
                title: imovel.titulo || 'Imóvel para alugar',
                text: `Confira este imóvel: ${imovel.titulo}`,
                url: window.location.origin + `/imovel/${imovel.slug}`
            }).catch(err => console.log('Erro ao compartilhar:', err));
        } else if ('clipboard' in navigator) {
            navigator.clipboard.writeText(window.location.origin + `/imovel/${imovel.slug}`);
            alert('Link copiado para a área de transferência!');
        }
    }, []);

    if (loading) return (
        <section ref={ref} className="py-20 bg-stone-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-16">
                    <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                        Carregando destaques
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-stone-800">
                        Imóveis para alugar
                    </h2>
                    <p className="text-stone-600 max-w-3xl mx-auto">
                        Carregando nossas melhores opções de aluguel para você e sua família.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse bg-stone-200 h-96 rounded-3xl"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="animate-pulse bg-stone-200 h-64 rounded-xl"></div>
                    ))}
                </div>
            </div>
        </section>
    );

    if (error) return (
        <section ref={ref} className="py-20 bg-stone-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="bg-red-50 text-red-700 p-6 rounded-lg max-w-2xl mx-auto">
                    <h2 className="text-xl font-semibold mb-2">Erro ao carregar imóveis</h2>
                    <p>{error}</p>
                    <button
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        onClick={() => { setLoading(true); setError(null); }}
                    >
                        Tentar novamente
                    </button>
                </div>
            </div>
        </section>
    );

    if (!imoveis.length) return (
        <section ref={ref} className="py-20 bg-stone-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="bg-stone-50 p-6 rounded-lg max-w-2xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-2">Nenhum imóvel em destaque</h2>
                    <p className="text-stone-600 mb-4">
                        No momento não temos imóveis em destaque para alugar, mas você pode conferir todas as nossas opções.
                    </p>
                    <Link
                        href="/alugar"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Ver todos os imóveis para alugar <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );

    const destaque = imoveis[activeIndex];

    return (
        <section ref={ref} className="py-24 bg-stone-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                <div className="text-center space-y-4 mb-8">
                    <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                        Destaques
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-stone-800">
                        Imóveis para alugar
                    </h2>
                    <p className="text-stone-600 max-w-3xl mx-auto">
                        Espaços escolhidos a dedo para proporcionar conforto e qualidade de vida para você e sua família.
                    </p>
                </div>

                <ImovelHero
                    imovel={destaque}
                    isFav={isFav(destaque._id)}
                    toggleFav={() => toggleFav(destaque._id)}
                    share={() => share(destaque)}
                />

                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold text-stone-800">
                        Outras opções
                    </h3>
                    <div className="flex gap-2">
                        <NavButton direction="prev" onClick={prev} disabled={imoveis.length < 2} />
                        <NavButton direction="next" onClick={next} disabled={imoveis.length < 2} />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {imoveis.map((imovel) => (
                        <PropertyCardUnified
                            key={imovel._id}
                            id={imovel._id}
                            title={imovel.titulo || 'Imóvel para alugar'}
                            slug={imovel.slug as string || imovel._id}
                            location={imovel.bairro || 'Localização não informada'}
                            city={imovel.cidade}
                            price={imovel.preco || 0}
                            propertyType="rent"
                            area={imovel.areaUtil}
                            bedrooms={imovel.dormitorios}
                            bathrooms={imovel.banheiros}
                            parkingSpots={imovel.vagas}
                            mainImage={{
                                url: imovel.imagem?.imagemUrl || '/images/placeholder-property.jpg',
                                alt: imovel.imagem?.alt || imovel.titulo || 'Imóvel para alugar',
                                sanityImage: imovel.imagem
                            }}
                            isHighlight={imovel.destaque}
                            isFavorite={isFav(imovel._id)}
                            onFavoriteToggle={toggleFav}
                        />
                    ))}
                </div>

                <div className="text-center mt-8">
                    <Link
                        href="/alugar"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow font-medium"
                    >
                        Ver todos os imóveis para alugar <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default DestaquesAluguelSection;
