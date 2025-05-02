// app/studio/page.tsx
'use client'

import dynamic from 'next/dynamic'
import { sanityConfig } from '../../sanity.config'

// Carrega o NextStudio apenas no client
const NextStudio = dynamic(
    () => import('next-sanity/studio').then((mod) => mod.NextStudio),
    { ssr: false }
)

export default function StudioPage() {
    return <NextStudio config={sanityConfig} />
}
