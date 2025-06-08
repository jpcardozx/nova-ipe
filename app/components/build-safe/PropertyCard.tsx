'use client';

// This is a wrapper module to ensure all property card components
// are properly exported with a consistent pattern to avoid build issues

import React from 'react';
import PropertyCardUnifiedOriginal from '../ui/property/PropertyCardUnified';
export type { PropertyType, PropertyStatus, BasePropertyProps } from '../ui/property/PropertyCardUnified';
import type { PropertyCardUnifiedProps } from '../ui/property/PropertyCardUnified';

// Re-export with a consistent name
const PropertyCard = PropertyCardUnifiedOriginal;

// Verify the component exists during runtime
if (!PropertyCard) {
    console.error('⚠️ PropertyCard is undefined in build-safe module!');
}

export { PropertyCard };
export default PropertyCard;
