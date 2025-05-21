'use client';

import dynamic from 'next/dynamic';
import type { LucideProps } from '../../types/lucide-react';

// Type to ensure correct icon name
type IconName =
    | 'Home' | 'MapPin' | 'BedDouble' | 'Bath' | 'Car' | 'AreaChart'
    | 'Star' | 'Heart' | 'ArrowRight' | 'ArrowUpRight' | 'ChevronLeft'
    | 'ChevronRight' | 'Filter' | 'SlidersHorizontal' | 'Clock'
    | 'TrendingUp' | 'XCircle' | 'Check' | 'ImageOff' | 'Sparkles'
    | 'Scale' | 'Camera' | 'Share2' | 'Search' | 'Award' | 'Building2'
    | 'Shield' | 'Zap' | 'Calendar' | 'UserCheck' | 'Phone';

/**
 * Optimized icon loading system that improves performance by:
 * 1. Loading only the icons that are actually used
 * 2. Dynamically importing icons on demand
 * 3. Using a caching system to avoid duplicate imports
 */

// Cache for already loaded icons to prevent duplicate imports
const iconCache: Record<string, React.ComponentType<LucideProps>> = {};

/**
 * Optimized function to load Lucide icons on demand
 * This improves performance by only loading the specific icons needed
 * and reusing already imported icons
 * 
 * @param name The name of the Lucide icon to load
 * @returns A promise resolving to the icon component
 */
export const loadIcon = async (name: IconName): Promise<React.ComponentType<LucideProps>> => {
    // Return from cache if already loaded
    if (iconCache[name]) {
        return iconCache[name];
    }

    // Import the specific icon dynamically
    const icon = await import('lucide-react').then(module => module[name]);

    // Store in cache for future use
    iconCache[name] = icon;

    return icon;
};

/**
 * Creates a dynamically loaded icon component
 * Uses Next.js dynamic import with SSR disabled for best performance
 * 
 * @param name The name of the icon to load
 * @returns A dynamically loaded React component
 */
export const createDynamicIcon = (name: IconName) => {
    return dynamic(
        () => import('lucide-react').then((mod) => mod[name] as React.ComponentType<LucideProps>),
        { ssr: true, loading: () => <div className="w-4 h-4" /> }
    );
};

// Pre-defined optimized icons for common usage
export const OptimizedIcons = {
    Home: createDynamicIcon('Home'),
    BedDouble: createDynamicIcon('BedDouble'),
    Bath: createDynamicIcon('Bath'),
    Car: createDynamicIcon('Car'),
    MapPin: createDynamicIcon('MapPin'),
    AreaChart: createDynamicIcon('AreaChart'),
    Heart: createDynamicIcon('Heart'),
    ArrowRight: createDynamicIcon('ArrowRight'),
    Star: createDynamicIcon('Star'),
    ChevronLeft: createDynamicIcon('ChevronLeft'),
    ChevronRight: createDynamicIcon('ChevronRight'),
};

export default OptimizedIcons;
