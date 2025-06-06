'use client';

/**
 * React SSR Layout Effect Suppressor
 * 
 * Este arquivo suprime os avisos de useLayoutEffect durante o SSR no Next.js 14
 * Ele deve ser importado no início do arquivo layout.tsx raiz
 */

if (typeof window === 'undefined') {
  // Estamos no servidor - suprimir aviso de useLayoutEffect
  try {
    // Monkey patch useLayoutEffect durante o SSR
    const originalError = console.error;
    
    console.error = function(...args) {
      const msg = args[0] || '';
      
      // Verifica se é o aviso de useLayoutEffect que queremos suprimir
      if (typeof msg === 'string' && msg.includes('useLayoutEffect does nothing on the server')) {
        // Ignorar este aviso específico
        return;
      }
      
      // Passa todos os outros erros para o console.error original
      return originalError.apply(console, args);
    };
  } catch (error) {
    // Em caso de falha, apenas continua normalmente
    console.warn('Falha ao aplicar patch para useLayoutEffect:', error);
  }
}

// Export vazio apenas para satisfazer o ESM
export {};
