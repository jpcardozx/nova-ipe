import React, { ReactNode } from 'react';

/**
 * Stub components for Badge and Feature
 */
const Badge = ({ children, ...props }: { children?: ReactNode;[key: string]: any }) => (
  <span className="stub-badge" {...props}>{children}</span>
);

const Feature = ({ children, ...props }: { children?: ReactNode;[key: string]: any }) => (
  <div className="stub-feature" {...props}>{children}</div>
);

/**
 * Componente stub criado automaticamente para @components/BadgeFeature
 * Este componente é uma implementação minimalista para permitir o build
 */
function BadgeFeature({
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

// Add Badge and Feature as properties
BadgeFeature.Badge = Badge;
BadgeFeature.Feature = Feature;

export default BadgeFeature;
