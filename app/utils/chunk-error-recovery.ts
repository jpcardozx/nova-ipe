'use client';

/**
 * Utilitário para recuperação de erros em chunks
 * Implementa uma estratégia robusta para lidar com falhas no carregamento
 */

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 segundo

interface ChunkRetryState {
    attempts: number;
    lastAttempt: number;
}

const retryState = new Map<string, ChunkRetryState>();

/**
 * Tenta recarregar um chunk que falhou
 */
export async function retryChunkLoad(chunkId: string): Promise<boolean> {
    const state = retryState.get(chunkId) || { attempts: 0, lastAttempt: 0 };

    // Verificar se já excedeu tentativas
    if (state.attempts >= RETRY_ATTEMPTS) {
        console.warn(`Chunk ${chunkId} falhou após ${RETRY_ATTEMPTS} tentativas`);
        return false;
    }

    // Esperar um pouco entre tentativas
    const now = Date.now();
    const timeSinceLastAttempt = now - state.lastAttempt;
    if (timeSinceLastAttempt < RETRY_DELAY) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY - timeSinceLastAttempt));
    }

    try {
        // Tentar limpar o cache do chunk
        if ('caches' in window) {
            const cache = await caches.open('nova-ipe-chunk-cache-v4');
            const keys = await cache.keys();
            const chunkKey = keys.find(key => key.url.includes(chunkId));
            if (chunkKey) {
                await cache.delete(chunkKey);
            }
        }

        // Forçar recarregamento do chunk
        const chunkUrl = `/_next/static/chunks/${chunkId}`;
        await fetch(chunkUrl, { cache: 'reload' });

        // Atualizar estado de tentativas
        retryState.set(chunkId, {
            attempts: state.attempts + 1,
            lastAttempt: Date.now()
        });

        return true;
    } catch (error) {
        console.error(`Erro ao recarregar chunk ${chunkId}:`, error);
        return false;
    }
}

/**
 * Registra um handler global para erros de carregamento de chunks
 */
export function setupChunkErrorHandler() {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', async (event) => {
        const error = event.error;

        // Verificar se é um erro de carregamento de chunk
        if (error && error.message && error.message.includes('chunk')) {
            event.preventDefault(); // Prevenir o erro padrão

            // Extrair o ID do chunk da mensagem de erro
            const chunkIdMatch = error.message.match(/chunk\s+["']([^"']+)["']/i);
            if (chunkIdMatch) {
                const chunkId = chunkIdMatch[1];
                await retryChunkLoad(chunkId);
            }
        }
    });
}
