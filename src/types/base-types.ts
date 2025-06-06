import { CSSProperties, ReactNode } from 'react';

export interface BaseProps {
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
}

export interface Media {
  url: string;
  width: number;
  height: number;
  alt?: string;
  blurDataUrl?: string;
}

export interface ImageOptimizationConfig {
  quality?: number;
  sizes?: string[];
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}
