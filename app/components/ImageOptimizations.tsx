'use client';

import { useEffect } from 'react';

/**
 * Componente que otimiza o carregamento de imagens e recursos
 * através de preload e prefetch estratégico
 */
export default function ImageOptimizations() {
    useEffect(() => {
        // Prefetch icons
        const iconSizes = ['192x192', '512x512'];
        const iconTypes = ['', '-maskable'];

        iconSizes.forEach(size => {
            iconTypes.forEach(type => {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.as = 'image';
                link.href = `/icons/icon${type}-${size}.png`;
                link.type = 'image/png';
                document.head.appendChild(link);
            });
        });

        // Prefetch screenshots
        const screenshots = [
            '/screenshots/home-screenshot.png',
            '/screenshots/property-screenshot.png'
        ];

        screenshots.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.as = 'image';
            link.href = src;
            link.type = 'image/png';
            document.head.appendChild(link);
        });
    }, []);

    return null;
}
