import * as React from 'react';

export interface ImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    sizes?: string;
    quality?: number;
    priority?: boolean;
    placeholder?: 'blur' | 'empty';
    style?: React.CSSProperties;
    className?: string;
    fill?: boolean;
    loading?: 'eager' | 'lazy';
    blurDataURL?: string;
    unoptimized?: boolean;
    onLoad?: () => void;
    onError?: (error: any) => void;
    [key: string]: any;
}

declare module 'next/image' {
    const Image: React.ComponentType<ImageProps>;
    export default Image;
}

// For dynamic import
interface DynamicOptionsLoadingProps {
    error?: Error | null;
    isLoading?: boolean;
    pastDelay?: boolean;
    retry?: () => void;
    timedOut?: boolean;
}

declare module 'next/dynamic' {
    export default function dynamic<P = {}>(
        dynamicOptions: () => Promise<React.ComponentType<P>>,
        options?: {
            loading?: React.ComponentType<DynamicOptionsLoadingProps>;
            ssr?: boolean;
            suspense?: boolean;
        }
    ): React.ComponentType<P>;
}
