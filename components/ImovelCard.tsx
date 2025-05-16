import React, { ReactNode } from 'react';

/**
 * Componente stub criado automaticamente para @components/ImovelCard
 * Este componente é uma implementação minimalista para permitir o build
 */
export default function ImovelCard({
  children,
  ...props
}: {
  children?: ReactNode;
  [key: string]: any;
}) {
  return (
    <div className="stub-component imovelcard" {...props}>
      {children || <div>Stub para ImovelCard</div>}
    </div>
  );
}
