'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { HeroServerData } from '../server/HeroServer';

// Importação dinâmica do componente client para evitar problemas de hydration
const HeroClient = dynamic(() => import('./HeroClient'), {
    ssr: false,
    loading: () => (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50/30 animate-pulse">
            <div className="max-w-7xl mx-auto px-6 pt-32">
                <div className="text-center space-y-8">
                    <div className="h-16 bg-white/60 rounded-xl mx-auto max-w-4xl" />
                    <div className="h-8 bg-white/40 rounded-lg mx-auto max-w-2xl" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                        {Array(4).fill(0).map((_, i) => (
                            <div key={i} className="h-24 bg-white/60 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
});

/**
 * Adaptador que conecta o Server Component com o Client Component
 * Extrai dados do container HTML e passa para o componente client
 */
export default function HeroAdapter() {
    const [serverData, setServerData] = useState<HeroServerData | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Extrair dados do container do server component
        const container = document.getElementById('hero-server-container');
        if (container) {
            const dataAttr = container.getAttribute('data-hero-data');
            if (dataAttr) {
                try {
                    const parsedData = JSON.parse(dataAttr);
                    setServerData(parsedData);
                } catch (error) {
                    console.error('Failed to parse hero server data:', error);
                }
            }
        }
    }, []);

    if (!mounted) {
        return null; // Evita flash de conteúdo não hidratado
    }

    return <HeroClient serverData={serverData} />;
}

