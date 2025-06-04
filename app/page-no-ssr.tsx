'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// This approach completely bypasses SSR to avoid hydration issues
const DynamicApp = dynamic(() => import('./page-backup-current'), {
    ssr: false,
    loading: () => (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
                <p>Carregando aplicação...</p>
            </div>
        </div>
    )
});

export default function Home() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
                    <p>Inicializando...</p>
                </div>
            </div>
        );
    }

    return <DynamicApp />;
}
