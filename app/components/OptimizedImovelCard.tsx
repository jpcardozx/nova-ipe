'use client';

/**
 * OptimizedImovelCard.tsx
 * 
 * Versão otimizada do componente ImovelCard com melhor performance
 * e integração com o sistema de métricas de componentes
 * 
 * @version 1.0.0
 * @date 18/05/2025
 */

import React, { useState, useEffect, useMemo, memo } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import {
    MapPin,
    ArrowRight,
    Sparkles,
    Home as HomeIcon,
    Scale as RentIcon,
    Heart,
    BedDouble,
    Bath,
    Car
} from 'lucide-react';
import { formatarMoeda, formatarArea, cn } from '@/lib/utils';
import type { ImovelClient } from '@/types/imovel-client';
import { useInView } from 'react-intersection-observer';
import OptimizedImageGallery from './OptimizedImageGallery';

export type FinalidadeType = 'Venda' | 'Aluguel' | 'Temporada';
export type VariantType = 'default' | 'grid' | 'list' | 'featured' | 'compact';

interface ImovelCardProps {
    imovel: ImovelClient;
    finalidade?: FinalidadeType;
    priority?: boolean;
    variant?: VariantType;
    className?: string;
    showGallery?: boolean;
    labelNovo?: boolean;
    imagensAdicionais?: Array<{ url: string; alt?: string }>;
    style?: React.CSSProperties;
    onFavoriteToggle?: (id: string) => void;
    onClick?: () => void;
    onShare?: () => void;
    isFavorite?: boolean;
}

const FINALIDADE_CONFIG: Record<FinalidadeType, { color: string; icon: React.FC<any>; label: string }> = {
    Venda: { color: 'emerald-600', icon: HomeIcon, label: 'Venda' },
    Aluguel: { color: 'blue-600', icon: RentIcon, label: 'Aluguel' },
    Temporada: { color: 'violet-600', icon: Sparkles, label: 'Temporada' }
};

// Helper for safely accessing finalidade 
const getFinalidade = (value: string | undefined): FinalidadeType => {
    if (value && (value === 'Venda' || value === 'Aluguel' || value === 'Temporada')) {
        return value as FinalidadeType;
    }
    return 'Venda'; // Default
};

function useFavorite(id: string, onToggle?: (id: string) => void) {
    const [fav, setFav] = useState<boolean>(false);

    // Inicializar estado de favorito após renderização
    useEffect(() => {
        try {
            const savedFavorites = localStorage.getItem('favorites') || '[]';
            const isFavorite = JSON.parse(savedFavorites).includes(id);
            setFav(isFavorite);
        } catch {
            setFav(false);
        }
    }, [id]);

    useEffect(() => {
        try {
            const list: string[] = JSON.parse(localStorage.getItem('favorites') || '[]');
            const updated = fav ? Array.from(new Set([...list, id])) : list.filter(x => x !== id);
            localStorage.setItem('favorites', JSON.stringify(updated));
            onToggle?.(id);
        } catch (error) {
            console.error("Error updating favorites:", error);
        }
    }, [fav, id, onToggle]);

    const toggle = () => setFav((previous: boolean) => !previous);
    return [fav, toggle] as const;
}

interface BadgeProps {
    color: string;
    children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ color, children }) => (
    <span
        className={cn(
            'inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold',
            `bg-${color}`,
            'shadow-sm backdrop-blur-sm transition-transform hover:scale-105'
        )}
        style={{ backgroundColor: `var(--color-${color})`, color: 'white' }}
    >
        {children}
    </span>
);

interface Feature {
    icon: React.ReactNode;
    label: string;
    value: string;
}

const FeatureList: React.FC<{ features: Feature[] }> = ({ features }) => (
    <div className="grid grid-cols-2 gap-3 mb-3">
        {features.map((f, i) => (
            <div key={i} className="flex items-center gap-2.5 group">
                <div className="p-1.5 bg-gray-100 rounded-md group-hover:bg-brand-light/30 transition-colors">
                    {f.icon}
                </div>
                <div>
                    <p className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">{f.label}</p>
                    <p className="text-sm font-medium">{f.value}</p>
                </div>
            </div>
        ))}
    </div>
);

