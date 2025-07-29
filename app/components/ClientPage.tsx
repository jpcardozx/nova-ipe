'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

// Simple loading component
const SimpleLoader = ({ height = "300px" }: { height?: string }) => (
    <div 
        className="animate-pulse bg-gray-200 rounded-lg"
        style={{ height }}
    />
);

// Lazy-loaded components for optimal client-side performance
export const PropertyFeatureTabs = dynamic(() => import('./PropertyFeatureTabs'), {
    loading: () => <SimpleLoader height="300px" />
});

export const TestimonialsSection = dynamic(() => import('../sections/Testimonials'), {
    loading: () => <SimpleLoader height="400px" />
});

export const ContactSection = dynamic(() => import('../sections/Contact'), {
    loading: () => <SimpleLoader height="300px" />
});

// Client wrapper component
interface ClientPageProps {
    children: ReactNode;
}

export default function ClientPage({ children }: ClientPageProps) {
    return <>{children}</>;
} 