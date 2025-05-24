
// Optimized page component template
'use client';

import { Suspense, lazy } from 'react';
import dynamic from 'next/dynamic';

// Critical components loaded immediately
import CriticalNavBar from './components/CriticalNavBar';
import CriticalHero from './components/CriticalHero';

// Heavy components loaded dynamically
const HeavyComponent = dynamic(() => import('./components/HeavyComponent'), {
  loading: () => <div className="h-40 bg-gray-100 animate-pulse" />,
  ssr: false
});

// Below-fold components loaded after interaction
const BelowFoldContent = lazy(() => import('./components/BelowFoldContent'));

export default function OptimizedPage() {
  return (
    <div>
      {/* Critical above-fold content */}
      <CriticalNavBar />
      <CriticalHero />
      
      {/* Heavy components with loading states */}
      <Suspense fallback={<div className="h-40 bg-gray-100 animate-pulse" />}>
        <HeavyComponent />
      </Suspense>
      
      {/* Below-fold content loaded lazily */}
      <Suspense fallback={null}>
        <BelowFoldContent />
      </Suspense>
    </div>
  );
}
