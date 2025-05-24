/**
 * Diagnóstico de MIME Types para Next.js
 * 
 * Esta ferramenta ajuda a identificar problemas de MIME Types em projetos Next.js,
 * especialmente para PWAs que dependem do Service Worker para funcionar offline.
 */

'use client';

import { useEffect, useState } from 'react';

type MimeTestResult = {
    url: string;
    expectedMimeType: string;
    actualMimeType: string | null;
    success: boolean;
    response: Response | null;
    error?: string;
};

export default function MimeTypeDiagnostic() {
    const [results, setResults] = useState<MimeTestResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cacheState, setCacheState] = useState<string>('');

    // URLs críticas para teste de MIME Types
    const urlsToTest = [
        { url: '/_next/static/chunks/main-app.js', expectedType: 'application/javascript' },
        { url: '/_next/static/chunks/webpack.js', expectedType: 'application/javascript' },
        { url: '/_next/static/css/app/layout.css', expectedType: 'text/css' },
        { url: '/icons/icon-192x192.png', expectedType: 'image/png' },
        { url: '/manifest.webmanifest', expectedType: 'application/manifest+json' }
    ];

    const runTests = async () => {
        setIsLoading(true);
        const testResults: MimeTestResult[] = [];

        for (const { url, expectedType } of urlsToTest) {
            try {
                const response = await fetch(url, {
                    cache: 'no-store',
                    headers: { 'Cache-Control': 'no-cache' }
                });

                const mimeType = response.headers.get('content-type');
                const success = mimeType?.includes(expectedType) || false;

                testResults.push({
                    url,
                    expectedMimeType: expectedType,
                    actualMimeType: mimeType,
                    success,
                    response
                });
            } catch (error) {
                testResults.push({
                    url,
                    expectedMimeType: expectedType,
                    actualMimeType: null,
                    success: false,
                    response: null,
                    error: (error as Error).message
                });
            }
        }

        setResults(testResults);
        setIsLoading(false);
    }; const clearServiceWorkerCache = async () => {
        setCacheState('Limpando caches do Service Worker...');

        try {
            // Importar a função de utilidade dinâmicamente para evitar problemas de SSR
            const { clearServiceWorkerCache, isServiceWorkerActive } = await import('@/app/utils/service-worker-utils');

            if (!isServiceWorkerActive()) {
                setCacheState('Service Worker não está ativo ou não controla esta página.');
                return;
            }

            // Usar nossa função utilitária para limpar os caches com segurança
            const success = await clearServiceWorkerCache();

            if (success) {
                setCacheState('Caches do Service Worker limpos com sucesso.');

                // Se também temos acesso direto aos caches, limpar também
                if ('caches' in window) {
                    try {
                        const keys = await caches.keys();
                        await Promise.all(keys.map(key => caches.delete(key)));
                        setCacheState('Todos os caches foram limpos completamente.');
                    } catch (cachesError) {
                        console.error('Erro ao limpar caches diretamente:', cachesError);
                    }
                }
            } else {
                setCacheState('Não foi possível limpar completamente os caches.');
            }
        } catch (error) {
            setCacheState(`Erro ao limpar caches: ${(error as Error).message}`);
        }
    };

    useEffect(() => {
        // Executa os testes automaticamente na montagem do componente
        runTests();
    }, []);

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Diagnóstico de MIME Types</h1>

            <div className="mb-6 flex gap-4">
                <button
                    onClick={runTests}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                    {isLoading ? 'Executando...' : 'Executar testes'}
                </button>

                <button
                    onClick={clearServiceWorkerCache}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                >
                    Limpar caches do Service Worker
                </button>
            </div>

            {cacheState && (
                <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded">
                    {cacheState}
                </div>
            )}

            <div className="space-y-6">
                {results.map((result, index) => (
                    <div
                        key={index}
                        className={`p-4 rounded border ${result.success
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                            }`}
                    >
                        <h3 className="font-medium">{result.url}</h3>
                        <div className="mt-2 space-y-1 text-sm">
                            <p><span className="font-semibold">MIME esperado:</span> {result.expectedMimeType}</p>
                            <p><span className="font-semibold">MIME recebido:</span> {result.actualMimeType || 'Nenhum'}</p>

                            {result.error && (
                                <p className="text-red-600"><span className="font-semibold">Erro:</span> {result.error}</p>
                            )}

                            <p className={result.success ? 'text-green-600' : 'text-red-600'}>
                                <span className="font-semibold">Status:</span>{' '}
                                {result.success ? 'OK' : 'Falha'}
                                {result.response && ` (${result.response.status} ${result.response.statusText})`}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
