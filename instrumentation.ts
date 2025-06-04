// This file is instrumented by Next.js automatically
// It runs at the start of the application, both in client and server environments

// Force SSR to use React production bundle
if (typeof window === 'undefined') {
  (process.env as any).NODE_ENV = 'production';
}

// Aplicar workarounds para React DOM no SSR
if (typeof globalThis !== 'undefined' && typeof window === 'undefined') {
  try {
    const { setupReactDOMWorkarounds } = require('./lib/react-dom-ssr-workarounds');
    setupReactDOMWorkarounds();
  } catch (e: any) {
    console.warn('Failed to apply React DOM SSR workarounds:', e.message);
  }
}

export function register() {
  // Este método é chamado pelo Next.js durante a inicialização
  // Podemos adicionar mais lógica de inicialização aqui se necessário
}
