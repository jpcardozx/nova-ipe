'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle, CheckCircle, Clock, Activity } from 'lucide-react';
import { useFallback } from '../../contexts/fallback-context';

export interface SystemStatusProps {
    className?: string;
    showDetails?: boolean;
    compact?: boolean;
}

/**
 * System status indicator showing Sanity connection health and fallback status
 */
export function SystemStatus({
    className = '',
    showDetails = false,
    compact = false
}: SystemStatusProps) {
    const { isFallbackActive, fallbackStats, retryConnection } = useFallback();
    const [isRetrying, setIsRetrying] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdate(new Date());
        }, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
    }, []);

    const handleRetry = async () => {
        setIsRetrying(true);
        try {
            await retryConnection();
        } finally {
            setIsRetrying(false);
        }
    };

    const getStatusColor = () => {
        if (isFallbackActive) return 'text-amber-600';
        return 'text-green-600';
    };

    const getStatusIcon = () => {
        if (isRetrying) return <Activity className="h-4 w-4 animate-spin" />;
        if (isFallbackActive) return <WifiOff className="h-4 w-4" />;
        return <Wifi className="h-4 w-4" />;
    };

    const getStatusText = () => {
        if (isRetrying) return 'Reconectando...';
        if (isFallbackActive) return 'Modo Limitado';
        return 'Online';
    };

    if (compact) {
        return (
            <div className={`flex items-center space-x-2 ${className}`}>
                <div className={`${getStatusColor()}`}>
                    {getStatusIcon()}
                </div>
                <span className={`text-sm ${getStatusColor()}`}>
                    {getStatusText()}
                </span>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg border shadow-sm p-4 ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className={`${getStatusColor()}`}>
                        {getStatusIcon()}
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-900">
                            Status do Sistema
                        </h3>
                        <p className={`text-sm ${getStatusColor()}`}>
                            {getStatusText()}
                        </p>
                    </div>
                </div>

                {isFallbackActive && (
                    <button
                        onClick={handleRetry}
                        disabled={isRetrying}
                        className="px-3 py-1 text-sm bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 disabled:opacity-50 transition-colors"
                    >
                        {isRetrying ? 'Tentando...' : 'Reconectar'}
                    </button>
                )}
            </div>

            {showDetails && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500">Última atualização:</span>
                            <p className="font-medium">
                                {lastUpdate.toLocaleTimeString()}
                            </p>
                        </div>
                        <div>
                            <span className="text-gray-500">Fallbacks recentes:</span>
                            <p className="font-medium">
                                {fallbackStats.recentUsages}
                            </p>
                        </div>
                    </div>

                    {isFallbackActive && (
                        <div className="mt-3 p-3 bg-amber-50 rounded-md">
                            <div className="flex items-start space-x-2">
                                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                                <div className="text-sm text-amber-800">
                                    <p className="font-medium">Sistema em Modo Limitado</p>
                                    <p className="mt-1">
                                        Alguns dados podem estar desatualizados.
                                        O sistema está usando dados em cache para manter a funcionalidade.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!isFallbackActive && (
                        <div className="mt-3 p-3 bg-green-50 rounded-md">
                            <div className="flex items-start space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                <div className="text-sm text-green-800">
                                    <p className="font-medium">Sistema Operacional</p>
                                    <p className="mt-1">
                                        Todos os sistemas estão funcionando normalmente.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

/**
 * Minimal status badge for headers/navigation
 */
export function SystemStatusBadge({ className = '' }: { className?: string }) {
    const { isFallbackActive } = useFallback();

    if (!isFallbackActive) return null;

    return (
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 ${className}`}>
            <WifiOff className="h-3 w-3 mr-1" />
            Modo Limitado
        </div>
    );
}

/**
 * Status indicator for property listings
 */
export function PropertyListingStatus({ className = '' }: { className?: string }) {
    const { isFallbackActive, fallbackStats } = useFallback();

    if (!isFallbackActive) return null;

    return (
        <div className={`bg-amber-50 border border-amber-200 rounded-lg p-3 ${className}`}>
            <div className="flex items-start space-x-2">
                <Clock className="h-4 w-4 text-amber-600 mt-0.5" />
                <div className="text-sm">
                    <p className="font-medium text-amber-800">
                        Dados Temporários
                    </p>
                    <p className="text-amber-700 mt-1">
                        Os imóveis exibidos podem não refletir a disponibilidade atual.
                        Estamos trabalhando para restaurar a conexão com nosso sistema principal.
                    </p>
                    {fallbackStats.recentUsages > 0 && (
                        <p className="text-xs text-amber-600 mt-2">
                            Última atualização há {Math.floor((Date.now() - (fallbackStats.lastUsage?.getTime() || 0)) / 60000)} minutos
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}