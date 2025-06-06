'use client';

/**
 * Serviço de recuperação automática para ChunkLoadError
 * Este componente monitora erros de carregamento de chunks e
 * tenta recarregar a página automaticamente quando ocorrem
 */
export default function ChunkRecoveryService() {
    if (typeof window !== 'undefined') {
        // Detecta e intercepta ChunkLoadError
        window.addEventListener('error', function (event) {
            // Verifica se é um erro de carregamento de chunk
            const isChunkError =
                (event.error &&
                    (event.error.name === 'ChunkLoadError' ||
                        event.error.message.includes('Loading chunk') ||
                        event.error.message.includes('Failed to fetch dynamically imported module'))) ||
                (event.message &&
                    (event.message.includes('ChunkLoadError') ||
                        event.message.includes('Loading chunk') ||
                        event.message.includes('Failed to fetch')));

            if (isChunkError) {
                console.warn('ChunkRecoveryService: Detectado erro de carregamento de chunk', event);

                // Mostra mensagem ao usuário se não estivermos em recovery mode
                if (!sessionStorage.getItem('chunk_recovery_attempt')) {
                    console.log('ChunkRecoveryService: Tentando recuperação automática...');

                    // Marca que estamos tentando recuperar para evitar loop
                    sessionStorage.setItem('chunk_recovery_attempt', '1');

                    // Espera um momento antes de recarregar
                    setTimeout(() => {
                        // Garante visibilidade da página antes de recarregar
                        try {
                            document.documentElement.removeAttribute('data-loading-state');
                            document.body.style.visibility = 'visible';
                            document.body.style.opacity = '1';
                        } catch (e) {
                            // Ignora erros ao manipular DOM
                        }

                        // Recarrega a página para tentar novamente
                        window.location.reload();
                    }, 1500);
                } else {
                    // Se já tentou uma vez, limpa o flag de recuperação para tentar na próxima visita
                    console.warn('ChunkRecoveryService: Falha na recuperação automática');
                    sessionStorage.removeItem('chunk_recovery_attempt');
                }
            }
        }, true);

        // Limpa o sinalizador de recuperação após carregamento bem-sucedido
        window.addEventListener('load', function () {
            if (sessionStorage.getItem('chunk_recovery_attempt')) {
                console.log('ChunkRecoveryService: Página carregada com sucesso após recuperação');
                sessionStorage.removeItem('chunk_recovery_attempt');
            }
        });
    }

    return null;
}
