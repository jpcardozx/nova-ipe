// 'use client';
import React, { useState, useEffect, useMemo, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  ArrowRight,
  Sparkles,
  Home as HomeIcon,
  Scale as RentIcon,
  Heart,
  Camera,
  BedDouble,
  Bath,
  Car,
  Share2
} from 'lucide-react';
import { formatarMoeda, formatarArea, cn } from '@/lib/utils';
import type { ImovelClient as Imovel } from '@/types/imovel-client';

export type FinalidadeType = 'Venda' | 'Aluguel' | 'Temporada';
export type VariantType = 'default' | 'grid' | 'list' | 'featured';

interface ImovelCardProps {
  imovel: Imovel;
  finalidade: FinalidadeType;
  priority?: boolean;
  variant?: VariantType;
  className?: string;
  showGallery?: boolean;
  labelNovo?: boolean;
  imagensAdicionais?: Array<{ url: string; alt?: string }>;
  style?: React.CSSProperties;
  onFavoriteToggle?: (imovelId: string, isFav: boolean) => void;
  onClick?: () => void;
  onShare?: () => void;
}

const FINALIDADE_CONFIG: Record<FinalidadeType, { color: string; icon: React.FC<any>; label: string }> = {
  Venda: { color: 'emerald-600', icon: HomeIcon, label: 'Venda' },
  Aluguel: { color: 'blue-600', icon: RentIcon, label: 'Aluguel' },
  Temporada: { color: 'violet-600', icon: Sparkles, label: 'Temporada' }
};

function useFavorite(id: string, onToggle?: (id: string, isFav: boolean) => void) {
  const [fav, setFav] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try { return JSON.parse(localStorage.getItem('favorites') || '[]').includes(id); } catch { return false; }
  });

  useEffect(() => {
    const list: string[] = JSON.parse(localStorage.getItem('favorites') || '[]');
    const updated = fav ? Array.from(new Set([...list, id])) : list.filter(x => x !== id);
    localStorage.setItem('favorites', JSON.stringify(updated));
    onToggle?.(id, fav);
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
      'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white',
      `bg-${color}`
    )}
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
      <div key={i} className="flex items-center gap-2">
        <div className="p-1.5 bg-gray-100 rounded-md">{f.icon}</div>
        <div>
          <p className="text-xs text-gray-500">{f.label}</p>
          <p className="text-sm font-medium">{f.value}</p>
        </div>
      </div>
    ))}
  </div>
);

interface GalleryControlsProps {
  count: number;
  current: number;
  onSelect: (idx: number) => void;
}
const GalleryControls: React.FC<GalleryControlsProps> = ({ count, current, onSelect }) => (
  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
    {Array.from({ length: count }).map((_, idx) => (
      <button
        key={idx}
        onClick={() => onSelect(idx)}
        className={cn(
          'w-2 h-2 rounded-full transition-opacity',
          idx === current ? 'bg-white' : 'bg-white/50 hover:bg-white'
        )}
        aria-label={`Imagem ${idx + 1}`}
      />
    ))}
  </div>
);

