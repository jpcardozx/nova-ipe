'use client';

import dynamic from 'next/dynamic';

const WebVitals = dynamic(
    () => import('./WebVitals'),
    { ssr: false }
);

export default function ClientWebVitals() {
    return <WebVitals />;
}
