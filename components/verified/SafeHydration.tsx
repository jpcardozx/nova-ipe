"use client";

import { useState, useEffect, ReactNode } from 'react';

interface SafeHydrationProps {
    children: ReactNode;
    fallback?: ReactNode;
}

export function SafeHydration({ children, fallback }: SafeHydrationProps) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        return fallback || null;
    }

    return <>{children}</>;
}

export default SafeHydration;
