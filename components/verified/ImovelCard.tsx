import React, { ReactNode } from 'react';

export interface ImovelCardProps {
  children?: ReactNode;
  [key: string]: any;
}

/**
 * Componente stub criado automaticamente para @components/ImovelCard
 * Este componente é uma implementação minimalista para permitir o build
 */
export default function ImovelCard({
  children,
  ...props
}: ImovelCardProps) {
  return (
    <div className="stub-component imovelcard" {...props}>
      {children || <div>Stub para ImovelCard</div>}
    </div>
  );
}
