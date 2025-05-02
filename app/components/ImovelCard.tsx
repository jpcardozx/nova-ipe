'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin, ArrowRight, Sparkles, Home, Scale,
  Heart, Info, BarChart2, BedDouble, Bath, Car
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatarMoeda, formatarArea, cn } from '@/lib/utils';
import type { ImovelClient as Imovel } from '@/types/imovel-client';

// ---------------------------------------------------------------
// Tipos e configurações
// ---------------------------------------------------------------

export type FinalidadeType = 'Venda' | 'Aluguel' | 'Temporada';

interface ImovelCardProps {
  imovel: Imovel;
  finalidade: FinalidadeType;
  priority?: boolean;
  variant?: 'default' | 'grid' | 'list' | 'featured';
  className?: string;
  onFavoriteToggle?: (imovelId: string, state: boolean) => void;
  onClick?: () => void;
}

const FINALIDADE_CONFIG = {
  Venda: {
    gradient: 'from-emerald-500 to-emerald-600',
    gradientHover: 'from-emerald-600 to-emerald-700',
    accent: 'text-emerald-600',
    accentBg: 'bg-emerald-50',
    border: 'border-emerald-300',
    icon: Home
  },
  Aluguel: {
    gradient: 'from-blue-500 to-blue-600',
    gradientHover: 'from-blue-600 to-blue-700',
    accent: 'text-blue-600',
    accentBg: 'bg-blue-50',
    border: 'border-blue-300',
    icon: Scale
  },
  Temporada: {
    gradient: 'from-violet-500 to-violet-600',
    gradientHover: 'from-violet-600 to-violet-700',
    accent: 'text-violet-600',
    accentBg: 'bg-violet-50',
    border: 'border-violet-300',
    icon: Sparkles
  }
};

// ---------------------------------------------------------------
// Helper Hooks
// ---------------------------------------------------------------

const useFavoriteState = (imovelId: string, callback?: (id: string, state: boolean) => void) => {
  const [isFavorite, setIsFavorite] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const favorites = localStorage.getItem('imoveis-favoritos');
      return favorites ? JSON.parse(favorites).includes(imovelId) : false;
    } catch {
      return false;
    }
  });

  const toggleFavorite = () => {
    setIsFavorite((prev: boolean) => {
      const newState = !prev;
      if (typeof window !== 'undefined') {
        try {
          const favorites = localStorage.getItem('imoveis-favoritos');
          const favoritesArray = favorites ? JSON.parse(favorites) : [];
          localStorage.setItem(
            'imoveis-favoritos',
            JSON.stringify(
              newState
                ? [...favoritesArray, imovelId]
                : favoritesArray.filter((id: string) => id !== imovelId)
            )
          );
        } catch (error) {
          console.error('Error updating favorites:', error);
        }
      }
      if (callback) callback(imovelId, newState);
      return newState;
    });
  };

  return { isFavorite, toggleFavorite };
};

// ---------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------

