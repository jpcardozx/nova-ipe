'use client';

/**
 * This file serves as a wrapper/proxy for next-sanity functionality
 * to handle React 18.3.1 compatibility issues.
 */

import '../../sanity-react-compat';

// Re-export the functionality from next-sanity
import { NextStudio as OriginalNextStudio } from 'next-sanity/studio';

// Create a wrapped version of NextStudio that ensures compatibility
export const NextStudio = (props) => {
  // Apply any compatibility fixes if needed
  return <OriginalNextStudio {...props} />;
};

// Re-export everything else
export * from 'next-sanity';
