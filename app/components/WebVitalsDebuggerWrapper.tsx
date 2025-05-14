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

    useEffect(() => {
        // Delay loading debugger until after critical rendering is complete
        const timer = setTimeout(() => {
            setShouldRender(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);    // Use ternary operator instead of && for conditional rendering
    return (process.env.NODE_ENV !== 'production' && shouldRender)
        ? <WebVitalsDebugger enabled={true} />
        : null;
}
