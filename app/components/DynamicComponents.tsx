'use client';

import { Suspense, lazy, ComponentType } from 'react';
import dynamic from 'next/dynamic';

// Lazy import framer-motion to avoid SSR issues
const motion = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion })), {
  ssr: false,
}) as any;

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

// Motion wrapper for better performance - dynamically imported
export const MotionDiv = dynamic(() => 
  import('framer-motion').then(mod => ({ default: mod.motion.div })), 
  { ssr: false }
);

export const MotionSection = dynamic(() => 
  import('framer-motion').then(mod => ({ default: mod.motion.section })), 
  { ssr: false }
);

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