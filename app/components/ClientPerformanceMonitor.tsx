'use client';

import dynamic from 'next/dynamic';

const PerformanceMonitor = dynamic(
    () => import('./PerformanceMonitor'),
    { ssr: false }
);

export default function ClientPerformanceMonitor() {
    return <PerformanceMonitor />;
}