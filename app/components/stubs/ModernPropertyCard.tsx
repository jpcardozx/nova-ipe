/**
 * STUB REDIRECT - ModernPropertyCard  
 * 
 * This component has been consolidated into PropertyCardUnified.tsx
 * This stub maintains backward compatibility during migration.
 * 
 * @deprecated Use PropertyCardUnified from components/ui/property/PropertyCardUnified
 * @migration Replace imports: import PropertyCardUnified from 'components/ui/property/PropertyCardUnified'
 */

console.warn(
    '⚠️  ModernPropertyCard is deprecated. Use PropertyCardUnified instead.\n' +
    '   Import: import PropertyCardUnified from "components/ui/property/PropertyCardUnified"'
);

// Re-export the unified component
export { default } from '../../../components/ui/property/PropertyCardUnified';
export type { 
    default as PropertyCardUnifiedProps,
    PropertyType 
} from '../../../components/ui/property/PropertyCardUnified';

// Legacy type alias for backward compatibility
export type ModernPropertyCardProps = PropertyCardUnifiedProps;

/**
 * Migration Guide:
 * 
 * Before:
 * import ModernPropertyCard from './ModernPropertyCard';
 * 
 * After:  
 * import PropertyCardUnified from 'components/ui/property/PropertyCardUnified';
 * 
 * The PropertyCardUnified component includes all the modern features:
 * - Premium styling with gradients and animations
 * - Interactive elements (heart, view buttons)
 * - Professional badges (new, featured, type)
 * - Optimized image handling with hover effects
 * - Responsive design with mobile-first approach
 * - Consistent typography from design system
 * 
 * This stub will be removed in the next major version.
 */