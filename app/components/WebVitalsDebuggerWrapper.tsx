'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Agora podemos usar ssr: false porque estamos em um Client Component
const WebVitalsDebugger = dynamic(() => import('./WebVitalsDebugger'), {
    ssr: false,
    loading: () => null // Prevent layout shift while loading
});

export default function WebVitalsDebuggerWrapper() {
    // Só renderizamos em desenvolvimento e após carregamento da página
    const [shouldRender, setShouldRender] = useState(false);
    const [isDev, setIsDev] = useState(false);

    useEffect(() => {
        // Verificar explicitamente se estamos em modo de desenvolvimento
        setIsDev(process.env.NODE_ENV !== 'production');

        // Reduzimos o tempo de espera para 1500ms para garantir que carregue mais rápido
        const timer = setTimeout(() => {
            setShouldRender(true);
            console.log('WebVitals debugger enabled');
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    // Verificação mais robusta para ambiente de desenvolvimento
    if (!isDev) return null;

    // Renderização condicional com log para debug
    return shouldRender ? <WebVitalsDebugger enabled={true} /> : null;
}
