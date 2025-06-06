'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LazyIcon } from '../utils/icon-splitter';
import { usePWAStatus } from '../utils/pwa-service';

/**
 * Página de fallback para quando o usuário está offline
 * 
 * Parte da estratégia PWA para funcionamento offline e melhoria
 * na experiência do usuário quando há problemas de conectividade
 */
export default function OfflinePage() {
    const [pwaStatus] = usePWAStatus();
    const [isReconnecting, setIsReconnecting] = useState(false);

    // Verificar status de conexão
    useEffect(() => {
        // Se voltou a conexão, tentar recarregar após um pequeno delay
        if (pwaStatus.isOnline) {
            setIsReconnecting(true);
            const timer = setTimeout(() => {
                window.location.reload();
            }, 2000);
            
            return () => clearTimeout(timer);
        }
    }, [pwaStatus.isOnline]);

    return (
        <main className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="mb-6">
                    <Image
                        src="/images/logo-ipe.svg"
                        alt="Nova IPE"
                        width={120}
                        height={40}
                        className="mx-auto"
                        priority
                    />
                </div>

                <div className="flex justify-center mb-6">
                    <div className="rounded-full bg-orange-100 p-4">
                        <LazyIcon name="WifiOff" className="h-10 w-10 text-orange-500" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-3">
                    {pwaStatus.isOnline ? 'Conexão restabelecida!' : 'Você está offline'}
                </h1>

                <p className="text-gray-600 mb-6">
                    {pwaStatus.isOnline
                        ? 'A página será recarregada em instantes...'
                        : 'Verifique sua conexão com a internet para acessar todos os imóveis disponíveis'}
                </p>

                <div className="space-y-3">
                    <button
                        onClick={() => window.location.reload()}
                        className={`block w-full ${pwaStatus.isOnline ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-primary/90'} text-white py-2 px-4 rounded transition-colors`}
                    >
                        {isReconnecting ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Recarregando...
                            </span>
                        ) : pwaStatus.isOnline ? 'Recarregar agora' : 'Tentar novamente'}
                    </button>

                    {!pwaStatus.isOnline && (
                        <div className="text-sm text-gray-500 pt-4 border-t border-gray-200">
                            <p className="mb-2">
                                Você pode acessar estas páginas offline:
                            </p>

                            <div className="flex flex-wrap justify-center gap-2 mt-2">
                                {/* Páginas principais sempre disponíveis */}
                                <Link href="/" className="text-primary hover:underline">Página inicial</Link>
                                <Link href="/alugar" className="text-primary hover:underline">Para alugar</Link>
                                <Link href="/comprar" className="text-primary hover:underline">Para comprar</Link>

                                {/* Páginas em cache */}
                                {pwaStatus.cachedPages.length > 0 && pwaStatus.cachedPages
                                    .filter(page => !['/alugar', '/comprar', '/'].includes(page))
                                    .map((page, index) => (
                                        <Link
                                            key={index}
                                            href={page}
                                            className="text-primary hover:underline"
                                        >
                                            {page.split('/').filter(Boolean).join(' › ')}
                                        </Link>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 text-sm text-gray-400">
                Última verificação: {new Date().toLocaleString()}
            </div>
        </main>
    );
}
