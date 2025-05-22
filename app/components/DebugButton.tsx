'use client';

/**
 * DebugButton.tsx
 * Botão para ativar ferramentas de diagnóstico
 */

import { useState, useCallback } from 'react';

export default function DebugButton() {
    const [visible, setVisible] = useState(true);

    // Função para ativar painel de performance
    const activatePerformancePanel = useCallback(() => {
        if (typeof window === 'undefined') return;

        try {
            // Armazenar a preferência no localStorage
            window.localStorage?.setItem('force_performance_panel', 'true');

            // Adicionalmente, adicionar parâmetro à URL para compatibilidade
            const url = new URL(window.location.href);
            url.searchParams.set('debug', 'performance');

            // Atualizar a URL com pushState
            if (typeof (window as any).history?.pushState === 'function') {
                (window as any).history.pushState({}, '', url.toString());
            } else {
                // Fallback se pushState não estiver disponível
                window.location.href = url.toString();
                return; // Não precisa recarregar, pois o href já fará isso
            }

            // Recarregar a página para aplicar as alterações
            window.location.reload();
        } catch (error) {
            console.error('Error activating performance panel:', error);
            // Fallback simples: apenas recarregar com parâmetro
            window.location.href = window.location.href +
                (window.location.href.includes('?') ? '&' : '?') +
                'debug=performance';
        }
    }, []);

    if (!visible) return null;

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '10px',
                left: '10px',
                zIndex: 9998,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
            }}
        >
            <button
                onClick={activatePerformancePanel}
                style={{
                    backgroundColor: '#0D1F2D',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}
            >
                <span style={{ fontSize: '14px' }}>📊</span>
                Ativar Painel de Performance
            </button>

            <button
                onClick={() => setVisible(false)}
                style={{
                    backgroundColor: 'transparent',
                    color: '#666',
                    border: '1px solid #ccc',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '10px'
                }}
            >
                Ocultar Botão
            </button>
        </div>
    );
}
