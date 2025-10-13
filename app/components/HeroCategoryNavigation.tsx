/**
 * 🎨 Hero Category Navigation - Premium Edition
 *
 * Features:
 * - Ícones posicionados estilo notification (top-left overlay)
 * - Copy profissional objetiva e confiável
 * - Sem contadores de imóveis (foco em credibilidade)
 * - Carrossel mobile + Grid desktop responsivo
 * - Paleta unificada: slate-900/white/amber
 */

'use client'

import { memo } from 'react'
import Link from 'next/link'
import { Home, Building2, MapPin, ArrowRight } from 'lucide-react'
import { useCarousel } from '@/app/hooks/useCarousel'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface CategoryCardProps {
  href: string
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  icon: React.ReactNode
  accentColor: string
  badge?: string
}

const CATEGORIES: CategoryCardProps[] = [
  {
    href: '/catalogo?tipo=casa',
    title: 'Casas Residenciais',
    description: 'Propriedades com estrutura completa para moradia',
    imageSrc: '/images/imagensHero/casasHero.webp',
    imageAlt: 'Casas Residenciais com quintal - Imobiliária IPE Guararema',
    icon: <Home className="w-5 h-5" />,
    accentColor: 'blue',
    badge: 'Destaque',
  },
  {
    href: '/catalogo?tipo=sitio',
    title: 'Sítios e Chácaras',
    description: 'Amplas áreas em localização estratégica',
    imageSrc: '/images/imagensHero/sitiosHero.webp',
    imageAlt: 'Sítios e Chácaras em Guararema - Imobiliária IPE',
    icon: <Building2 className="w-5 h-5" />,
    accentColor: 'green',
    badge: 'Selecionadas',
  },
  {
    href: '/catalogo?tipo=terreno',
    title: 'Terrenos e Lotes',
    description: 'Terrenos regularizados prontos para construção',
    imageSrc: '/images/imagensHero/terrenosHero.webp',
    imageAlt: 'Terrenos para Construção - Imobiliária IPE Guararema',
    icon: <MapPin className="w-5 h-5" />,
    accentColor: 'amber',
    badge: 'Documentação OK',
  },
]

const ACCENT_COLORS = {
  blue: {
    border: 'hover:border-blue-400/50 focus:ring-blue-500',
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    overlay: 'bg-blue-600/20',
    hoverText: 'group-hover:text-blue-100',
    hoverDesc: 'group-hover:text-blue-200',
  },
  green: {
    border: 'hover:border-green-400/50 focus:ring-green-500',
    bg: 'bg-green-500/20',
    text: 'text-green-400',
    overlay: 'bg-green-600/20',
    hoverText: 'group-hover:text-green-100',
    hoverDesc: 'group-hover:text-green-200',
  },
  amber: {
    border: 'hover:border-amber-400/50 focus:ring-amber-500',
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    overlay: 'bg-amber-600/20',
    hoverText: 'group-hover:text-amber-100',
    hoverDesc: 'group-hover:text-amber-200',
  },
}

