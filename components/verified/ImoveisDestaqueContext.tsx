import React, { ReactNode } from 'react';

export interface ImoveisDestaqueContextProps {
  children?: ReactNode;
  [key: string]: any;
}

/**
 * Stub hook para useImoveisDestaque
 */
export function useImoveisDestaque() {
  return {
    state: {
      imoveis: [],
      activeImovel: null
    },
    setActiveImovel: (id: any) => { }
  };
}

/**
 * Componente stub criado automaticamente para @components/ImoveisDestaqueContext
 * Este componente é uma implementação minimalista para permitir o build
 */
export default function ImoveisDestaqueContext({
  children,
  ...props
}: ImoveisDestaqueContextProps) {
  return (
    <div className="stub-component imoveisdestaquecontext" {...props}>
      {children || <div>Stub para ImoveisDestaqueContext</div>}
    </div>
  );
}