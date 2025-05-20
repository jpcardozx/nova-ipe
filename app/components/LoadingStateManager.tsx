'use client';

import { useEffect, useState } from 'react';

/**
 * Componente que remove o estado de carregamento do HTML
 * após a página carregar completamente, com tratamento de erros aprimorado
 */
export default function LoadingStateManager() {
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Protege contra erros durante a inicialização
        try {
            setIsInitialized(true);

            // Função para remover o estado de carregamento com tratamento de erros
            const removeLoadingState = () => {
                try {
                    const htmlElement = document.documentElement;
                    if (htmlElement) {
                        htmlElement.removeAttribute('data-loading-state');
                        htmlElement.setAttribute('data-loaded', 'true');

                        // Forçando repintura do DOM para garantir visibilidade
                        document.body.style.opacity = '1';
                        requestAnimationFrame(() => {
                            try {
                                document.body.style.visibility = 'visible';
                            } catch (innerErr: any) {
                                console.warn('Failed to update body visibility:', innerErr);
                            }
                        });
                    }
                } catch (err: any) {
                    console.warn('Error in removeLoadingState:', err);
                }
            };

            // Executa em uma Promise para isolar potenciais erros
            Promise.resolve().then(() => {
                // Chamada imediata para casos onde o conteúdo já está carregado
                removeLoadingState();
            });

            // Adiciona listener para quando a página estiver totalmente carregada
            const safeAddEventListener = (event: string, handler: EventListener): boolean => {
                try {
                    window.addEventListener(event, handler);
                    return true;
                } catch (err: any) {
                    console.warn(`Failed to add ${event} listener:`, err);
                    return false;
                }
            };

            // Tenta registrar os eventos com tratamento de erro
            const hasLoadListener = safeAddEventListener('load', removeLoadingState as EventListener);
            const hasDOMListener = safeAddEventListener('DOMContentLoaded', removeLoadingState as EventListener);

            // Múltiplos timeouts com intervalos progressivos para garantir que o estado mude
            const timeouts: NodeJS.Timeout[] = [];

            try {
                timeouts.push(setTimeout(removeLoadingState, 800));
                timeouts.push(setTimeout(removeLoadingState, 1500));
                timeouts.push(setTimeout(removeLoadingState, 2500));
                timeouts.push(setTimeout(() => {
                    removeLoadingState();
                    try {
                        document.body.classList.add('force-visible');
                    } catch (err: any) {
                        console.warn('Failed to add force-visible class:', err);
                    }
                }, 3000));
            } catch (err: any) {
                console.warn('Failed to set timeouts:', err);
            }

            // Cleanup com tratamento de erros
            return () => {
                try {
                    if (hasLoadListener) window.removeEventListener('load', removeLoadingState as EventListener);
                    if (hasDOMListener) window.removeEventListener('DOMContentLoaded', removeLoadingState as EventListener);
                    timeouts.forEach(id => clearTimeout(id));
                } catch (err: any) {
                    console.warn('Error during LoadingStateManager cleanup:', err);
                }
            };
        } catch (err: any) {
            console.warn('Critical error in LoadingStateManager:', err);
            return () => { }; // Cleanup vazio para casos de erro crítico
        }
    }, []);

    // Renderiza null de forma segura
    return null;
}