function ImovelCard({
  imovel,
  finalidade,
  priority = false,
  variant = 'default',
  className,
  showGallery = false,
  labelNovo = false,
  imagensAdicionais = [],
  style,
  onFavoriteToggle,
  onClick,
  onShare
}: ImovelCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isFav, toggleFav] = useFavorite(imovel._id, onFavoriteToggle);

  const { images, priceLabel, address, title, disponivel, features, link, badgeColor, BadgeIcon, badgeLabel } = useMemo(() => {
    const imgs = [imovel.imagem?.url || '/placeholder.png', ...imagensAdicionais.map(i => i.url)].slice(0, 5);
    const preco = imovel.preco ? formatarMoeda(imovel.preco) : 'Sob consulta';
    const addr = [imovel.bairro, imovel.cidade].filter(Boolean).join(', ') || 'Localização não informada';
    const titulo = imovel.titulo || `${imovel.categoria?.titulo || 'Imóvel'} para ${finalidade}`;
    const dispo = !['vendido', 'reservado', 'indisponivel'].includes(imovel.status || '');
    const feats: Feature[] = [
      imovel.areaUtil && { icon: <span>📐</span>, label: 'Área', value: formatarArea(imovel.areaUtil) },
      imovel.dormitorios && { icon: <BedDouble />, label: 'Dorm.', value: `${imovel.dormitorios}` },
      imovel.banheiros && { icon: <Bath />, label: 'Ban.', value: `${imovel.banheiros}` },
      imovel.vagas && { icon: <Car />, label: 'Vaga(s)', value: `${imovel.vagas}` }
    ].filter(Boolean) as Feature[];

    const slugStr: string = imovel.slug as string || '';
    const url = slugStr ? `/imovel/${encodeURIComponent(slugStr)}` : `/imovel/${imovel._id}`;

    const cfg = FINALIDADE_CONFIG[finalidade];
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
  }, [imovel, finalidade, imagensAdicionais]);

  const x = useMotionValue(0), y = useMotionValue(0);
  const rx = useTransform(y, [-100, 100], [5, -5]);
  const ry = useTransform(x, [-100, 100], [-5, 5]);
  const spring = { damping: 20, stiffness: 200 };
  const sx = useSpring(rx, spring), sy = useSpring(ry, spring);

  return (
    <motion.article
      className={cn('group bg-white rounded-xl overflow-hidden border hover:shadow-lg transition', className)}
      style={{ perspective: 800, ...style }}
      onMouseMove={e => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - (rect.left + rect.width / 2));
        y.set(e.clientY - (rect.top + rect.height / 2));
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    >
      <motion.div style={{ rotateX: sx, rotateY: sy, transformStyle: 'preserve-3d' }}>
        <Link href={link} onClick={onClick} className="grid grid-rows-[auto_1fr] h-full">
          {/* Image Section */}
          <div className="relative aspect-video">
            {!loaded && <div className="absolute inset-0 animate-pulse bg-gray-100" />}
            <AnimatePresence mode="wait">
              <motion.div key={currentImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Image
                  src={images[currentImage]}
                  alt={title}
                  fill
                  priority={priority}
                  className="object-cover"
                  onLoad={() => setLoaded(true)}
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-2 left-2 flex flex-col gap-2">
              <Badge color={badgeColor}>
                <BadgeIcon className="w-4 h-4" /> {badgeLabel}
              </Badge>
              {imovel.destaque && <Badge color="amber-500"><Sparkles className="w-4 h-4" /> Destaque</Badge>}
              {labelNovo && <Badge color="rose-500">Novo</Badge>}
            </div>
            <div className="absolute top-2 right-2 flex gap-2">
              <button onClick={e => { e.preventDefault(); toggleFav(); }} aria-label="Favoritar">
                <Heart className={cn('w-5 h-5', isFav ? 'text-red-500' : 'text-white')} />
              </button>
              {onShare && <button onClick={e => { e.preventDefault(); onShare(); }}><Share2 className="w-5 h-5 text-white" /></button>}
            </div>
            {showGallery && images.length > 1 && <GalleryControls count={images.length} current={currentImage} onSelect={setCurrentImage} />}
          </div>

          {/* Content Section */}
          <div className="p-4 flex flex-col flex-grow">
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <MapPin className="w-4 h-4 mr-1" />{address}
            </div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">{title}</h3>
            {features.length > 0 && <FeatureList features={features} />}
            <div className="mt-auto flex items-center justify-between">
              <span className="font-bold text-xl text-gray-800">{priceLabel}</span>
              <button className={cn('inline-flex items-center gap-1 px-4 py-2 rounded-full text-white font-medium', `bg-${badgeColor}`)}>
                Detalhes <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Link>
        {!disponivel && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="bg-white px-4 py-2 rounded-lg text-gray-800 text-lg font-bold shadow-lg">
              {finalidade === 'Venda' ? 'Vendido' : 'Alugado'}
            </span>
          </div>
        )}
      </motion.div>
    </motion.article>
  );
}

export default memo(ImovelCard);
