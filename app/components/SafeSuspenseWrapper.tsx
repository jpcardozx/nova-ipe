'use client';

import { Suspense } from 'react';
import { UnifiedLoading } from './ui/UnifiedComponents';

interface SafeSuspenseWrapperProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    height?: string;
    title?: string;
}

export default function SafeSuspenseWrapper({
    children,
    fallback,
    height = "400px",
    title = "Carregando..."
}: SafeSuspenseWrapperProps) {
    const defaultFallback = fallback || <UnifiedLoading height={height} title={title} />;

    return (
        <Suspense fallback={defaultFallback}>
            {children}
        </Suspense>
    );
}
