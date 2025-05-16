import React, { ReactNode } from 'react';

/**
 * Componente stub criado automaticamente para @components/SanityImage
 * Este componente é uma implementação minimalista para permitir o build
 */
export default function SanityImage({
  children,
  ...props
}: {
  children?: ReactNode;
  [key: string]: any;
}) {
  return (
    <div className="stub-component sanityimage" {...props}>
      {children || <div>Stub para SanityImage</div>}
    </div>
  );
}
