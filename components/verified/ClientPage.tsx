'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import SkeletonLoader from './SkeletonLoader';

// Lazy-loaded components for optimal client-side performance
export const PropertyFeatureTabs = dynamic(() => import('./PropertyFeatureTabs'), {
    loading: () => <SkeletonLoader variant="simple" height="300px" />
});

export const TestimonialsSection = dynamic(() => import('../../app/sections/Testimonials'), {
    loading: () => <SkeletonLoader variant="simple" height="400px" />
});

export const ContactSection = dynamic(() => import('../../app/sections/Contact'), {
    loading: () => <SkeletonLoader variant="simple" height="300px" />
});

// Client wrapper component
interface ClientPageProps {
    children: ReactNode;
}

export default function ClientPage({ children }: ClientPageProps) {
    return <>{children}</>;
} 
