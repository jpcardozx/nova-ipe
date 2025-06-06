/**
 * SSR Safe Polyfill - ÚNICA FONTE DE VERDADE
 * 
 * Este é o ÚNICO polyfill no projeto. Todos os outros foram removidos.
 * Resolve o erro "self is not defined" de forma simples e definitiva.
 * 
 * @version 1.0.0 FINAL
 * @date June 4, 2025
 */

// Aplicar apenas no servidor (Node.js)
if (typeof window === 'undefined' && typeof global !== 'undefined') {
  
  // 1. Definir 'self' globalmente
  if (typeof global.self === 'undefined') {
    global.self = global;
  }
  
  // 2. Inicializar array webpack do Next.js
  if (!global.webpackChunk_N_E) {
    global.webpackChunk_N_E = [];
  }
  
  // 3. Conectar self.webpackChunk_N_E ao global
  if (global.self && !global.self.webpackChunk_N_E) {
    global.self.webpackChunk_N_E = global.webpackChunk_N_E;
  }
  
  // 4. Compatibilidade com globalThis
  if (typeof globalThis !== 'undefined') {
    if (typeof globalThis.self === 'undefined') {
      globalThis.self = global;
    }
    if (!globalThis.webpackChunk_N_E) {
      globalThis.webpackChunk_N_E = global.webpackChunk_N_E;
    }
  }
  
  // Log apenas em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ SSR Safe polyfill aplicado');
  }
}

module.exports = {};
