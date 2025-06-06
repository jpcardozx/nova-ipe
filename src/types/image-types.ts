import { CSSProperties } from 'react';

export interface ImageObject {
  _type?: string;
  alt?: string;
  url?: string;
  imagemUrl?: string;
  hotspot?: {
    x: number;
    y: number;
    height?: number;
    width?: number;
  };
  asset?: {
    _ref?: string;
    url?: string;
    _type?: string;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

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

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageAnalyticsData {
  component: string;
  url: string;
  loadTime: number;
  success: boolean;
  errorType?: string;
  imageWidth?: number;
  imageHeight?: number;
  screenWidth?: number;
  screenHeight?: number;
  connectionType?: string;
  priority?: boolean;
  fromCache?: boolean;
}
