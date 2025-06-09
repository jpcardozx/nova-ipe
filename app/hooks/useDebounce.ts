'use client';

import { useState, useEffect } from 'react';

/**
 * Hook para debounce de valores
 * @param value Valor a ser debounced
 * @param delay Atraso em milissegundos
 * @returns Valor após o delay
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configura o timer de delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancela o timer se o valor mudar antes do delay
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