const ImovelCard = ({
  imovel,
  finalidade,
  priority = false,
  variant = 'default',
  className = '',
  onFavoriteToggle,
  onClick,
}: ImovelCardProps) => {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { isFavorite, toggleFavorite } = useFavoriteState(
    imovel._id,
    onFavoriteToggle
  );

  const finalidadeStyle = FINALIDADE_CONFIG[finalidade];
  const FinalidadeIcon = finalidadeStyle.icon;

  // Format displayed data
  const location = imovel.bairro
    ? `${imovel.bairro}, ${imovel.cidade ?? ''}`
    : imovel.cidade || 'Localização não informada';

  const formatPrice = () => {
    if (!imovel.preco) return { formatted: 'Sob consulta', display: null };
    const full = formatarMoeda(imovel.preco, false, true);
    const [integer, decimal = '00'] = full.split(',');
    return {
      formatted: full,
      display: { integer, decimal }
    };
  };

  const price = formatPrice();

  // Card layout based on variant
  const isListVariant = variant === 'list';
  const isFeaturedVariant = variant === 'featured';

  const containerClasses = {
    default: 'flex flex-col rounded-2xl h-full',
    grid: 'flex flex-col rounded-2xl h-full',
    list: 'flex flex-row rounded-2xl h-36 sm:h-44',
    featured: 'flex flex-col md:flex-row rounded-2xl h-full md:h-96'
  };

  const imageContainerClasses = isListVariant
    ? 'w-1/3 relative rounded-l-2xl overflow-hidden'
    : isFeaturedVariant
      ? 'w-full md:w-3/5 relative rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none overflow-hidden aspect-[16/9]'
      : 'w-full relative rounded-t-2xl overflow-hidden aspect-[16/9]';

  const contentContainerClasses = isListVariant
    ? 'w-2/3 p-4 flex flex-col'
    : isFeaturedVariant
      ? 'w-full md:w-2/5 p-5 md:p-6 flex flex-col'
      : 'w-full p-5 flex flex-col';

  // Features to display
  const features = [
    imovel.areaUtil != null && {
      icon: <BarChart2 className="w-4 h-4" />,
      label: 'Área',
      value: formatarArea(Number(imovel.areaUtil))
    },
    imovel.dormitorios && {
      icon: <BedDouble className="w-4 h-4" />,
      label: 'Dormitórios',
      value: imovel.dormitorios === 1 ? '1 quarto' : `${imovel.dormitorios} quartos`
    },
    imovel.banheiros && {
      icon: <Bath className="w-4 h-4" />,
      label: 'Banheiros',
      value: imovel.banheiros === 1 ? '1 banheiro' : `${imovel.banheiros} banheiros`
    },
    imovel.vagas && {
      icon: <Car className="w-4 h-4" />,
      label: 'Vagas',
      value: imovel.vagas === 1 ? '1 vaga' : `${imovel.vagas} vagas`
    }
  ].filter(Boolean);

  return (
    <motion.article
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        containerClasses[variant],
        'group bg-white overflow-hidden',
        'border border-gray-100 shadow-lg shadow-gray-200/40',
        'transition-all duration-500',
        className
      )}
      aria-label={`${imovel.categoria?.titulo || 'Imóvel'} para ${finalidade}: ${imovel.titulo || 'Imóvel'}`}
    >
      {/* Image Section */}
      <div className={imageContainerClasses}>
        {/* Loading state */}
        {!loaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
        )}

        {/* Main Image */}
        <Image
          src={imovel.imagem?.url ?? '/images/placeholder.png'}
          alt={imovel.imagem?.alt ?? imovel.titulo ?? 'Imóvel'}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          quality={85}
          onLoad={() => setLoaded(true)}
          className={cn(
            'object-cover transition-all duration-700',
            'transform-gpu',
            hovered ? 'scale-105' : 'scale-100',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {/* Finalidade Badge */}
          <div className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg',
            'text-xs font-semibold uppercase tracking-wide text-white',
            'bg-gradient-to-r backdrop-blur-md shadow-lg',
            finalidadeStyle.gradient
          )}>
            <FinalidadeIcon className="w-3.5 h-3.5" />
            <span>{finalidade}</span>
          </div>

          {/* Destaque Badge */}
          {imovel.destaque && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-md shadow-lg">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Destaque</span>
            </div>
          )}
        </div>

        {/* Tipo Imóvel */}
        {imovel.categoria?.titulo && (
          <div className="absolute bottom-4 left-4 z-10">
            <div className="px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-md text-xs font-medium text-white">
              {imovel.categoria.titulo}
            </div>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite();
          }}
          className={cn(
            'absolute top-4 right-4 z-10 p-2.5 rounded-full',
            'backdrop-blur-md shadow-lg transition-all duration-300',
            isFavorite
              ? 'bg-white text-rose-500'
              : 'bg-black/30 text-white hover:bg-black/40'
          )}
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart
            className={cn(
              'w-4 h-4 transition-all',
              isFavorite ? 'fill-rose-500 stroke-rose-500' : ''
            )}
          />
        </button>
      </div>

      {/* Content Section */}
      <div className={contentContainerClasses}>
        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="truncate">{location}</span>
        </div>

        {/* Title */}
        <h3 className={cn(
          isFeaturedVariant ? 'text-xl font-bold' : 'text-lg font-semibold',
          'text-gray-900 mb-3 line-clamp-2'
        )}>
          {imovel.titulo ?? 'Imóvel'}
        </h3>

        {/* Features */}
        {features.length > 0 && (isFeaturedVariant || !isListVariant) && (
          <div className={cn(
            'grid gap-3 mb-4',
            isFeaturedVariant ? 'grid-cols-2' : 'grid-cols-2'
          )}>
            {features.map((feature, index) => (
              feature && (
                <div key={index} className="flex items-center gap-2">
                  <div className={cn(
                    'p-1.5 rounded-md',
                    finalidadeStyle.accentBg
                  )}>
                    {feature.icon}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{feature.label}</p>
                    <p className="text-sm font-medium">{feature.value}</p>
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between">
          {/* Price */}
          <div>
            {price.display ? (
              <div className="flex items-baseline">
                <span className="text-sm font-medium text-gray-600 mr-1">R$</span>
                <span className={cn(
                  'font-bold',
                  isFeaturedVariant ? 'text-2xl' : 'text-xl',
                  finalidadeStyle.accent
                )}>
                  {price.display.integer}
                </span>
                <span className="text-sm text-gray-600">,{price.display.decimal}</span>
              </div>
            ) : (
              <span className="text-lg font-medium text-gray-500 italic">
                Sob consulta
              </span>
            )}
          </div>

          {/* Action Button */}
          <Link
            href={imovel.slug ? `/imovel/${encodeURIComponent(imovel.slug)}` : '#'}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2.5 rounded-full',
              'text-sm font-medium text-white',
              'transition-all duration-300',
              'bg-gradient-to-r shadow-lg',
              finalidadeStyle.gradient,
              'group-hover:' + finalidadeStyle.gradientHover
            )}
            onClick={(e) => {
              if (onClick) {
                e.preventDefault();
                onClick();
              }
            }}
          >
            <span>Detalhes</span>
            <ArrowRight className={cn(
              'w-4 h-4 transition-transform duration-300',
              'group-hover:translate-x-1'
            )} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default ImovelCard;