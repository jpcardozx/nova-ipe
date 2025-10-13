/**
 * 🎠 useCarousel Hook - S-Tier Mobile Optimization
 * Hook leve e performático para carrosséis sem overengineering
 */

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import type { EmblaOptionsType } from 'embla-carousel'

interface UseCarouselProps {
  options?: EmblaOptionsType
  autoplay?: boolean
  autoplayDelay?: number
}

export function useCarousel({
  options = { loop: false, align: 'start' },
  autoplay = false,
  autoplayDelay = 3000,
}: UseCarouselProps = {}) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  // Scroll para índice específico
  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  // Próximo slide
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  // Slide anterior
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  // Atualizar índice selecionado
  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  // Inicializar carrossel
  useEffect(() => {
    if (!emblaApi) return

    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    onSelect()

    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  // Autoplay (opcional)
  useEffect(() => {
    if (!autoplay || !emblaApi) return

    const interval = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext()
      } else if (options.loop) {
        emblaApi.scrollTo(0)
      }
    }, autoplayDelay)

    return () => clearInterval(interval)
  }, [autoplay, autoplayDelay, emblaApi, options.loop])

  return {
    emblaRef,
    emblaApi,
    selectedIndex,
    scrollSnaps,
    scrollTo,
    scrollNext,
    scrollPrev,
    canScrollPrev: emblaApi?.canScrollPrev() ?? false,
    canScrollNext: emblaApi?.canScrollNext() ?? false,
  }
}
