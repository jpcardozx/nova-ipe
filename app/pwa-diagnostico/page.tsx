/**
 * Página de Diagnóstico de PWA
 * 
 * Esta página permite testar as capacidades de PWA da aplicação,
 * como instalação, modo offline, e atualização do Service Worker
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePWAStatus } from '../utils/pwa-service';

export default function PwaDiagnostic() {
    const [pwaStatus, pwaActions] = usePWAStatus({
        pollInterval: 5000, // Check status every 5 seconds
        autoRegister: true  // Automatically register the service worker
    });
    const [manifestData, setManifestData] = useState<any>(null);
    const [iconStatus, setIconStatus] = useState<Record<string, boolean>>({});

    // Verificar manifest
    useEffect(() => {
        // Buscar dados do manifest
        fetch('/manifest.webmanifest')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Status HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setManifestData(data);

                // Verificar ícones
                if (data.icons && Array.isArray(data.icons)) {
                    const iconChecks = data.icons.map((icon: any) => {
                        return fetch(icon.src)
                            .then(response => {
                                const contentType = response.headers.get('content-type');
                                const validType = contentType && contentType.includes('image/');
                                setIconStatus(prev => ({
                                    ...prev,
                                    [icon.src]: validType && response.ok
                                }));
                                return { src: icon.src, valid: validType && response.ok };
                            })
                            .catch(() => {
                                setIconStatus(prev => ({
                                    ...prev,
                                    [icon.src]: false
                                }));
                                return { src: icon.src, valid: false };
                            });
                    });

                    Promise.all(iconChecks);
                }
            })
            .catch(error => {
                console.error('Erro ao buscar manifest:', error);
                setManifestData({ error: error.message });
            });
    }, []);

    // Limpar caches do Service Worker
    const clearCaches = async () => {
        try {
            const success = await pwaActions.clearCache();

            if (success) {
                alert('Caches limpos com sucesso');
            } else {
                alert('Não foi possível limpar todos os caches');
            }
        } catch (error) {
            alert(`Erro ao limpar caches: ${(error as Error).message}`);
        }
    };

    // Instalar a PWA
    const installApp = async () => {
        if (pwaStatus.canInstall) {
            const success = await pwaActions.install();
            if (!success) {
                alert('Não foi possível instalar o aplicativo');
            }
        } else {
            alert('Não é possível instalar o aplicativo agora');
        }
    };

    // Atualizar o Service Worker
    const updateServiceWorker = async () => {
        const success = await pwaActions.update();
        if (success) {
            alert('Service Worker atualizado, a página será recarregada');
            window.location.reload();
        } else {
            alert('Não foi possível atualizar o Service Worker');
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Diagnóstico de PWA</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Status do Service Worker */}
                <div className="bg-white rounded-lg shadow p-6 border border-neutral-100">
                    <h2 className="text-lg font-medium mb-3">Service Worker</h2>
                    <div className="space-y-2">
                        <p>
                            <span className="font-medium">Status:</span>{' '}
                            {pwaStatus.serviceWorkerActive
                                ? 'Ativo e controlando a página'
                                : pwaStatus.serviceWorkerRegistered
                                    ? 'Registrado, mas não ativo'
                                    : 'Não registrado'}
                        </p>
                        <p>
                            <span className="font-medium">Versão:</span>{' '}
                            {pwaStatus.version || 'Desconhecida'}
                        </p>
                        <p>
                            <span className="font-medium">Navegador online:</span>{' '}
                            {pwaStatus.isOnline ? 'Sim' : 'Não'}
                        </p>
                        <div className="mt-4 space-y-2">
                            <button
                                onClick={clearCaches}
                                className="px-4 py-2 bg-neutral-800 text-white rounded-md text-sm hover:bg-neutral-700"
                            >
                                Limpar caches
                            </button>
                            {pwaStatus.serviceWorkerRegistered && (
                                <button
                                    onClick={updateServiceWorker}
                                    className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                                >
                                    Verificar atualização
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status de instalação */}
                <div className="bg-white rounded-lg shadow p-6 border border-neutral-100">
                    <h2 className="text-lg font-medium mb-3">Instalação</h2>
                    <div className="space-y-2">
                        <p>
                            <span className="font-medium">Instalável como app:</span>{' '}
                            {pwaStatus.canInstall ? 'Sim' : 'Não'}
                        </p>
                        <p>
                            <span className="font-medium">Modo:</span>{' '}
                            {pwaStatus.isStandalone ? 'Aplicativo instalado' : 'Navegador web'}
                        </p>
                        {pwaStatus.canInstall && (
                            <button
                                onClick={installApp}
                                className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700 mt-4"
                            >
                                Instalar aplicativo
                            </button>
                        )}
                        {!pwaStatus.canInstall && (
                            <p className="text-sm text-neutral-600 mt-4">
                                {pwaStatus.isStandalone
                                    ? 'Aplicação já está instalada'
                                    : 'Para instalar, acesse em um dispositivo móvel ou use Chrome/Edge em desktop'}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Cached Pages */}
            <div className="bg-white rounded-lg shadow p-6 border border-neutral-100 mb-6">
                <h2 className="text-lg font-medium mb-3">Páginas Disponíveis Offline</h2>
                {pwaStatus.cachedPages.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {pwaStatus.cachedPages.map((page, index) => (
                            <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                {page}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-neutral-600">Nenhuma página em cache para uso offline.</p>
                )}
            </div>

            {/* Manifest */}
            <div className="bg-white rounded-lg shadow p-6 border border-neutral-100 mb-6">
                <h2 className="text-lg font-medium mb-3">Web App Manifest</h2>
                {manifestData && !manifestData.error ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p><span className="font-medium">Nome:</span> {manifestData.name}</p>
                                <p><span className="font-medium">Nome curto:</span> {manifestData.short_name}</p>
                                <p><span className="font-medium">Descrição:</span> {manifestData.description}</p>
                            </div>
                            <div>
                                <p><span className="font-medium">Start URL:</span> {manifestData.start_url}</p>
                                <p><span className="font-medium">Display:</span> {manifestData.display}</p>
                                <p><span className="font-medium">Cor de tema:</span> {manifestData.theme_color}</p>
                            </div>
                        </div>

                        {/* Ícones */}
                        <div>
                            <h3 className="font-medium mb-2">Ícones:</h3>
                            <div className="space-y-2">
                                {manifestData.icons?.map((icon: any, index: number) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <span className={`w-4 h-4 rounded-full ${iconStatus[icon.src] ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        <span>{icon.src} ({icon.sizes}, {icon.purpose || 'default'})</span>
                                        {icon.src && (
                                            <img
                                                src={icon.src}
                                                alt={`Ícone ${icon.sizes}`}
                                                className="w-8 h-8 object-contain ml-2" onError={(e) => {
                                                    ((e.target as unknown) as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-red-600">
                        {manifestData?.error
                            ? `Erro ao carregar manifest: ${manifestData.error}`
                            : 'Carregando informações do manifest...'}
                    </div>
                )}
            </div>

            <div className="flex justify-between mt-8">
                <Link href="/mime-diagnostico" className="text-primary-600 hover:underline">
                    Ver diagnóstico de MIME Types
                </Link>
                <Link href="/" className="text-primary-600 hover:underline">
                    Voltar para Home
                </Link>
            </div>
        </div>
    );
}
