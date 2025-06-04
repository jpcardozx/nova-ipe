'use client';

import dynamic from 'next/dynamic';
import { ComponentType, ReactNode } from 'react';

interface SafeFramerWrapperProps {
    children: ReactNode;
    fallback?: ReactNode;
}

/**
 * HOC que torna qualquer componente com Framer Motion seguro para SSR
 */
export function withSafeFramer<T extends object>(
    Component: ComponentType<T>,
    fallback?: ReactNode
): ComponentType<T> {
    const SafeComponent = dynamic(
        () => Promise.resolve(Component),
        {
            ssr: false,
            loading: () => <>{fallback || <div className="animate-pulse bg-gray-100 h-32" />}</>
        }
    );

    return SafeComponent;
}

/**
 * Wrapper geral para componentes que usam Framer Motion
 */
export default function SafeFramerWrapper({
    children,
    fallback = <div className="animate-pulse bg-gray-100 h-32" />
}: SafeFramerWrapperProps) {
    const DynamicContent = dynamic(
        () => Promise.resolve(() => <>{children}</>),
        {
            ssr: false,
            loading: () => <>{fallback}</>
        }
    );

    return <DynamicContent />;
}

/**
 * Componente para detectar se estamos no cliente
 */
export function ClientOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
    const DynamicContent = dynamic(
        () => Promise.resolve(() => <>{children}</>),
        { ssr: false }
    );

    return <DynamicContent />;
}
