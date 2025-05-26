// app/studio/page.tsx
'use client'

import dynamic from 'next/dynamic'

// Prevent Sentry from loading in studio page to avoid conflicts
if (typeof window !== 'undefined') {
    // Disable Sentry for studio page
    (window as any).__SENTRY__ = undefined;
}

// Carrega o NextStudio apenas no client com isolamento de Sentry
const NextStudio = dynamic(
    () => import('next-sanity/studio').then((mod) => mod.NextStudio),
    {
        ssr: false,
        loading: () => <div>Loading Studio...</div>
    }
)

// Import config dynamically to avoid Sentry conflicts during build
const StudioConfig = dynamic(
    () => import('../../sanity.config').then(mod => ({ default: () => <NextStudio config={mod.sanityConfig} /> })),
    {
        ssr: false,
        loading: () => <div>Loading Studio Configuration...</div>
    }
)

export default function StudioPage() {
    return <StudioConfig />
}
