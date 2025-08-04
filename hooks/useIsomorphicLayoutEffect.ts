'use client';

import { useEffect, useLayoutEffect } from 'react';

/**
 * Hook para executar efeitos de forma isomórfica
 * Usa useLayoutEffect no cliente e useEffect no servidor
 */
export const useIsomorphicLayoutEffect = 
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
