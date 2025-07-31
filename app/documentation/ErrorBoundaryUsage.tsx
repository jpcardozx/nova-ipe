import React, { ReactNode, FC } from 'react';
// ErrorBoundaryWrapper.tsx
'use client';

import { ErrorBoundary } from '@/components/verified/ErrorBoundary';

interface Props {
  children: ReactNode;
}

export const ErrorBoundaryWrapper: FC<Props> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-8 text-center bg-red-100 text-red-800 rounded-lg">
          <h2 className="text-lg font-semibold">Erro inesperado</h2>
          <p className="mt-2">Tente recarregar a página ou entre em contato com o suporte.</p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};
