'use client';

import { ReactNode, useEffect, useState } from 'react';

interface FramerMotionWrapperProps {
    children: ReactNode;
    fallback?: ReactNode;
}

/**
 * Wrapper que garante que componentes Framer Motion só renderizem no cliente
 * Resolve problemas de SSR com addEventListener
 */
export default function FramerMotionWrapper({
    children,
    fallback = null
}: FramerMotionWrapperProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Durante SSR ou antes da hidratação, renderiza o fallback
    if (!isClient) {
        return <>{fallback}</>;
    }

    // No cliente, renderiza os componentes com animações
    return <>{children}</>;
}

/**
 * Hook para verificar se estamos no cliente
 */
export function useIsClient() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return isClient;
}
