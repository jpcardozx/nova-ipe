'use client';

import React, { createContext } from 'react';

/**
 * ActionQueueProvider
 * Corrige o erro "Error: Invariant: Missing ActionQueueContext" no Next.js 14
 */

// Cria um contexto falso para o ActionQueue
// @ts-ignore - Ignora erros de tipagem pois é um hack para componente interno
const ActionQueueContext = createContext({
  ping: () => {},
  invalidate: () => {},
  refresh: () => {},
  reset: () => {},
});

// Patch global para o Next.js interno
if (typeof window !== 'undefined') {
  try {
    // @ts-ignore - Acessa propriedades internas do Next.js
    window.__NEXT_ACTION_QUEUE_CONTEXT = ActionQueueContext;
  } catch (e) {
    console.warn('Falha ao aplicar patch para ActionQueueContext:', e);
  }
}

// Fornece o ActionQueueContext para toda a árvore de componentes
export function ActionQueueProvider({ children }) {
  return (
    <ActionQueueContext.Provider 
      value={{
        ping: () => {},
        invalidate: () => {},
        refresh: () => {},
        reset: () => {},
      }}
    >
      {children}
    </ActionQueueContext.Provider>
  );
}

export default ActionQueueProvider;
