'use client';

import { useEffect, useState, ReactNode } from 'react';

interface NoSSRProps {
    children: ReactNode;
    fallback?: ReactNode;
}

/**
 * NoSSR component that prevents server-side rendering of its children
 * to avoid hydration mismatches in dynamic content
 */
export default function NoSSR({ children, fallback = null }: NoSSRProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
