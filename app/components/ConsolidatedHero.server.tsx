// filepath: app/components/ConsolidatedHero.server.tsx
import dynamic from 'next/dynamic';

// Dynamically load the client-only hero, disable SSR
const ConsolidatedHeroClient = dynamic(
    () => import('./ConsolidatedHero.client').then(mod => mod.default),
    { ssr: false }
);

export default function ConsolidatedHero() {
    return <ConsolidatedHeroClient />;
}
