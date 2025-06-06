'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const WebVitals = dynamic(
    () => import('./WebVitals'),
    {
        ssr: false,
        loading: () => null // Evita deslocamento de layout durante carregamento
    }
);

export default function ClientWebVitals() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Garantir que o componente só é renderizado após a montagem do cliente
        setIsLoaded(true);

        // Log para depuração em ambiente de desenvolvimento
        if (process.env.NODE_ENV !== 'production') {
            console.log('ClientWebVitals montado.');
        }
    }, []);

    // Só renderizamos após o carregamento do lado do cliente
    if (!isLoaded) return null;

    return <WebVitals />;
}
