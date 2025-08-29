'use client';

import { Suspense, lazy, ComponentType } from 'react';
import { motion } from 'framer-motion';

// Loading fallback component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
  </div>
);

// Higher-order component for dynamic imports with loading state
export function createDynamicComponent(importFn: () => Promise<{ default: ComponentType<any> }>) {
  const LazyComponent = lazy(importFn);
  
  return function DynamicComponent(props: any) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Motion wrapper for better performance
export const MotionDiv = motion.div;
export const MotionSection = motion.section;

// Lazy loaded components for better code splitting
export const LazyBlocoExploracaoSimbolica = createDynamicComponent(
  () => import('./BlocoExploracaoSimbolica')
);

export const LazyIpeConcept = createDynamicComponent(
  () => import('./ipeConcept')
);

export const LazyEnhancedTestimonials = createDynamicComponent(
  () => import('./EnhancedTestimonials')
);

export const LazyMarketAnalysisSection = createDynamicComponent(
  () => import('./MarketAnalysisSection')
);

export const LazyContactSection = createDynamicComponent(
  () => import('./ContactSection')
);