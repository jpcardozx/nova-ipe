'use client';

import { lazy, useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Lazy load heavy components with loading states
export const LazyIpeConcept = dynamic(
  () => import('./ipeConcept'),
  {
    loading: () => (
      <div className="h-96 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Carregando seção...</div>
      </div>
    ),
    ssr: false
  }
);

export const LazyPropertyCarousel = dynamic(
  () => import('./ImoveisCarousel').then(mod => ({ default: mod.ImoveisCarousel })),
  {
    loading: () => (
      <div className="h-64 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Carregando carrossel...</div>
      </div>
    ),
    ssr: false
  }
);

export const LazyTestimonials = dynamic(
  () => import('../sections/Testimonials'),
  {
    loading: () => (
      <div className="h-48 bg-gray-50 animate-pulse rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Carregando depoimentos...</div>
      </div>
    ),
    ssr: false
  }
);

export const LazyContactSection = dynamic(
  () => import('../sections/Contact'),
  {
    loading: () => (
      <div className="h-64 bg-gray-50 animate-pulse rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Carregando contato...</div>
      </div>
    ),
    ssr: false
  }
);

export const LazyPropertyCard = dynamic(
  () => import('./ui/PropertyCard'),
  {
    loading: () => (
      <div className="h-80 bg-white border border-gray-200 rounded-lg animate-pulse">
        <div className="h-48 bg-gray-200 rounded-t-lg"></div>
        <div className="p-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    ),
    ssr: false
  }
);

// Intersection Observer hook for lazy loading sections
export const useLazySection = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};