'use client';

import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  KeyboardEvent,
} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowRight, Sparkles, Home, Scale } from 'lucide-react';
import { formatarMoeda, formatarArea } from '@/src/lib/utils';
import type { ImovelClient as Imovel } from '@/src/types/imovel-client';
import { cn } from '@/src/lib/utils';

const FINALIDADE_CONFIG = {
  Venda: {
    color:
      'from-emerald-500/90 to-emerald-700/90 text-emerald-50 border-emerald-400',
    icon: Home,
  },
  Aluguel: {
    color: 'from-blue-500/90 to-blue-700/90 text-blue-50 border-blue-400',
    icon: Scale,
  },
  Temporada: {
    color:
      'from-violet-500/90 to-violet-700/90 text-violet-50 border-violet-400',
    icon: Sparkles,
  },
} as const;

export type Finalidade = keyof typeof FINALIDADE_CONFIG;

interface Props {
  imovel: Imovel;
  finalidade: Finalidade;
  priority?: boolean;
}

function useAppear(threshold = 0.1, rootMargin = '50px') {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('appear');
          io.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);
  return ref;
}

export default function ImovelCard({
  imovel,
  finalidade,
  priority = false,
}: Props) {
  const [hover, setHover] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const cardRef = useAppear();

  // slug & URL
  const slug = useMemo(() => imovel.slug?.current ?? '', [imovel.slug]);
  const detailsUrl = slug ? `/imovel/${encodeURIComponent(slug)}` : '#';

  // titles & images
  const titulo = imovel.titulo ?? 'Imóvel';
  const imgUrl = imovel.imagem?.url ?? '/images/placeholder.png';
  const altText = imovel.imagem?.alt ?? titulo;

  // price split
  const displayPrice = useMemo(() => {
    if (!imovel.preco) return null;
    const full = formatarMoeda(imovel.preco, false, true);
    const [integer, decimal = '00'] = full.split(',');
    return { full, integer, decimal };
  }, [imovel.preco]);

  // location string
  const location = useMemo(() => {
    if (imovel.bairro) return `${imovel.bairro}, ${imovel.cidade ?? ''}`;
    return imovel.cidade || 'Localização não informada';
  }, [imovel.bairro, imovel.cidade]);

  // metragem
  const metragem = useMemo(
    () =>
      imovel.areaUtil != null ? formatarArea(Number(imovel.areaUtil)) : null,
    [imovel.areaUtil]
  );

  // property type
  const tipoImovel = imovel.categoria && 'titulo' in imovel.categoria
    ? imovel.categoria.titulo
    : '';

  const { color: statusColors, icon: StatusIcon } =
    FINALIDADE_CONFIG[finalidade];

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      role="article"
      aria-label={`${tipoImovel} para ${finalidade}: ${titulo}, ${location}`}
      className={cn(
        'group opacity-0 translate-y-4 transition-all duration-700 ease-out',
        'h-full flex flex-col rounded-xl overflow-hidden bg-white shadow-sm',
        'hover:-translate-y-1 hover:shadow-xl',
        'appear:opacity-100 appear:translate-y-0'
      )}
    >
      <div className="relative w-full aspect-[7/5] overflow-hidden">
        {!loaded && <div className="skeleton-bg animate-pulse" />}

        <Image
          src={imgUrl}
          alt={altText}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          quality={80}
          onLoad={() => setLoaded(true)}
          className={cn(
            'object-cover object-center transition-transform duration-700',
            hover ? 'scale-110 brightness-105' : 'scale-100',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
        />

        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-t from-black/40 to-transparent',
            'transition-opacity duration-300',
            hover ? 'opacity-30' : 'opacity-40'
          )}
        />

        <div className="absolute top-4 left-4 z-10">
          <div
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium',
              'backdrop-blur-md border-l-2 shadow-lg bg-gradient-to-r',
              statusColors
            )}
          >
            <StatusIcon className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="uppercase">{finalidade}</span>
          </div>
        </div>

        {imovel.destaque && (
          <div className="absolute top-4 right-4 z-10">
            <div
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium',
                'bg-gradient-to-r from-amber-500/90 to-amber-600/90',
                'border-r-2 border-amber-400 shadow-lg'
              )}
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="uppercase tracking-wide">Destaque</span>
            </div>
          </div>
        )}

        {tipoImovel && (
          <div className="absolute bottom-4 left-4 z-10">
            <div className="px-3 py-1.5 rounded-md bg-black/40 text-xs text-white">
              {tipoImovel}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow p-5 space-y-4">
        <h3 className="text-lg font-medium text-gray-900 line-clamp-2 min-h-[3rem]">
          {titulo}
        </h3>

        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400" aria-hidden="true" />
          <span className="truncate">{location}</span>
        </div>

        <div
          className="flex items-center gap-3"
          role="list"
          aria-label="Características do imóvel"
        >
          {metragem && (
            <span
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
              role="listitem"
            >
              {metragem}
            </span>
          )}
          {imovel.aceitaFinanciamento && (
            <span
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
              role="listitem"
            >
              Financia
            </span>
          )}
        </div>

        <div className="flex-grow" />

        <div className="flex items-center justify-between pt-2">
          <div
            aria-label={
              displayPrice
                ? `Preço: R$ ${displayPrice.full}`
                : 'Preço sob consulta'
            }
          >
            {displayPrice ? (
              <div className="flex items-baseline">
                <span className="text-sm font-light text-gray-500 mr-1">R$</span>
                <span className="text-2xl font-semibold text-gray-900">
                  {displayPrice.integer}
                </span>
                <span className="text-sm text-gray-500">
                  ,{displayPrice.decimal}
                </span>
              </div>
            ) : (
              <span className="text-lg italic text-gray-500">
                Sob consulta
              </span>
            )}
          </div>

          <Link
            href={detailsUrl}
            className={cn(
              'flex items-center gap-1 px-4 py-2.5 rounded-full',
              'bg-gray-900 text-white text-sm font-medium shadow-sm',
              'transition-all duration-300 overflow-hidden',
              hover ? 'w-[120px] bg-gray-800' : 'w-[44px]'
            )}
            aria-label={`Ver detalhes de ${titulo}`}
          >
            <span
              className={cn(
                'whitespace-nowrap transition-opacity duration-300',
                hover ? 'opacity-100' : 'opacity-0'
              )}
            >
              Detalhes
            </span>
            <ArrowRight
              className={cn(
                'w-5 h-5 flex-shrink-0 transition-transform duration-500',
                hover ? 'translate-x-0' : '-translate-x-0.5'
              )}
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>

      <style jsx>{`
        .skeleton-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            #e5e7eb 0%,
            #f3f4f6 50%,
            #e5e7eb 100%
          );
        }
      `}</style>
    </div>
  );
}