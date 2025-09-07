'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'

interface UseLazyLoadOptions {
  rootMargin?: string
  threshold?: number
  fallback?: ReactNode
  delay?: number
}

interface LazyComponentProps {
  children: ReactNode
  className?: string
  fallback?: ReactNode
  rootMargin?: string
  threshold?: number
  delay?: number
}

export function useLazyLoad({
  rootMargin = '100px 0px',
  threshold = 0.1,
  delay = 0
}: UseLazyLoadOptions = {}) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => setIsInView(true), delay)
          } else {
            setIsInView(true)
          }
          observer.disconnect()
        }
      },
      { rootMargin, threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [rootMargin, threshold, delay])

  return { ref, isInView }
}

export function LazyComponent({
  children,
  className = '',
  fallback = (
    <div className="h-32 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
      <div className="text-gray-400 text-sm">Carregando...</div>
    </div>
  ),
  rootMargin = '100px 0px',
  threshold = 0.1,
  delay = 0
}: LazyComponentProps) {
  const { ref, isInView } = useLazyLoad({ rootMargin, threshold, delay })

  return (
    <div ref={ref} className={className}>
      {isInView ? children : fallback}
    </div>
  )
}