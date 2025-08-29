'use client';

import { useEffect, useState, ReactNode } from 'react';

interface ClientOnlyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ClientOnlyWrapper({ children, fallback = null }: ClientOnlyWrapperProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Higher-order component for client-only components
export function withClientOnly<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function ClientOnlyComponent(props: P) {
    return (
      <ClientOnlyWrapper fallback={fallback}>
        <Component {...props} />
      </ClientOnlyWrapper>
    );
  };
}