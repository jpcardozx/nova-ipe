'use client';

/**
 * DebugButton.tsx
 * Botão para ativar ferramentas de diagnóstico
 */

import { useState, useCallback } from 'react';
import styles from './DebugButton.module.css';

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
        <div className={styles.debugButtonContainer}>
            <button
                onClick={activatePerformancePanel}
                className={styles.activateButton}
            >
                <span className={styles.icon}>📊</span>
                Ativar Painel de Performance
            </button>

            <button
                onClick={() => setVisible(false)}
                className={styles.hideButton}
            >
                Ocultar Botão
            </button>
        </div>
    );
}
