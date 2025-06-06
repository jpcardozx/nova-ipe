/**
 * React Refractor Wrapper
 * 
 * This wrapper provides a default export for react-refractor,
 * which normally only exports named exports.
 * 
 * This fixes import issues with Sanity UI which expects a default export.
 */

import { Refractor, hasLanguage, registerLanguage } from 'react-refractor';

// Export Refractor as default
export default Refractor;

// Also export the named exports for compatibility
export { Refractor, hasLanguage, registerLanguage };
