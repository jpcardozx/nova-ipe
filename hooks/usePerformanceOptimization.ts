'use client';

import { useEffect, useRef, useMemo } from 'react';

/**
 * Custom hook for performance optimizations
 * Handles hardware acceleration, will-change management, and memory optimization
 */
export function usePerformanceOptimization() {
  const elementRef = useRef<HTMLElement>(null);
  
  // Hardware acceleration styles
  const hardwareAcceleration = useMemo(() => ({
    transform: 'translate3d(0, 0, 0)',
    backfaceVisibility: 'hidden' as const,
    perspective: 1000,
  }), []);

  // Animation optimization styles
  const animationOptimization = useMemo(() => ({
    ...hardwareAcceleration,
    willChange: 'transform, opacity',
  }), [hardwareAcceleration]);

  // Background animation optimization
  const backgroundOptimization = useMemo(() => ({
    transform: 'translate3d(0, 0, 0)',
    willChange: 'background-position',
  }), []);

  // Clean up will-change after animations complete
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new MutationObserver(() => {
      // Check if animations are complete
      const hasActiveAnimations = element.getAnimations().length > 0;
      if (!hasActiveAnimations) {
        element.style.willChange = 'auto';
      }
    });

    observer.observe(element, { 
      attributes: true, 
      attributeFilter: ['style', 'class'] 
    });

    return () => observer.disconnect();
  }, []);

  return {
    elementRef,
    hardwareAcceleration,
    animationOptimization,
    backgroundOptimization,
  };
}

/**
 * Hook for carousel-specific optimizations
 */
export function useCarouselOptimization() {
  const { elementRef, hardwareAcceleration } = usePerformanceOptimization();
  
  const slideOptimization = useMemo(() => ({
    ...hardwareAcceleration,
    willChange: 'transform, opacity',
    contain: 'layout style paint',
  }), [hardwareAcceleration]);

  const arrowOptimization = useMemo(() => ({
    ...hardwareAcceleration,
    willChange: 'transform, opacity',
  }), [hardwareAcceleration]);

  return {
    elementRef,
    slideOptimization,
    arrowOptimization,
  };
}

/**
 * Hook for navbar-specific optimizations
 */
export function useNavbarOptimization() {
  const { elementRef, hardwareAcceleration } = usePerformanceOptimization();
  
  const logoOptimization = useMemo(() => ({
    ...hardwareAcceleration,
    willChange: 'transform',
  }), [hardwareAcceleration]);

  const menuOptimization = useMemo(() => ({
    ...hardwareAcceleration,
    willChange: 'transform, opacity',
    contain: 'layout',
  }), [hardwareAcceleration]);

  return {
    elementRef,
    logoOptimization,
    menuOptimization,
  };
}

/**
 * Hook for hero section optimizations
 */
export function useHeroOptimization() {
  const { elementRef, hardwareAcceleration, backgroundOptimization } = usePerformanceOptimization();
  
  const particleOptimization = useMemo(() => ({
    ...hardwareAcceleration,
    willChange: 'transform, opacity',
    pointerEvents: 'none' as const,
  }), [hardwareAcceleration]);

  const metricOptimization = useMemo(() => ({
    ...hardwareAcceleration,
    willChange: 'transform, opacity',
    contain: 'layout style',
  }), [hardwareAcceleration]);

  return {
    elementRef,
    particleOptimization,
    metricOptimization,
    backgroundOptimization,
  };
}

/**
 * Hook for managing frame rates and reducing motion on low-end devices
 */
export function useAdaptivePerformance() {
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const isLowEndDevice = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    
    // Check for low-end device indicators
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const slowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
    const lowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;
    const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    
    return slowConnection || lowMemory || lowCores;
  }, []);

  const animationConfig = useMemo(() => ({
    duration: prefersReducedMotion ? 0 : isLowEndDevice ? 0.2 : 0.4,
    ease: 'easeOut',
    willChange: isLowEndDevice ? 'auto' : 'transform, opacity',
  }), [prefersReducedMotion, isLowEndDevice]);

  return {
    prefersReducedMotion,
    isLowEndDevice,
    animationConfig,
  };
}