/**
 * Componente ImovelCard otimizado com lazy loading e métricas
 */
function OptimizedImovelCard({
    imovel,
    finalidade = 'Venda',
    priority = false,
    variant = 'default',
    className,
    showGallery = false,
    labelNovo = false,
    imagensAdicionais = [],
    style,
    onFavoriteToggle,
    onClick,
    onShare,
    isFavorite = false
}: ImovelCardProps) {
    const [loaded, setLoaded] = useState(false);
    const [isFav, toggleFav] = useFavorite(imovel._id, onFavoriteToggle);
    const { ref, inView } = useInView({
        triggerOnce: true,
        rootMargin: '200px 0px',
    });

    // Performance tracking
    const [renderTime] = useState(() => performance.now());
    useEffect(() => {
        if (inView) {
            const visibleTime = performance.now() - renderTime;

            // Envia métricas para análise não-bloqueante
            if ('sendBeacon' in navigator) {
                const payload = {
                    component: 'OptimizedImovelCard',
                    timeToVisible: visibleTime,
                    timestamp: Date.now(),
                };

                if ('sendBeacon' in navigator) {
                    navigator.sendBeacon('/api/component-metrics', JSON.stringify(payload));
                }
            }
        }
    }, [inView, renderTime]);

    // Normalize the finalidade value to ensure it's valid
    const normalizedFinalidade = getFinalidade(imovel.finalidade || finalidade);

    const { images, priceLabel, address, title, disponivel, features, link, badgeColor, BadgeIcon, badgeLabel } = useMemo(() => {
        // Só adiciona a URL da imagem principal se ela realmente existir como URL direta
        // Caso contrário, deixa para o componente OptimizedImageGallery lidar com ela
        const hasDirectUrl = !!imovel.imagem?.url;        // Garante que só URLs válidas são adicionadas
        const mainImage = hasDirectUrl && typeof imovel.imagem?.url === 'string' ? imovel.imagem.url : null;
        const additionalImages = imagensAdicionais
            .filter(img => typeof img.url === 'string')
            .map(img => img.url);

        // Filtra valores null e mantém apenas strings para compatibilidade com OptimizedImageGallery
        const imgs = [
            mainImage,
            ...additionalImages
        ].filter((url): url is string => typeof url === 'string').slice(0, 5);

        // Se não houver nenhuma imagem direta, certifique-se de que a lista não está vazia
        if (imgs.length === 0) imgs.push('/placeholder.png');

        const preco = imovel.preco ? formatarMoeda(imovel.preco) : 'Sob consulta';
        const addr = [imovel.bairro, imovel.cidade].filter(Boolean).join(', ') || 'Localização não informada';
        const titulo = imovel.titulo || `${imovel.categoria?.titulo || 'Imóvel'} para ${normalizedFinalidade}`;
        const dispo = !['vendido', 'reservado', 'indisponivel'].includes(imovel.status || '');
        const feats: Feature[] = [
            imovel.areaUtil && { icon: <span>📐</span>, label: 'Área', value: formatarArea(imovel.areaUtil) },
            imovel.dormitorios && { icon: <BedDouble />, label: 'Dorm.', value: `${imovel.dormitorios}` },
            imovel.banheiros && { icon: <Bath />, label: 'Ban.', value: `${imovel.banheiros}` },
            imovel.vagas && { icon: <Car />, label: 'Vaga(s)', value: `${imovel.vagas}` }
        ].filter(Boolean) as Feature[];

        const slugStr: string = imovel.slug as string || '';
        const url = slugStr ? `/imovel/${encodeURIComponent(slugStr)}` : `/imovel/${imovel._id}`;

        const cfg = FINALIDADE_CONFIG[normalizedFinalidade];
        return {
            images: imgs,
            priceLabel: preco,
            address: addr,
            title: titulo,
            disponivel: dispo,
            features: feats,
            link: url,
            badgeColor: cfg.color,
            BadgeIcon: cfg.icon,
            badgeLabel: cfg.label
        };
    }, [imovel, normalizedFinalidade, imagensAdicionais]);

    const x = useMotionValue(0), y = useMotionValue(0);
    const rx = useTransform(y, [-100, 100], [5, -5]);
    const ry = useTransform(x, [-100, 100], [-5, 5]);
    const spring = { damping: 20, stiffness: 200 };
    const sx = useSpring(rx, spring), sy = useSpring(ry, spring);

    const isCompact = variant === 'compact';
    const isFeatured = variant === 'featured';

    return (
        <motion.article
            ref={ref}
            className={cn(
                'group relative bg-white rounded-lg overflow-hidden',
                'border border-stone-200 shadow-sm hover:shadow-xl',
                'transition-all duration-300 h-full flex flex-col',
                isFeatured ? 'md:col-span-2' : '',
                className
            )}
            style={{ perspective: 800, ...style }}
            onMouseMove={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                x.set(e.clientX - (rect.left + rect.width / 2));
                y.set(e.clientY - (rect.top + rect.height / 2));
            }}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <motion.div style={{ rotateX: sx, rotateY: sy, transformStyle: 'preserve-3d' }}>
                <div className="grid grid-rows-[auto_1fr] h-full" onClick={(e) => {
                    if (onClick) {
                        e.preventDefault();
                        onClick();
                    } else {
                        window.location.href = link;
                    }
                }}>
                    {/* Image Section - Agora usando OptimizedImageGallery */}
                    <div className={cn(
                        'relative overflow-hidden',
                        isCompact ? 'h-48' : isFeatured ? 'h-80' : 'h-64'
                    )}>
                        {!loaded && <div className="absolute inset-0 animate-pulse bg-slate-100" />}

                        <OptimizedImageGallery
                            images={images}
                            image={imovel.imagem}
                            alt={title}
                            priority={priority}
                            eager={priority}
                            className="w-full h-full"
                            showControls={showGallery && images.length > 1}
                            onLoad={() => setLoaded(true)}
                            sizes={isFeatured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
                        />

                        {/* Status badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                            {labelNovo && (
                                <Badge color="accent-yellow">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Novo</span>
                                </Badge>
                            )}
                            <Badge color={badgeColor}>
                                <BadgeIcon className="w-3.5 h-3.5" />
                                <span>{badgeLabel}</span>
                            </Badge>
                            {!disponivel && (
                                <Badge color="neutral-600">
                                    <span>{imovel.status === 'reservado' ? 'Reservado' : 'Vendido'}</span>
                                </Badge>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="absolute top-3 right-3 z-10">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFav();
                                }}
                                className={cn(
                                    'p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md',
                                    'transition-all duration-300',
                                    'hover:bg-white hover:scale-110',
                                    isFav || isFavorite ? 'text-rose-500' : 'text-stone-500'
                                )}
                                aria-label={isFav || isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                            >
                                <Heart
                                    className={cn(
                                        'w-5 h-5 transition-all',
                                        isFav || isFavorite ? 'fill-rose-500 stroke-rose-500' : 'fill-transparent'
                                    )}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex flex-col flex-grow border-t border-stone-100">
                        {/* Price */}
                        <div className="mb-2">
                            <h3 className="text-xl font-semibold text-stone-900">{priceLabel}</h3>
                        </div>

                        {/* Title */}
                        <h2 className="text-lg font-medium line-clamp-2 text-brand-dark mb-2">
                            {title}
                        </h2>

                        {/* Address */}
                        <div className="flex items-center text-stone-500 mb-3 text-sm">
                            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="line-clamp-1">{address}</span>
                        </div>

                        {/* Features */}
                        {features.length > 0 && (
                            <div className="grid grid-cols-2 gap-3 mb-4 mt-auto">
                                {features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-2 group">
                                        <div className="p-1.5 bg-stone-100 rounded-md text-stone-600 group-hover:bg-brand-light/30 transition-colors">
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <p className="text-xs text-stone-500 group-hover:text-stone-700 transition-colors">{feature.label}</p>
                                            <p className="text-sm font-medium text-stone-700">{feature.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* CTA button */}
                        <div className="mt-auto pt-3 border-t border-stone-100">
                            <Link href={link} className="inline-flex items-center justify-center w-full">
                                <span className="text-brand-green font-medium hover:text-brand-green-dark transition-colors flex items-center">
                                    Ver detalhes
                                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.article>
    );
}

export default memo(OptimizedImovelCard);
