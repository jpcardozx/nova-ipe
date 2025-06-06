import React, { ReactNode } from 'react';

/**
 * Componente stub criado automaticamente para @components/BadgeFeature
 * Este componente é uma implementação minimalista para permitir o build
 */
export default function BadgeFeature({
  children,
  ...props
}: {
  children?: ReactNode;
  [key: string]: any;
}) {
  return (
    <div className="stub-component badgefeature" {...props}>
      {children || <div>Stub para BadgeFeature</div>}
    </div>
  );
}
