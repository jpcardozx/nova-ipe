'use client';

import { ReactNode } from 'react';
import { useEffect, useState } from 'react';

export default function HydrationBoundary({ children }: { children: ReactNode }) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    // On first render (server-side), return null to avoid hydration mismatches
    // Once mounted (client-side), render the children
    if (!hasMounted) {
        return null;
    }

    return <>{children}</>;
}
