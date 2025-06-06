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

// ---- Badge Premium ----
interface BadgeProps {
    variant?: 'primary' | 'secondary' | 'highlight';
    className?: string;
    children: React.ReactNode;
}
const Badge: FC<BadgeProps> = ({ variant = 'primary', children, className }) => {
    const base = 'px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-2 transition-all duration-300';
    const styles = {
        primary: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg hover:shadow-xl hover:scale-105',
        secondary: 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:scale-105',
        highlight: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-amber-900 shadow-lg hover:shadow-xl hover:scale-105 animate-pulse',
    };
    return <span className={cn(base, styles[variant], className)}>{children}</span>;
};

// ---- Feature Premium ----
interface FeatureProps {
    icon: React.ReactNode;
    label: string;
    value?: string | number;
}
const Feature: FC<FeatureProps> = ({ icon, label, value }) => {
    if (!value) return null;
    return (
        <motion.div
            className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-xl text-white transition-all duration-300 hover:bg-white/20"
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2.5 rounded-lg shadow-lg">
                {icon}
            </div>
            <div>
                <div className="text-xs uppercase text-amber-100 font-medium tracking-wide">{label}</div>
                <div className="text-lg font-bold text-white">{value}</div>
            </div>
        </motion.div>
    );
};

// ---- Navigation Buttons Premium ----
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
            'p-4 rounded-full bg-gradient-to-r shadow-lg transition-all duration-300',
            disabled
                ? 'from-gray-100 to-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                : 'from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 hover:shadow-xl'
        )}
        aria-label={direction === 'prev' ? 'Imóvel anterior' : 'Próximo imóvel'}
    >
        {direction === 'prev' ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
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
        >            <motion.div
            style={{ rotateX: sX, rotateY: sY }}
            className="grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-amber-600 via-orange-600 to-orange-800 relative overflow-hidden"
        >
                {/* Background Decorativo Premium */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full blur-3xl" />

                <div className="relative h-64 lg:h-full">
                    <SanityImage image={imovel.imagem} alt={imovel.titulo} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 via-amber-800/30 to-transparent" />
                    <div className="absolute top-4 left-4">
                        <Badge variant="highlight">✨ Destaque Premium</Badge>
                    </div>                    <div className="absolute top-4 right-4 flex gap-2">
                        <motion.button
                            onClick={toggleFav}
                            className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Heart className={cn('w-5 h-5', isFav ? 'fill-red-500 text-red-500' : 'text-gray-700')} />
                        </motion.button>
                        <motion.button
                            onClick={share}
                            className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Share2 className="w-5 h-5 text-gray-700" />
                        </motion.button>
                    </div>
                </div>
                <div className="p-8 space-y-6 text-white relative">
                    {/* Background pattern sutil */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl" />
                        <div className="absolute bottom-0 right-0 w-24 h-24 bg-yellow-300 rounded-full blur-2xl" />
                    </div>

                    <div className="relative">
                        <motion.h2
                            className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {imovel.titulo}
                        </motion.h2>
                        <motion.div
                            className="flex items-center gap-3 text-amber-100"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <MapPin className="opacity-80 w-5 h-5" />
                            <span className="text-lg">{[imovel.bairro, imovel.cidade].filter(Boolean).join(', ')}</span>
                        </motion.div>
                    </div>

                    <motion.div
                        className="text-3xl font-bold text-white flex items-center gap-3"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <span className="bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                            {imovel.preco ? formatarMoeda(imovel.preco) : 'Sob consulta'}
                        </span>
                        <span className="text-xl text-amber-200">/mês</span>
                    </motion.div>                    <motion.div
                        className="grid grid-cols-2 gap-4 mt-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, staggerChildren: 0.1 }}
                    >
                        {imovel.areaUtil && <Feature icon={<Ruler className="h-5 w-5" />} label="Área" value={formatarArea(imovel.areaUtil)} />}
                        {imovel.dormitorios && <Feature icon={<BedDouble className="h-5 w-5" />} label="Dormitórios" value={imovel.dormitorios} />}
                        {imovel.banheiros && <Feature icon={<Bath className="h-5 w-5" />} label="Banheiros" value={imovel.banheiros} />}
                        {imovel.vagas && <Feature icon={<Car className="h-5 w-5" />} label="Vagas" value={imovel.vagas} />}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Link
                            href={`/imovel/${imovel.slug}`}
                            className="group inline-flex items-center gap-3 px-8 py-4 mt-8 bg-gradient-to-r from-white to-amber-50 text-orange-700 rounded-xl font-bold hover:from-amber-50 hover:to-white transition-all shadow-xl hover:shadow-2xl hover:scale-105 duration-300"
                        >
                            <HomeIcon className="w-5 h-5" />
                            Quero conhecer este imóvel
                            <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                    </motion.div>
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
    }, []); if (loading) return (
        <section ref={ref} className="py-20 bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-16">
                    <motion.div
                        className="h-8 bg-gradient-to-r from-amber-200 to-orange-200 rounded-lg mx-auto max-w-md animate-pulse"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    />
                    <motion.div
                        className="h-16 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg mx-auto max-w-2xl animate-pulse"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    />
                </div>

                {/* Skeleton Premium */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <motion.div
                        className="h-96 bg-gradient-to-br from-amber-200 to-orange-200 rounded-3xl animate-pulse shadow-xl"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    />
                    <div className="space-y-6">
                        {[...Array(4)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="h-20 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl animate-pulse"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                            />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="h-80 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl animate-pulse shadow-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + i * 0.1 }}
                        />
                    ))}
                </div>            </div>
        </section>
    ); if (error) return (
        <section ref={ref} className="py-20 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 text-red-700 p-8 rounded-2xl max-w-2xl mx-auto shadow-lg"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.h2
                        className="text-2xl font-bold mb-4 text-red-800"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Ops! Algo deu errado
                    </motion.h2>
                    <motion.p
                        className="mb-6 text-red-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {error}
                    </motion.p>
                    <motion.button
                        className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => { setLoading(true); setError(null); }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        Tentar novamente
                    </motion.button>
                </motion.div>
            </div>
        </section>
    ); if (!imoveis.length) return (
        <section ref={ref} className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-10 rounded-2xl max-w-2xl mx-auto shadow-lg"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                    >
                        <HomeIcon className="w-10 h-10 text-amber-600" />
                    </motion.div>
                    <motion.h2
                        className="text-3xl font-bold mb-4 bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        Em Breve, Novos Destaques
                    </motion.h2>
                    <motion.p
                        className="text-lg text-amber-700 mb-8 leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        No momento não temos imóveis em destaque para alugar, mas você pode conferir toda nossa seleção premium de propriedades disponíveis.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Link
                            href="/alugar"
                            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                        >
                            <HomeIcon className="w-6 h-6" />
                            Explorar Todos os Imóveis
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    ); const destaque = imoveis[activeIndex];

    return (
        <section ref={ref} className="py-24 bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/40 relative overflow-hidden">
            {/* Background decorativo premium */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 via-orange-100/10 to-transparent" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-amber-400/10 to-transparent rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative">
                <motion.div
                    className="text-center space-y-6 mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <HomeIcon className="w-5 h-5" />
                        Destaques Premium
                    </motion.div>
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-orange-700 bg-clip-text text-transparent"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        Imóveis Selecionados para Alugar
                    </motion.h2>
                    <motion.p
                        className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        Espaços escolhidos a dedo para proporcionar <span className="font-semibold text-amber-700">conforto premium</span> e qualidade de vida excepcional para você e sua família.
                    </motion.p>
                </motion.div>

                <ImovelHero
                    imovel={destaque}
                    isFav={isFav(destaque._id)}
                    toggleFav={() => toggleFav(destaque._id)}
                    share={() => share(destaque)}
                />                <motion.div
                    className="flex justify-between items-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
                        Outras Opções Premium
                    </h3>
                    <div className="flex gap-3">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <NavButton direction="prev" onClick={prev} disabled={imoveis.length < 2} />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <NavButton direction="next" onClick={next} disabled={imoveis.length < 2} />
                        </motion.div>
                    </div>
                </motion.div>                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, staggerChildren: 0.1 }}
                >
                    {imoveis.map((imovel, index) => (
                        <motion.div
                            key={imovel._id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 + index * 0.1 }}
                        >
                            <PropertyCardUnified
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
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    className="text-center mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                >
                    <Link
                        href="/alugar"
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold hover:from-amber-600 hover:to-orange-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105 duration-300"
                    >
                        <HomeIcon className="w-6 h-6" />
                        Ver Todos os Imóveis para Alugar
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default DestaquesAluguelSection;