// Card Individual Premium
const CategoryCard = memo(function CategoryCard({
  href,
  title,
  description,
  imageSrc,
  imageAlt,
  icon,
  accentColor,
  badge,
}: CategoryCardProps) {
  const colors = ACCENT_COLORS[accentColor as keyof typeof ACCENT_COLORS]

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-xl transition-all duration-300 hover:shadow-2xl active:scale-[0.98]"
      aria-label={`Ver ${title.toLowerCase()} disponíveis`}
    >
      {/* Imagem de Fundo */}
      <div className="aspect-[4/3] relative overflow-hidden bg-slate-900">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 90vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          priority={title === 'Casas Residenciais'}
        />

        {/* Gradiente Sofisticado - Mais escuro embaixo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        {/* Badge Premium */}
        {badge && (
          <div className="absolute top-3 right-3 bg-white/98 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-xl border border-white/20">
            <span className="text-slate-900 text-xs font-bold tracking-wide">{badge}</span>
          </div>
        )}

        {/* Ícone Premium - Notification Style (sobreposição top-left) */}
        <div className="absolute top-3 left-3 z-20">
          <div className={cn(
            'p-3 rounded-xl shadow-2xl border-2 border-white/30 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-0.5 group-hover:shadow-amber-500/20',
            colors.bg.replace('/20', '/90')
          )}>
            <div className="text-white drop-shadow-lg">{icon}</div>
          </div>
        </div>
      </div>

      {/* Card Content - Paleta Premium (slate-900/white/amber) */}
      <div className="bg-gradient-to-br from-slate-900/98 to-slate-800/98 backdrop-blur-xl pt-5 pb-4 px-5 border-t-2 border-white/5">
        {/* Título e Descrição - Hierarquia Clara */}
        <div className="mb-4 space-y-2">
          <h4 className="text-white font-bold text-lg leading-tight tracking-tight group-hover:text-amber-400 transition-colors duration-300">
            {title}
          </h4>
          <p className="text-slate-400 text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Divider Sutil */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />

        {/* CTA Premium */}
        <div className="flex items-center justify-between group/cta">
          <span className="text-sm font-bold text-amber-400 group-hover:text-amber-300 transition-colors duration-300">
            Explorar imóveis
          </span>
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/10 group-hover:bg-amber-500/20 transition-all duration-300">
            <ArrowRight className="w-4 h-4 text-amber-400 group-hover:text-amber-300 transition-all duration-300 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  )
})

// Componente Principal
export default function HeroCategoryNavigation() {
  const { emblaRef, selectedIndex, scrollSnaps, scrollTo } = useCarousel({
    options: { loop: false, align: 'center' },
  })

  return (
    <section className="relative mt-8 sm:mt-12 mb-6 sm:mb-8 py-8 sm:py-12" aria-labelledby="category-navigation-heading">
      {/* Overlay elegante desktop e mobile */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/30 to-transparent pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        {/* Header Premium */}
        <header className="text-center mb-8 sm:mb-10 px-4">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="text-amber-400 text-xs font-bold tracking-wider uppercase">Categorias</span>
          </div>
          <h3
            id="category-navigation-heading"
            className="text-white text-2xl sm:text-3xl font-bold mb-3 tracking-tight"
          >
            Imóveis em Guararema
          </h3>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Imóveis verificados com documentação regularizada e assessoria especializada.
          </p>
        </header>

        {/* Mobile: Carrossel Horizontal */}
        <div className="md:hidden mb-6">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 px-4">
              {CATEGORIES.map((category) => (
                <div key={category.href} className="flex-[0_0_90%] min-w-0">
                  <CategoryCard {...category} />
                </div>
              ))}
            </div>
          </div>

          {/* Dots de Navegação Premium */}
          <div className="flex justify-center gap-2.5 mt-6">
            {scrollSnaps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollTo(idx)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300 shadow-sm',
                  idx === selectedIndex
                    ? 'w-10 bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-500/30'
                    : 'w-2 bg-slate-700 hover:bg-slate-600 hover:w-4'
                )}
                aria-label={`Ir para categoria ${idx + 1}`}
                aria-current={idx === selectedIndex ? 'true' : 'false'}
              />
            ))}
          </div>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.href} {...category} />
          ))}
        </div>

        {/* CTA Premium Footer */}
        <footer className="text-center mt-8 sm:mt-10 px-4">
          <Link
            href="/catalogo"
            className="group/footer inline-flex items-center gap-3 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-amber-400/30 hover:border-amber-400/60 rounded-2xl px-6 py-4 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10"
            prefetch={false}
          >
            <div className="flex-1 text-left">
              <p className="text-white font-semibold text-sm mb-0.5">Ver catálogo completo</p>
              <p className="text-slate-400 text-xs">Acesse todas as propriedades disponíveis</p>
            </div>
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-amber-500/10 group-hover/footer:bg-amber-500/20 transition-all duration-300">
              <ArrowRight className="w-4 h-4 text-amber-400 group-hover/footer:text-amber-300 transition-all group-hover/footer:translate-x-0.5" />
            </div>
          </Link>
        </footer>
      </div>
    </section>
  )
}
