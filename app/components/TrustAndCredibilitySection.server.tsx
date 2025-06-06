// filepath: app/components/TrustAndCredibilitySection.server.tsx
import dynamic from 'next/dynamic';
import { TESTIMONIALS } from './TrustAndCredibilityData';

// Load client-side component only in browser
const TrustAndCredibilitySectionClient = dynamic(
    () => import('./TrustAndCredibilitySection.client'), // Adjusted for default export
    { ssr: false }
);

export default function TrustAndCredibilitySection() {
    return <TrustAndCredibilitySectionClient testimonials={TESTIMONIALS} />;
}
