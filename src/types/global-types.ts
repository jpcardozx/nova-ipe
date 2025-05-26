import { CSSProperties, ReactNode } from 'react';

// Common component props
export interface BaseComponentProps {
  className?: string;
  children?:Node;
}

// Form Data extensions
declare global {
  interface FormData {
    entries(): IterableIterator<[string, FormDataEntryValue]>;
    get(name: string): FormDataEntryValue | null;
    getAll(name: string): FormDataEntryValue[];
    has(name: string): boolean;
    set(name: string, value: string | Blob, fileName?: string): void;
    append(name: string, value: string | Blob, fileName?: string): void;
    delete(name: string): void;
  }
}

// Performance related types
export interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
  navigationTiming?: {
    unload: number;
    redirect: number;
    dns: number;
    tcp: number;
    ssl: number;
    ttfb: number;
    download: number;
    domInteractive: number;
    domComplete: number;
    loadEvent: number;
  };
}

// Analytics types
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

// Document extensions
declare global {
  interface Document {
    webkitFullscreenElement?: Element;
    mozFullScreenElement?: Element;
    msFullscreenElement?: Element;
    webkitExitFullscreen?: () => void;
    mozCancelFullScreen?: () => void;
    msExitFullscreen?: () => void;
  }

  interface HTMLElement {
    webkitRequestFullscreen?: () => Promise<void>;
    mozRequestFullScreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
  }
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Image related types
export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  loading?: 'lazy' | 'eager';
  className?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  style?: CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}
