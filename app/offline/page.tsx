'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LazyIcon } from '../utils/icon-splitter';

/**
 * Página de fallback para quando o usuário está offline
 * 
 * Parte da estratégia PWA para funcionamento offline e melhoria
 * na experiência do usuário quando há problemas de conectividade
 */
export default function OfflinePage() {
    // Verificar status de conexão
    useEffect(() => {
        const checkOnlineStatus = () => {
            if (navigator.onLine) {
                // Se voltou a conexão, tentar recarregar após um pequeno delay
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        };

        // Monitorar mudanças de status de conexão
        window.addEventListener('online', checkOnlineStatus);

        return () => {
            window.removeEventListener('online', checkOnlineStatus);
        };
    }, []);

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
                    Você está offline
                </h1>

                <p className="text-gray-600 mb-6">
                    Verifique sua conexão com a internet para acessar todos os imóveis disponíveis
                </p>

                <div className="space-y-3">
                    <Link
                        href="/"
                        className="block w-full bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded transition-colors"
                    >
                        Tentar novamente
                    </Link>

                    <div className="text-sm text-gray-500 pt-4 border-t border-gray-200">
                        <p className="mb-2">Você pode acessar algumas áreas que já foram visitadas offline:</p>
                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                            <Link href="/" className="text-primary hover:underline">Página inicial</Link>
                            <Link href="/alugar" className="text-primary hover:underline">Para alugar</Link>
                            <Link href="/comprar" className="text-primary hover:underline">Para comprar</Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
