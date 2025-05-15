'use client';

import { useState, useEffect } from 'react';
import { getImageUrl } from '@/lib/optimized-sanity-image';
import { extractImageUrl } from '@/lib/image-sanity';

export default function SanityImageDebugger() {
    const [logs, setLogs] = useState<string[]>([]);
    const [results, setResults] = useState<Record<string, any>[]>([]);

    // Intercepta a função getImageUrl para diagnóstico
    useEffect(() => {
        // Backup da função original
        const originalGetImageUrl = window.getImageUrl || getImageUrl;

        // Override da função para capturar chamadas
        window.getImageUrl = function (image: any, fallback: string = '') {
            const result = originalGetImageUrl(image, fallback);

            const entry = {
                timestamp: new Date().toISOString(),
                input: {
                    type: typeof image,
                    isEmpty: !image,
                    isString: typeof image === 'string',
                    keys: image && typeof image === 'object' ? Object.keys(image) : [],
                    hasAsset: image?.asset ? true : false,
                    assetType: image?.asset ? typeof image.asset : 'N/A',
                    assetKeys: image?.asset ? Object.keys(image.asset) : [],
                    assetRef: image?.asset?._ref || 'N/A',
                    assetUrl: image?.asset?.url || 'N/A',
                    url: image?.url || 'N/A',
                    imagemUrl: image?.imagemUrl || 'N/A',
                    alt: image?.alt || 'N/A',
                },
                result,
                isFallback: result === fallback || result.includes('placeholder')
            };

            setLogs(prev => [...prev, `getImageUrl chamado: ${result.substring(0, 30)}...${entry.isFallback ? ' (fallback)' : ''}`]);
            setResults(prev => [...prev, entry]);

            return result;
        };

        window.debugImageLoad = function (imageUrl: string, success: boolean) {
            setLogs(prev => [...prev, `Imagem ${success ? 'carregada' : 'falhou'}: ${imageUrl.substring(0, 30)}...`]);
        }; return () => {
            // Restaura a função original ao desmontar
            window.getImageUrl = originalGetImageUrl;            // Limpa o debugger opcional
            if ('debugImageLoad' in window) {
                // Usando uma abordagem segura em TypeScript para remover a propriedade
                window.debugImageLoad = undefined as any;
            }
        };
    }, []);

    return (
        <div className="fixed bottom-0 right-0 bg-white shadow-lg border p-2 max-w-sm max-h-64 overflow-auto text-xs z-50">
            <h3 className="font-bold mb-1">SanityImage Debugger</h3>
            <div className="space-y-1 h-48 overflow-auto">
                {logs.map((log, i) => (
                    <p key={i} className={log.includes('falhou') ? 'text-red-600' : ''}>{log}</p>
                ))}
            </div>
        </div>
    );
}

declare global {
    interface Window {
        getImageUrl: any;
        debugImageLoad: (url: string, success: boolean) => void;
    }
}
