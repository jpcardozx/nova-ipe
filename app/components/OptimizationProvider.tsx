'use client';

import { ReactNode } from 'react';

interface OptimizationProviderProps {
  children: ReactNode;
}

export default function OptimizationProvider({ children }: OptimizationProviderProps) {
  return <>{children}</>;
}