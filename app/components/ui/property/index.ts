'use client';

// Barrel file for property-related components
import PropertyCardUnified from './PropertyCardUnified';

// Re-export types for external use
export type { 
  PropertyType, 
  PropertyStatus,
  BasePropertyProps,
  PropertyCardUnifiedProps 
} from './PropertyCardUnified';

// Export components
export { PropertyCardUnified };
